import '../../Styles/Componentcss/AIInsight.css';

const insights = [
  '📊 Peak usage: Tuesday 2PM – 4PM',
  '⏰ Free slot available: Wednesday 10AM',
  '⚠️ Motor X overdue for maintenance',
  '📈 3D Printer utilization up 18% this week',
  '👥 Lab B has highest student traffic',
];

export function AIInsights() {
  return (
    <div className="ai-insights">
      <h3>✨ AI Insights</h3>
      <ul>
        {insights.map((item, idx) => <li key={idx}>{item}</li>)}
      </ul>
    </div>
  );
}