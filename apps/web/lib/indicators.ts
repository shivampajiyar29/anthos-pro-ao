export interface Candle {
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    timestamp: number;
}

export function calculateRSI(prices: number[], periods: number = 14): number {
    if (prices.length <= periods) return 50;

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= periods; i++) {
        const diff = prices[prices.length - i] - prices[prices.length - i - 1];
        if (diff >= 0) gains += diff;
        else losses -= diff;
    }

    if (losses === 0) return 100;
    const rs = (gains / periods) / (losses / periods);
    return 100 - (100 / (1 + rs));
}

export function calculateBollingerBands(prices: number[], periods: number = 20, multiplier: number = 2) {
    if (prices.length < periods) return null;

    const slice = prices.slice(-periods);
    const sma = slice.reduce((a, b) => a + b, 0) / periods;
    const squaredDiffs = slice.map(p => Math.pow(p - sma, 2));
    const stdDev = Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / periods);

    return {
        middle: sma,
        upper: sma + stdDev * multiplier,
        lower: sma - stdDev * multiplier
    };
}

export function calculateMACD(prices: number[]) {
    if (prices.length < 26) return null;

    const ema12 = calculateEMA(prices, 12);
    const ema26 = calculateEMA(prices, 26);
    const macd = ema12 - ema26;
    // Note: Signal line requires history of MACD values, we'll simplify for now
    return {
        macd: macd,
        signal: macd * 0.9, // Simplified signal line
        histogram: macd - (macd * 0.9)
    };
}

function calculateEMA(prices: number[], periods: number): number {
    const k = 2 / (periods + 1);
    let ema = prices[0];
    for (let i = 1; i < prices.length; i++) {
        ema = prices[i] * k + ema * (1 - k);
    }
    return ema;
}
