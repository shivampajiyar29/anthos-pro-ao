export interface Metrics {
    totalEquity: number;
    dailyPnl: number;
    winRate: number;
    sharpeRatio: number;
    maxDrawdown: number;
    tradesToday: number;
}

export interface TradingAgent {
    id: string;
    name: string;
    model: string;
    pnl: number;
    pnlHistory: number[];
    lastAction: string;
    confidence: number;
    thinking: boolean;
    role: 'Strategist' | 'Tactician' | 'Sentinel' | 'Analyst' | 'Arbitrageur';
    disabled?: boolean;
    aggressiveness?: number;
}

export interface Trade {
    id: string;
    time: string;
    symbol: string;
    agent: string;
    action: 'BUY' | 'SELL';
    quantity: number;
    price: number;
    pnl?: number;
    status: 'OPEN' | 'CLOSED';
    target_price?: number;
    stop_loss?: number;
}

export interface Position {
    symbol: string;
    entry_price: number;
    quantity: number;
    side: 'BUY' | 'SELL';
    current_price: number;
    pnl: number;
    pnl_percent: number;
    target_price?: number;
    stop_loss?: number;
}

export interface OrderFlow {
    buy: number;
    sell: number;
}

export interface DashboardData {
    portfolio: {
        equity: number;
        change: number;
        dailyPnl: number;
        dailyPnlPercent: number;
    };
    agents: TradingAgent[];
    leaderboard: [string, number][];
    insight: string;
    risk: number;
    drawdown: number;
    var95: number;
    orderFlow: OrderFlow;
    trades: Trade[];
    positions: Position[];
    metrics: {
        totalEquity: number;
        dailyPnl: number;
        winRate: number;
        sharpeRatio: number;
        maxDrawdown: number;
        tradesToday: number;
    };
    isLiveMode: boolean;
    apiKeys: Record<string, string>;
}

export interface PriceAlert {
    _id?: string;
    symbol: string;
    target_price: number;
    alert_criteria: 'Target Price' | 'Movement Amount';
    notification_platform: string;
    default_query: string;
    additional_instructions?: string;
    is_active: boolean;
    created_at: string;
}
