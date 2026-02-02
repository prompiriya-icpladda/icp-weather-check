import { RainAnimation } from "./RainAnimation";
import { SunAnimation } from "./SunAnimation";
import { CloudAnimation } from "./CloudAnimation";

export type WeatherCondition = "sunny" | "cloudy" | "rainy";

interface WeatherAnimationProps {
  condition: WeatherCondition;
}

export const WeatherAnimation = ({ condition }: WeatherAnimationProps) => {
  switch (condition) {
    case "rainy":
      return <RainAnimation />;
    case "cloudy":
      return <CloudAnimation />;
    case "sunny":
    default:
      return <SunAnimation />;
  }
};

export { RainAnimation, SunAnimation, CloudAnimation };
