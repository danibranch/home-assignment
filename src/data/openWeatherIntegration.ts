import { CustomError } from "../customError";

export async function getWeatherByCity(city: string, weatherConfig: {units: string}) {
    if (!process.env.OPEN_WEATHER_API_KEY) {
        throw new CustomError(500, "Open Weather API key is not set in environment variables");
    }

    let attempts = 1;
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=${weatherConfig.units}`);
            if (!response.ok) {
                throw new Error(`Error fetching weather data: ${response.statusText}`);
            }
            return await response.json();
        }
        catch (error) {
            if (attempts === maxAttempts) {
                throw error;
            }

            attempts++;
        }
    }
}