import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./EarningsChart.css";

const MOCK_DATA = [
  { month: "Jan", earnings: 120 },
  { month: "Feb", earnings: 245 },
  { month: "Mar", earnings: 180 },
  { month: "Apr", earnings: 390 },
  { month: "May", earnings: 310 },
  { month: "Jun", earnings: 475 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <span className="chart-tooltip-label">{label}</span>
      <span className="chart-tooltip-value">{payload[0].value} coins</span>
    </div>
  );
}

export default function EarningsChart() {
  return (
    <div className="earnings-chart-card">
      <h3 className="earnings-chart-title">Earnings Trend</h3>
      <div className="earnings-chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MOCK_DATA} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-secondary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent-secondary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "var(--text-secondary)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="earnings"
              stroke="var(--accent-secondary)"
              strokeWidth={2}
              fill="url(#earningsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
