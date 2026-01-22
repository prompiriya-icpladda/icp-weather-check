import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ChartData {
  time: string;
  temp: number;
  humidity: number;
  pm25: number;
}

interface WeatherChartProps {
  data: ChartData[];
  delay?: number;
}

export const WeatherChart = ({ data, delay = 0 }: WeatherChartProps) => {
  // Take last 20 data points and reverse for chronological order
  const chartData = [...data].slice(0, 20).reverse();

  return (
    <div
      className="stat-card opacity-0 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h3 className="text-lg font-semibold text-foreground mb-6">
        แนวโน้มข้อมูลสภาพอากาศ
      </h3>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.5}
            />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value) => {
                if (!value) return "";
                const parts = value.split(":");
                return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : value;
              }}
              stroke="hsl(var(--border))"
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              stroke="hsl(var(--border))"
              domain={["auto", "auto"]}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              stroke="hsl(var(--border))"
              domain={[0, "auto"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "var(--shadow-card)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="circle"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="temp"
              name="อุณหภูมิ (°C)"
              stroke="hsl(var(--weather-temp))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="humidity"
              name="ความชื้น (%)"
              stroke="hsl(var(--weather-humidity))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="pm25"
              name="PM2.5 (μg/m³)"
              stroke="hsl(var(--weather-pm-moderate))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
