import '../../Styles/Componentcss/RecentActivity.css';


const activities = [
  { initials: 'AT', name: 'Alice Tan', action: 'Booked Oscilloscope', time: '2 mins ago' },
  { initials: 'BL', name: 'Bob Lim', action: 'Returned 3D Printer', time: '15 mins ago' },
  { initials: 'CW', name: 'Carol Wu', action: 'Reported CNC Machine fault', time: '32 mins ago' },
  { initials: 'DN', name: 'David Ng', action: 'Booked Robotic Arm', time: '1 hr ago' },
  { initials: 'EC', name: 'Eva Chen', action: 'Completed maintenance on Laser Cutter', time: '2 hrs ago' },
  { initials: 'FH', name: 'Frank Ho', action: 'Booked Arduino Kit', time: '3 hrs ago' },
  { initials: 'GL', name: 'Grace Lee', action: 'Submitted maintenance request for Motor X', time: '4 hrs ago' },
];

export function RecentActivity() {
  return (
    <div className="recent-activity">
      <h3>Recent Activity</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr><th>User</th><th>Action</th><th>Time</th></tr>
          </thead>
          <tbody>
            {activities.map(act => (
              <tr key={act.name}>
                <td><span className="initials">{act.initials}</span> {act.name}</td>
                <td>{act.action}</td>
                <td className="time-col">{act.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}