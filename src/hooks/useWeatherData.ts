import { useQuery } from "@tanstack/react-query";

export interface WeatherData {
  currentTemp: number;
  currentHumidity: number;
  currentPM25: number;
  lastUpdate: Date;
  history: {
    date: string;
    time: string;
    temp: number;
    humidity: number;
    pm25: number;
  }[];
}

const SHEET_ID = "1qf0tEZeVw2u9PCLh9McipSIlfDxk2X-PvUZIXwrOc8U";
// Using published CSV URL format (requires sheet to be published to web)
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

const parseCSVData = (csvText: string): WeatherData => {
  const lines = csvText.trim().split('\n');
  
  // Parse CSV lines - handle quoted values
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim().replace(/^"|"$/g, ''));
    return result;
  };

  // Structure based on the sheet:
  // Row 0: Empty headers
  // Row 1: Empty / labels row
  // Row 2: Headers - Temp, RH, PM2.5, Temp Now, Humidity Now, Dust Now
  // Row 3: Current values in columns F, G, H (indices 5, 6, 7)
  // Row 4+: Historical data (Date, Time, Temp, RH, PM2.5)
  
  let currentTemp = 0;
  let currentHumidity = 0;
  let currentPM25 = 0;
  const history: WeatherData['history'] = [];

  for (let i = 0; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    
    // Find current values - look for row with numbers in column F, G, H
    if (i >= 1 && i <= 4) {
      const tempNow = parseFloat(row[5]);
      const humidityNow = parseFloat(row[6]);
      const pm25Now = parseFloat(row[7]);
      
      if (!isNaN(tempNow) && tempNow > 0) {
        currentTemp = tempNow;
        currentHumidity = humidityNow || 0;
        currentPM25 = pm25Now || 0;
      }
    }
    
    // Historical data - look for rows with date patterns
    if (i >= 2) {
      const dateVal = row[0] || '';
      const timeVal = row[1] || '';
      const temp = parseFloat(row[2]);
      const humidity = parseFloat(row[3]);
      const pm25 = parseFloat(row[4]);
      
      // Check if this looks like a data row (has date or time)
      if ((dateVal.includes('/') || timeVal.includes(':')) && !isNaN(temp)) {
        history.push({
          date: dateVal,
          time: timeVal,
          temp: temp || 0,
          humidity: humidity || 0,
          pm25: Math.max(0, pm25 || 0), // Ensure non-negative
        });
        
        // Limit to 50 records for performance
        if (history.length >= 50) break;
      }
    }
  }

  // If no current values found, use latest from history
  if (currentTemp === 0 && history.length > 0) {
    currentTemp = history[0].temp;
    currentHumidity = history[0].humidity;
    currentPM25 = history[0].pm25;
  }

  return {
    currentTemp,
    currentHumidity,
    currentPM25,
    lastUpdate: new Date(),
    history,
  };
};

export const useWeatherData = () => {
  return useQuery({
    queryKey: ["weatherData"],
    queryFn: async (): Promise<WeatherData> => {
      try {
        const response = await fetch(SHEET_URL, {
          mode: 'cors',
          headers: {
            'Accept': 'text/csv,application/csv,*/*',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const text = await response.text();
        return parseCSVData(text);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000,
    retry: 3,
    retryDelay: 1000,
  });
};

export const getPM25Level = (value: number): {
  level: string;
  color: string;
  bgClass: string;
  description: string;
} => {
  if (value <= 25) {
    return {
      level: "ดีมาก",
      color: "weather-pm-good",
      bgClass: "pm-good",
      description: "คุณภาพอากาศดีเยี่ยม",
    };
  } else if (value <= 50) {
    return {
      level: "ปานกลาง",
      color: "weather-pm-moderate",
      bgClass: "pm-moderate",
      description: "คุณภาพอากาศพอใช้",
    };
  } else if (value <= 100) {
    return {
      level: "ไม่ดี",
      color: "weather-pm-unhealthy",
      bgClass: "pm-unhealthy",
      description: "กลุ่มเสี่ยงควรลดกิจกรรมกลางแจ้ง",
    };
  } else {
    return {
      level: "อันตราย",
      color: "weather-pm-hazardous",
      bgClass: "pm-hazardous",
      description: "หลีกเลี่ยงกิจกรรมกลางแจ้ง",
    };
  }
};
