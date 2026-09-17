import { Fragment, useMemo, useState } from 'react';
import { Sidebar } from '../Components/Dashboardc/Sidebar';
import '../Styles/Pagecss/Schedule.css';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
const timeSlots = [
  '9:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
] as const;

const halls = Array.from({ length: 10 }, (_, index) => `Eng. Hall ${index + 1}`);

type Level = 'All' | '100' | '200' | '300' | '400' | '500';

// The supplied project contains course data for 100, 200, 400 and 500 levels.
// 300 level is shown in the UI to match the reference, but remains disabled until
// corresponding 300-level course data is added to the source dataset.
const coursesByLevel: Partial<Record<Exclude<Level, 'All'>, string[]>> = {
  '100': [
    'AEFUNAI BIL 101 - Basic Igbo',
    'GST 111 - Communication in English',
    'GST 101 - Use of English',
    'AEFUNAI LIB 103 - Use of Library',
    'GST 103 - ICT',
  ],
  '200': [
    'AEFUNAI BCF 201 - Basic French',
    'MME 217 - Engineering Drawing',
    'AE-FUNAI LEP 201 - Entrepreneurship',
    'AE-FUNAI GET 207 - Applied Mechanics',
    'MME 213 - Eng. Materials',
    'CSC 201 - Programming',
    'GET 209 - Eng. Maths I',
    'FET 201 - Eng. Maths I',
    'CVE 201 - Fluid Mechanics',
    'AEFUNAI GET 203 - Solid Modelling',
    'MME 209 - Eng. Drawing I',
    'ENT 201 - Entrepreneurial Skills',
    'FET 203 - Engineer in Society',
    'GET 211 - Computing',
    'LEP 201 - Entrepreneurship',
    'EEE 215 - Basic Electricity',
    'GET 201 - Applied Electricity',
    'MME 205 - Eng. Materials',
    'GET 205 - Fluid Mechanics',
    'ENT 211 - Entrepreneurship',
  ],
  '400': [
    'MCT 417 - Mechanics of Machines',
    'MCT 413 - Group Project',
    'MCT 401 - Control Theory',
    'MCT 409 - Digital System & PLC',
    'MCT 405 - Sensors & Actuators',
    'MCT 403 - Computer-Aided Manufacturing',
    'MCT 415 - CAD/CAM/CNC Lab',
    'FET 403 - Eng. Communication',
    'MCT 411 - Electronics II',
    'FET 435 - Project Costing',
    'MCT 407 - Measurement & Instrumentation',
    'FET 437 - Sustainable Development',
  ],
  '500': [
    'MCT 511 - Process Automation',
    'MCT 505 - Microcomputers & Microprocessors',
    'MCT 501 - Introduction to Robotics',
    'MCT 523 - Lean Manufacturing',
    'MCT 519 - Micro Fabrication',
    'MCT 521 - Mobile Robotics',
    'MCT 513 - Partial Automation',
    'FET 503 - Engineering Law',
    'MCT 507 - Vibration',
    'MCT 503 - Digital Signal Processing',
    'MCT 527 - Product Design',
    'MCT 509 - Control Engineering II',
  ],
};

// Each row contains the time label followed by the ten hall values.
// The original timetable is retained; level filtering converts non-matching
// classes to Free instead of inventing or re-scheduling course data.
const weeklySchedule: string[][][] = [
  [
    ['9:00 - 10:00', 'MCT 417 - Mechanics of Machines', 'Free', 'MCT 511 - Process Automation', 'Free', 'MCT 405 - Sensors & Actuators', 'GST 111 - Communication in English', 'Free', 'MCT 401 - Control Theory', 'Free', 'MCT 505 - Microcomputers'],
    ['10:00 - 11:00', 'MCT 417 - Mechanics of Machines', 'Free', 'MCT 511 - Process Automation', 'Free', 'MCT 405 - Sensors & Actuators', 'GST 111 - Communication in English', 'Free', 'MCT 401 - Control Theory', 'Free', 'MCT 505 - Microcomputers'],
    ['11:00 - 12:00', 'AE-FUNAI GET 207 - Applied Mechanics', 'FET 203 - Engineer in Society', 'MCT 501 - Introduction to Robotics', 'CSC 201 - Programming', 'MCT 409 - Digital System & PLC', 'AEFUNAI BIL 101 - Basic Igbo', 'MCT 523 - Lean Manufacturing', 'GET 209 - Eng. Maths I', 'MCT 503 - Digital Signal Processing', 'MME 217 - Engineering Drawing'],
    ['12:00 - 13:00', 'Free', 'Free', 'Lunch Break', 'Lunch Break', 'Lunch Break', 'Lunch Break', 'Lunch Break', 'Free', 'Free', 'Free'],
    ['13:00 - 14:00', 'MCT 413 - Group Project', 'MCT 415 - CAD/CAM/CNC Lab', 'FET 403 - Eng. Communication', 'MCT 407 - Measurement & Instrumentation', 'FET 435 - Project Costing', 'MCT 411 - Electronics II', 'FET 437 - Sustainable Development', 'MCT 519 - Micro Fabrication', 'MCT 521 - Mobile Robotics', 'MCT 513 - Partial Automation'],
    ['14:00 - 15:00', 'MCT 413 - Group Project', 'MCT 415 - CAD/CAM/CNC Lab', 'FET 403 - Eng. Communication', 'MCT 407 - Measurement & Instrumentation', 'FET 435 - Project Costing', 'MCT 411 - Electronics II', 'FET 437 - Sustainable Development', 'MCT 519 - Micro Fabrication', 'MCT 521 - Mobile Robotics', 'MCT 513 - Partial Automation'],
    ['15:00 - 16:00', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free'],
  ],
  [
    ['9:00 - 10:00', 'MME 213 - Eng. Materials', 'CVE 201 - Fluid Mechanics', 'GET 205 - Fluid Mechanics', 'ENT 211 - Entrepreneurship', 'MCT 507 - Vibration', 'MCT 527 - Product Design', 'MCT 509 - Control Engineering II', 'FET 503 - Engineering Law', 'AEFUNAI BCF 201 - Basic French', 'GST 101 - Use of English'],
    ['10:00 - 11:00', 'MME 213 - Eng. Materials', 'CVE 201 - Fluid Mechanics', 'GET 205 - Fluid Mechanics', 'ENT 211 - Entrepreneurship', 'MCT 507 - Vibration', 'MCT 527 - Product Design', 'MCT 509 - Control Engineering II', 'FET 503 - Engineering Law', 'AEFUNAI BCF 201 - Basic French', 'GST 101 - Use of English'],
    ['11:00 - 12:00', 'AEFUNAI GET 203 - Solid Modelling', 'MME 209 - Eng. Drawing I', 'ENT 201 - Entrepreneurial Skills', 'EEE 215 - Basic Electricity', 'GET 201 - Applied Electricity', 'MME 205 - Eng. Materials', 'AEFUNAI LIB 103 - Use of Library', 'GST 103 - ICT', 'MCT 409 - Digital System & PLC', 'Free'],
    ['12:00 - 13:00', 'Free', 'Free', 'Lunch Break', 'Lunch Break', 'Lunch Break', 'Lunch Break', 'Lunch Break', 'Free', 'Free', 'Free'],
    ['13:00 - 14:00', 'MCT 405 - Sensors & Actuators', 'MCT 403 - Computer-Aided Manufacturing', 'MCT 415 - CAD/CAM/CNC Lab', 'MCT 411 - Electronics II', 'MCT 407 - Measurement & Instrumentation', 'FET 435 - Project Costing', 'FET 437 - Sustainable Development', 'MCT 519 - Micro Fabrication', 'MCT 521 - Mobile Robotics', 'MCT 513 - Partial Automation'],
    ['14:00 - 15:00', 'MCT 405 - Sensors & Actuators', 'MCT 403 - Computer-Aided Manufacturing', 'MCT 415 - CAD/CAM/CNC Lab', 'MCT 411 - Electronics II', 'MCT 407 - Measurement & Instrumentation', 'FET 435 - Project Costing', 'FET 437 - Sustainable Development', 'MCT 519 - Micro Fabrication', 'MCT 521 - Mobile Robotics', 'MCT 513 - Partial Automation'],
    ['15:00 - 16:00', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free'],
  ],
  [
    ['9:00 - 10:00', 'GET 209 - Eng. Maths I', 'FET 201 - Eng. Maths I', 'CVE 201 - Fluid Mechanics', 'GET 205 - Fluid Mechanics', 'MCT 501 - Introduction to Robotics', 'MCT 511 - Process Automation', 'MCT 505 - Microcomputers', 'MCT 401 - Control Theory', 'MCT 417 - Mechanics of Machines', 'AEFUNAI BIL 101 - Basic Igbo'],
    ['10:00 - 11:00', 'GET 209 - Eng. Maths I', 'FET 201 - Eng. Maths I', 'CVE 201 - Fluid Mechanics', 'GET 205 - Fluid Mechanics', 'MCT 501 - Introduction to Robotics', 'MCT 511 - Process Automation', 'MCT 505 - Microcomputers', 'MCT 401 - Control Theory', 'MCT 417 - Mechanics of Machines', 'AEFUNAI BIL 101 - Basic Igbo'],
    ['11:00 - 12:00', 'AE-FUNAI GET 207 - Applied Mechanics', 'MME 213 - Eng. Materials', 'CSC 201 - Programming', 'AEFUNAI BCF 201 - Basic French', 'GST 111 - Communication in English', 'GST 101 - Use of English', 'AEFUNAI LIB 103 - Use of Library', 'GST 103 - ICT', 'MCT 523 - Lean Manufacturing', 'MCT 519 - Micro Fabrication'],
    ['12:00 - 13:00', 'Free', 'Free', 'Lunch Break', 'Lunch Break', 'Lunch Break', 'Lunch Break', 'Lunch Break', 'Free', 'Free', 'Free'],
    ['13:00 - 14:00', 'MCT 409 - Digital System & PLC', 'MCT 405 - Sensors & Actuators', 'MCT 403 - Computer-Aided Manufacturing', 'MCT 415 - CAD/CAM/CNC Lab', 'MCT 411 - Electronics II', 'MCT 407 - Measurement & Instrumentation', 'FET 435 - Project Costing', 'FET 437 - Sustainable Development', 'MCT 503 - Digital Signal Processing', 'MCT 527 - Product Design'],
    ['14:00 - 15:00', 'MCT 409 - Digital System & PLC', 'MCT 405 - Sensors & Actuators', 'MCT 403 - Computer-Aided Manufacturing', 'MCT 415 - CAD/CAM/CNC Lab', 'MCT 411 - Electronics II', 'MCT 407 - Measurement & Instrumentation', 'FET 435 - Project Costing', 'FET 437 - Sustainable Development', 'MCT 503 - Digital Signal Processing', 'MCT 527 - Product Design'],
    ['15:00 - 16:00', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free'],
  ],
  [
    ['9:00 - 10:00', 'FET 203 - Engineer in Society', 'GET 211 - Computing', 'LEP 201 - Entrepreneurship', 'EEE 215 - Basic Electricity', 'GET 201 - Applied Electricity', 'MME 205 - Eng. Materials', 'ENT 211 - Entrepreneurship', 'MCT 507 - Vibration', 'MCT 509 - Control Engineering II', 'FET 503 - Engineering Law'],
    ['10:00 - 11:00', 'FET 203 - Engineer in Society', 'GET 211 - Computing', 'LEP 201 - Entrepreneurship', 'EEE 215 - Basic Electricity', 'GET 201 - Applied Electricity', 'MME 205 - Eng. Materials', 'ENT 211 - Entrepreneurship', 'MCT 507 - Vibration', 'MCT 509 - Control Engineering II', 'FET 503 - Engineering Law'],
    ['11:00 - 12:00', 'AEFUNAI GET 203 - Solid Modelling', 'MME 209 - Eng. Drawing I', 'ENT 201 - Entrepreneurial Skills', 'MCT 413 - Group Project', 'MCT 415 - CAD/CAM/CNC Lab', 'FET 403 - Eng. Communication', 'MCT 411 - Electronics II', 'FET 435 - Project Costing', 'MCT 407 - Measurement & Instrumentation', 'FET 437 - Sustainable Development'],
    ['12:00 - 13:00', 'Free', 'Free', 'Lunch Break', 'Lunch Break', 'Lunch Break', 'Lunch Break', 'Lunch Break', 'Free', 'Free', 'Free'],
    ['13:00 - 14:00', 'MCT 417 - Mechanics of Machines', 'MCT 401 - Control Theory', 'MCT 511 - Process Automation', 'MCT 505 - Microcomputers', 'MCT 501 - Introduction to Robotics', 'MCT 523 - Lean Manufacturing', 'MCT 521 - Mobile Robotics', 'MCT 513 - Partial Automation', 'MCT 503 - Digital Signal Processing', 'MCT 527 - Product Design'],
    ['14:00 - 15:00', 'MCT 417 - Mechanics of Machines', 'MCT 401 - Control Theory', 'MCT 511 - Process Automation', 'MCT 505 - Microcomputers', 'MCT 501 - Introduction to Robotics', 'MCT 523 - Lean Manufacturing', 'MCT 521 - Mobile Robotics', 'MCT 513 - Partial Automation', 'MCT 503 - Digital Signal Processing', 'MCT 527 - Product Design'],
    ['15:00 - 16:00', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free'],
  ],
  [
    ['9:00 - 10:00', 'MME 217 - Engineering Drawing', 'AEFUNAI LEP 201 - Entrepreneurship', 'AE-FUNAI GET 207 - Applied Mechanics', 'CSC 201 - Programming', 'GET 209 - Eng. Maths I', 'FET 201 - Eng. Maths I', 'CVE 201 - Fluid Mechanics', 'GET 205 - Fluid Mechanics', 'MCT 509 - Control Engineering II', 'MCT 507 - Vibration'],
    ['10:00 - 11:00', 'MME 217 - Engineering Drawing', 'AEFUNAI LEP 201 - Entrepreneurship', 'AE-FUNAI GET 207 - Applied Mechanics', 'CSC 201 - Programming', 'GET 209 - Eng. Maths I', 'FET 201 - Eng. Maths I', 'CVE 201 - Fluid Mechanics', 'GET 205 - Fluid Mechanics', 'MCT 509 - Control Engineering II', 'MCT 507 - Vibration'],
    ['11:00 - 12:00', 'AEFUNAI BIL 101 - Basic Igbo', 'GST 111 - Communication in English', 'GST 101 - Use of English', 'AEFUNAI LIB 103 - Use of Library', 'GST 103 - ICT', 'AEFUNAI BCF 201 - Basic French', 'MCT 415 - CAD/CAM/CNC Lab', 'MCT 403 - Computer-Aided Manufacturing', 'MCT 405 - Sensors & Actuators', 'MCT 409 - Digital System & PLC'],
    ['12:00 - 13:00', 'Free', 'Free', 'Lunch Break', 'Lunch Break', 'Lunch Break', 'Lunch Break', 'Lunch Break', 'Free', 'Free', 'Free'],
    ['13:00 - 14:00', 'MCT 413 - Group Project', 'FET 403 - Eng. Communication', 'FET 435 - Project Costing', 'MCT 411 - Electronics II', 'MCT 407 - Measurement & Instrumentation', 'FET 437 - Sustainable Development', 'MCT 519 - Micro Fabrication', 'MCT 521 - Mobile Robotics', 'MCT 513 - Partial Automation', 'MCT 503 - Digital Signal Processing'],
    ['14:00 - 15:00', 'MCT 413 - Group Project', 'FET 403 - Eng. Communication', 'FET 435 - Project Costing', 'MCT 411 - Electronics II', 'MCT 407 - Measurement & Instrumentation', 'FET 437 - Sustainable Development', 'MCT 519 - Micro Fabrication', 'MCT 521 - Mobile Robotics', 'MCT 513 - Partial Automation', 'MCT 503 - Digital Signal Processing'],
    ['15:00 - 16:00', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free', 'Free'],
  ],
];

const levelOptions: { value: Level; label: string; disabled?: boolean }[] = [
  { value: 'All', label: 'All Levels' },
  { value: '100', label: '100 Level' },
  { value: '200', label: '200 Level' },
  { value: '300', label: '300 Level', disabled: true },
  { value: '400', label: '400 Level' },
  { value: '500', label: '500 Level' },
];

function isVisibleForLevel(course: string, selectedLevel: Level) {
  if (course === 'Free' || course.includes('Lunch')) return true;
  if (selectedLevel === 'All') return true;
  return coursesByLevel[selectedLevel]?.includes(course) ?? false;
}

export function Schedule() {
  const [selectedLevel, setSelectedLevel] = useState<Level>('All');

  const visibleSchedule = useMemo(
    () => weeklySchedule.map(day => day.map(row => [
      row[0],
      ...row.slice(1).map(course => (isVisibleForLevel(course, selectedLevel) ? course : 'Free')),
    ])),
    [selectedLevel],
  );

  const selectedLabel = levelOptions.find(option => option.value === selectedLevel)?.label ?? 'All Levels';

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-content schedule-page">
        <div className="schedule-header">
          <h1>Weekly Lab Schedule</h1>
          <p>Engineering Lecture Halls · 9:00 AM – 4:00 PM</p>
        </div>

        <section className="schedule-controls" aria-label="Schedule controls">
          <div>
            <h2>Course Level</h2>
            <div className="level-tabs">
              {levelOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={selectedLevel === option.value ? 'active' : ''}
                  disabled={option.disabled}
                  title={option.disabled ? '300-level course data is not present in the supplied project' : undefined}
                  onClick={() => setSelectedLevel(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="schedule-summary">
            <strong>{selectedLabel}</strong>
            <span>Showing Monday–Friday schedule</span>
          </div>
        </section>

        <div className="schedule-legend" aria-label="Schedule legend">
          <span><i className="legend-dot occupied" /> Class / occupied</span>
          <span><i className="legend-dot free" /> Free</span>
          <span><i className="legend-dot lunch" /> Lunch break</span>
        </div>

        <div className="schedule-table-wrapper">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Time / Hall</th>
                {halls.map(hall => <th key={hall}>{hall}</th>)}
              </tr>
            </thead>
            <tbody>
              {weekdays.map((day, dayIndex) => (
                <Fragment key={day}>
                  <tr className="day-separator">
                    <td colSpan={halls.length + 1}>{day}</td>
                  </tr>
                  {timeSlots.map((slot, slotIndex) => {
                    const rowData = visibleSchedule[dayIndex][slotIndex];
                    const timeLabel = rowData[0];
                    return (
                      <tr key={`${day}-${slot}`}>
                        <td className="time-slot">{timeLabel}</td>
                        {rowData.slice(1).map((course, hallIndex) => {
                          const lunch = course.includes('Lunch');
                          const occupied = course !== 'Free' && !lunch;
                          return (
                            <td
                              key={`${day}-${slot}-${hallIndex}`}
                              className={occupied ? 'occupied' : lunch ? 'lunch-break' : 'free'}
                            >
                              {course}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
