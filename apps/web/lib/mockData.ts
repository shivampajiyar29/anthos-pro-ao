import { DashboardData, TradingAgent, Trade } from './types';

export const INITIAL_DATA: DashboardData = {
    portfolio: {
        equity: 124582.45,
        change: 2.3,
        dailyPnl: 2845.20,
        dailyPnlPercent: 2.34
    },
    agents: [
        {
            id: '1',
            name: 'Strategist',
            model: 'NVIDIA Qwen',
            pnl: 3.2,
            pnlHistory: [1.2, 1.8, 2.5, 2.1, 2.8, 3.2],
            lastAction: 'BUY AAPL @ 175.42',
            confidence: 87,
            thinking: false,
            role: 'Strategist'
        },
        {
            id: '2',
            name: 'Tactician',
            model: 'Llama 3 70B',
            pnl: 2.8,
            pnlHistory: [0.5, 1.2, 1.8, 2.2, 2.5, 2.8],
            lastAction: 'SELL BTC @ 52140',
            confidence: 65,
            thinking: true,
            role: 'Tactician'
        },
        {
            id: '3',
            name: 'Sentinel',
            model: 'Claude 3 Opus',
            pnl: 1.5,
            pnlHistory: [0.2, 0.5, 0.8, 1.1, 1.3, 1.5],
            lastAction: 'HEDGE SPY @ 501.20',
            confidence: 92,
            thinking: false,
            role: 'Sentinel'
        },
        {
            id: '4',
            name: 'Analyst',
            model: 'GPT-4 Turbo',
            pnl: -0.4,
            pnlHistory: [0.1, 0.0, -0.2, -0.3, -0.5, -0.4],
            lastAction: 'WATCH TSLA',
            confidence: 45,
            thinking: false,
            role: 'Analyst'
        },
        {
            id: '5',
            name: 'Arbitrageur',
            model: 'Mixtral 8x7B',
            pnl: 0.8,
            pnlHistory: [0.3, 0.4, 0.6, 0.7, 0.7, 0.8],
            lastAction: 'ARB ETH/USDT',
            confidence: 78,
            thinking: true,
            role: 'Arbitrageur'
        }
    ],
    leaderboard: [
        ['Strategist', 3.2],
        ['Tactician', 2.8],
        ['Sentinel', 1.5],
        ['Arbitrageur', 0.8]
    ],
    insight: "Bullish divergence on 5-min RSI; order flow shows accumulation at $174.80. Sentinel agent recommending increased exposure to tech sector while maintaining core SPY hedge.",
    risk: 0.35,
    drawdown: 1.2,
    var95: 2450,
    orderFlow: { buy: 74, sell: 26 },
    trades: [
        { id: 't1', time: '07:15:01', symbol: 'AAPL', agent: 'Strategist', action: 'BUY', quantity: 100, price: 175.42, status: 'OPEN' },
        { id: 't2', time: '07:10:15', symbol: 'BTC', agent: 'Tactician', action: 'SELL', quantity: 0.5, price: 52140, pnl: 450, status: 'CLOSED' },
        { id: 't3', time: '07:05:44', symbol: 'TSLA', agent: 'Sentinel', action: 'SELL', quantity: 50, price: 198.30, pnl: -120, status: 'CLOSED' }
    ],
    metrics: {
        totalEquity: 124582.45,
        dailyPnl: 2845.20,
        winRate: 68.5,
        sharpeRatio: 2.4,
        maxDrawdown: 4.2,
        tradesToday: 12
    },
    isLiveMode: true,
    apiKeys: {
        'MetaTrader 5': '',
        'Alpaca Markets': '',
        'Binance API': '',
        'Upstox Pro': ''
    },
    positions: [
        {
            symbol: 'BTCUSDT',
            entry_price: 51240.50,
            quantity: 1.5,
            side: 'BUY',
            current_price: 52140.00,
            pnl: 1349.25,
            pnl_percent: 1.75,
            target_price: 55000.00
        }
    ]
};

export const generateUpdate = (current: DashboardData): DashboardData => {
    // Simulate minor fluctuations based on aggressiveness
    const updatedAgents = current.agents.map(a => {
        const aggressivenessFactor = (a.aggressiveness || 50) / 50;
        const volatility = 0.1 * aggressivenessFactor;
        const newPnl = a.pnl + (Math.random() - 0.48) * volatility;
        return {
            ...a,
            pnl: newPnl,
            pnlHistory: [...(a.pnlHistory || []), newPnl].slice(-10),
            confidence: Math.min(100, Math.max(0, a.confidence + (Math.random() - 0.5) * 2 * aggressivenessFactor)),
            thinking: Math.random() > 0.8 ? !a.thinking : a.thinking
        };
    });

    // Dynamic leaderboard sorted by PnL
    const updatedLeaderboard: [string, number][] = [...updatedAgents]
        .sort((a, b) => b.pnl - a.pnl)
        .map(a => [a.name, a.pnl]);

    const dailyPnlDelta = (Math.random() - 0.45) * 50;
    const newTotalEquity = current.metrics.totalEquity + dailyPnlDelta;
    const newDailyPnl = current.metrics.dailyPnl + dailyPnlDelta;

    return {
        ...current,
        portfolio: {
            ...current.portfolio,
            equity: newTotalEquity,
            change: (newDailyPnl / newTotalEquity) * 100,
            dailyPnl: newDailyPnl,
            dailyPnlPercent: (newDailyPnl / (newTotalEquity - newDailyPnl)) * 100
        },
        agents: updatedAgents,
        leaderboard: updatedLeaderboard,
        risk: Math.min(1, Math.max(0, current.risk + (Math.random() - 0.5) * 0.02)),
        orderFlow: {
            buy: Math.min(100, Math.max(0, current.orderFlow.buy + (Math.random() - 0.5) * 5)),
            sell: 100 - (Math.min(100, Math.max(0, current.orderFlow.buy + (Math.random() - 0.5) * 5)))
        },
        metrics: {
            ...current.metrics,
            totalEquity: newTotalEquity,
            dailyPnl: newDailyPnl,
            winRate: Math.min(100, Math.max(0, current.metrics.winRate + (Math.random() - 0.5) * 0.5)),
            tradesToday: current.metrics.tradesToday + (Math.random() > 0.9 ? 1 : 0)
        }
    };
};
