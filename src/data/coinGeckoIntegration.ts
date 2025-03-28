import { CustomError } from "../customError";

export async function getCoinGeckoData(coinId: string, cryptoConfig: {currency: string}) {
    if (!process.env.COIN_GECKO_API_KEY) {
        throw new CustomError(500, "CoinGecko API key is not set in environment variables");
    }

    let attempts = 1;
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=${cryptoConfig.currency}`, {
                headers: {
                    "x-cg-pro-api-key": process.env.COIN_GECKO_API_KEY
                }
            });

            if (!response.ok) {
                throw new Error(`Error fetching CoinGecko data: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            if (attempts === maxAttempts) {
                throw error;
            }

            attempts++;
        }
    }

    return fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`)
        .then(response => response.json())
        .then(data => {
            return data;
        });
}