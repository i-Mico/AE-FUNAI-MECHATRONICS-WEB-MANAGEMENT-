import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../../Styles/Componentcss/WeeklyChart.css';

const data = [
  { day: 'Mon', usage: 65 },
  { day: 'Tue', usage: 88 },
  { day: 'Wed', usage: 42 },
  { day: 'Thu', usage: 75 },
  { day: 'Fri', usage: 60 },
  { day: 'Sat', usage: 30 },
  { day: 'Sun', usage: 15 },
];

export function WeeklyChart() {
  return (
    <div className="weekly-chart">
      <h3>Weekly Equipment Usage</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="day" tick={{ fill: '#334155' }} />
          <YAxis tickFormatter={(v) => `${v}%`} domain={[0, 100]} tick={{ fill: '#334155' }} />
          <Tooltip formatter={(v) => [`${v}%`, 'Usage']} />
          <Bar dataKey="usage" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}