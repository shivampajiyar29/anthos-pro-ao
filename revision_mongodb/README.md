# MAHESHWARA: The Autonomous Multi-Market AI Trading Ecosystem

MAHESHWARA is a self-evolving, multi-agent AI trading intelligence that predicts, executes, and manages risk across US and Indian markets.

## 🧬 Architecture
- **Frontend**: Next.js 14, Tailwind CSS, Shadcn/UI, Recharts.
- **Backend**: FastAPI, MCP (Model Context Protocol), Redis, PostgreSQL.
- **AI Layer**: NVIDIA AI Foundation (Free models), OpenRouter (Grok-4.20).
- **Markets**: US Stocks (Alpaca/Octagon), India (Upstox).

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js & npm
- Python 3.11+

### Installation
1. Clone the repository and navigate to the project root.
2. Setup environment variables:
   ```bash
   cp .env.example .env
   ```
3. Run with Docker (Recommended):
   ```bash
   docker-compose up -d
   ```

4. Run Locally (Development):

   **Backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   python main.py
   ```

   **Dashboard:**
   ```bash
   cd dashboard
   npm install
   npm run dev
   ```

5. Access the dashboard:
   Open [http://localhost:3000](http://localhost:3000)

## 🛡️ Safety & Risk
MAHESHWARA uses the **Sentinel Agent** to monitor all trades. By default, it operates in PAPER mode. Please verify all risk settings in `backend/agents/sentinel.py` before switching to LIVE mode.

## ✨ Features
- **Global Coverage**: Unified symbols for US and Indian markets.
- **Explainable AI**: Every trade comes with a "Quantum Reasoning Chain".
- **Self-Healing**: Automatic failover for data sources.
- **Zero Monthly Cost**: Optimized for free-tier services.
