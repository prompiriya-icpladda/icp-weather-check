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

const SHEET_ID = "1XDcGZ9uzkavDrwRQ3P3AhaooIoqNjWMNYku7SC0_ez0";
const SHEET_GID = "964154175";
// Using published CSV URL format (requires sheet to be published to web)
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${SHEET_GID}`;

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

  // New structure: Timestamp, Pm1.0, Pm2.5, Pm10, Temperature, Humidity
  // Row 0: Headers
  // Row 1+: Data rows
  
  let currentTemp = 0;
  let currentHumidity = 0;
  let currentPM25 = 0;
  const history: WeatherData['history'] = [];

  const allRows: WeatherData['history'] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    
    const timestamp = row[0] || '';
    const pm25 = parseFloat(row[2]);       // Pm2.5 (column C)
    const temp = parseFloat(row[4]);       // Temperature (column E)
    const humidity = parseFloat(row[5]);   // Humidity (column F)
    
    if (isNaN(temp) || isNaN(humidity)) continue;

    // Parse timestamp "2/3/2026, 15:52:50" -> date and time
    const parts = timestamp.split(', ');
    const dateVal = parts[0] || '';
    const timeVal = parts[1] || '';

    allRows.push({
      date: dateVal,
      time: timeVal,
      temp: temp || 0,
      humidity: humidity || 0,
      pm25: Math.max(0, pm25 || 0),
    });
  }

  // Keep only the last 50 rows (most recent data)
  const recentRows = allRows.slice(-50);
  history.push(...recentRows);

  // Use the latest data row as current values
  if (history.length > 0) {
    const latest = history[history.length - 1];
    currentTemp = latest.temp;
    currentHumidity = latest.humidity;
    currentPM25 = latest.pm25;
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
