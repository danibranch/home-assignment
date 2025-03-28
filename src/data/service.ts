import { getCoinGeckoData } from "./coinGeckoIntegration";
import { getWeatherByCity } from "./openWeatherIntegration"
import { Cache } from "./cache";
import { CustomError } from "../customError";

const cache = new Cache();

let configuration = {
    crypto: {
        currency: "eur"
    },
    weather: {
        units: "metric"
    }
}

export async function getData(query: {city: string; currency: string; refresh?: string}) {
    const refresh = query.refresh === "true";

    let weatherData = cache.get(query.city);
    if (!weatherData || refresh) {
        weatherData = await getWeatherByCity(query.city, configuration.weather);
        cache.set(query.city, weatherData);
    }

    let cryptoData = cache.get(query.currency);
    if (!cryptoData || refresh) {
        cryptoData = await getCoinGeckoData(query.currency, configuration.crypto);
        cache.set(query.currency, cryptoData);
    }

    return {
        city: query.city,
        weather: {
            main: weatherData.weather[0].main,
            description: weatherData.weather[0].description,
            temperature: weatherData.main.temp,
            units: configuration.weather.units === "metric" ? "C" : "F",
        },
        crypto: {
            currency: query.currency,
            data: cryptoData[query.currency]
        }
    } 
}

export async function postData(body: {currency?: string, units?: string}) {
    if (body.currency) {
        configuration.crypto.currency = body.currency;
    }
    if (body.units) {
        if (!["metric", "imperial"].includes(body.units)) {
            throw new CustomError(400, "Invalid units. Must be 'metric' or 'imperial'.");
        }
        
        configuration.weather.units = body.units;
    }

    return configuration;
}