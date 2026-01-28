// WorkingPlanPage.tsx
import React, { useState } from "react";

// Types
type Shift = {
  start: string;
  end: string;
  pauseStart: string;
  pauseEnd: string;
};

type DayShift = {
  day: string; // e.g., "Monday"
  shifts: Shift[];
};

type Team = {
  name: string;
  manager: string;
  officer: string;
  assignments: { day: string; shiftIndex: number }[];
};

type WorkingPlan = {
  location: string;
  monthYear: string;
  days: DayShift[];
  teams: Team[];
};

// Helpers
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const locations = ["Head Office", "Branch 1", "Branch 2"];

export default function WorkingPlanPage() {
  // State
  const [location, setLocation] = useState("");
  const [monthYear, setMonthYear] = useState("");
  const [days, setDays] = useState<DayShift[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeam, setNewTeam] = useState({ name: "", manager: "", officer: "" });
  const [savedPlans, setSavedPlans] = useState<WorkingPlan[]>([]);

  // Handlers
  const handleAddDay = (day: string) => {
    if (!days.find(d => d.day === day)) {
      setDays([...days, { day, shifts: [] }]);
    }
  };

  const handleAddShift = (day: string) => {
    setDays(days.map(d => d.day === day
      ? { ...d, shifts: [...d.shifts, { start: "", end: "", pauseStart: "", pauseEnd: "" }] }
      : d
    ));
  };

  const handleShiftChange = (day: string, shiftIndex: number, field: keyof Shift, value: string) => {
    setDays(days.map(d => d.day === day
      ? { 
          ...d, 
          shifts: d.shifts.map((s, i) => i === shiftIndex ? { ...s, [field]: value } : s) 
        }
      : d
    ));
  };

  const handleAddTeam = () => {
    setTeams([...teams, { ...newTeam, assignments: [] }]);
    setNewTeam({ name: "", manager: "", officer: "" });
  };

  const handleAssignTeam = (teamIndex: number, day: string, shiftIndex: number) => {
    setTeams(teams.map((t, i) => i === teamIndex
      ? { ...t, assignments: [...t.assignments, { day, shiftIndex }] }
      : t
    ));
  };

  const allShiftsCovered = () => {
    // simple coverage check: each day shift has at least one team assigned
    return days.every(day =>
      day.shifts.every((_, shiftIndex) =>
        teams.some(t => t.assignments.some(a => a.day === day.day && a.shiftIndex === shiftIndex))
      )
    );
  };

  const handleSavePlan = () => {
    const newPlan: WorkingPlan = { location, monthYear, days, teams };
    setSavedPlans([...savedPlans, newPlan]);
    // Reset form
    setLocation("");
    setMonthYear("");
    setDays([]);
    setTeams([]);
  };

  // Render
  return (
    <div style={{ padding: 20 }}>
      <h1>Administrator Working Plan</h1>

      {/* Location & Month */}
      <div style={{ marginBottom: 20 }}>
        <label>
          Location: 
          <select value={location} onChange={e => setLocation(e.target.value)}>
            <option value="">Select location</option>
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </label>
        <label style={{ marginLeft: 20 }}>
          Month-Year: 
          <input 
            type="month" 
            value={monthYear} 
            onChange={e => setMonthYear(e.target.value)} 
          />
        </label>
      </div>

      {/* Working Days & Shifts */}
      <div style={{ marginBottom: 20 }}>
        <h2>Working Hours</h2>
        <div>
          {weekdays.map(day => (
            <label key={day} style={{ marginRight: 10 }}>
              <input 
                type="checkbox" 
                checked={!!days.find(d => d.day === day)}
                onChange={e => e.target.checked ? handleAddDay(day) : setDays(days.filter(d => d.day !== day))}
              /> {day}
            </label>
          ))}
        </div>

        {days.map(day => (
          <div key={day.day} style={{ marginTop: 10, border: "1px solid #ccc", padding: 10 }}>
            <h3>{day.day}</h3>
            <button onClick={() => handleAddShift(day.day)}>Add Shift</button>
            {day.shifts.map((shift, index) => (
              <div key={index} style={{ marginTop: 5 }}>
                <strong>Shift {index + 1}</strong>
                <div>
                  Start: <input type="time" value={shift.start} onChange={e => handleShiftChange(day.day, index, "start", e.target.value)} />
                  End: <input type="time" value={shift.end} onChange={e => handleShiftChange(day.day, index, "end", e.target.value)} />
                  Pause Start: <input type="time" value={shift.pauseStart} onChange={e => handleShiftChange(day.day, index, "pauseStart", e.target.value)} />
                  Pause End: <input type="time" value={shift.pauseEnd} onChange={e => handleShiftChange(day.day, index, "pauseEnd", e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Teams */}
      <div style={{ marginBottom: 20 }}>
        <h2>Teams</h2>
        <div>
          <input placeholder="Team Name" value={newTeam.name} onChange={e => setNewTeam({...newTeam, name: e.target.value})} />
          <input placeholder="Manager" value={newTeam.manager} onChange={e => setNewTeam({...newTeam, manager: e.target.value})} />
          <input placeholder="Officer" value={newTeam.officer} onChange={e => setNewTeam({...newTeam, officer: e.target.value})} />
          <button onClick={handleAddTeam}>Add Team</button>
        </div>

        {teams.map((team, teamIndex) => (
          <div key={teamIndex} style={{ marginTop: 10, border: "1px solid #aaa", padding: 10 }}>
            <strong>{team.name}</strong> (Manager: {team.manager}, Officer: {team.officer})
            <div>
              <h4>Assign Shifts</h4>
              {days.map(day => day.shifts.map((shift, shiftIndex) => (
                <div key={day.day + shiftIndex}>
                  {day.day} Shift {shiftIndex + 1} 
                  <button onClick={() => handleAssignTeam(teamIndex, day.day, shiftIndex)}>Assign</button>
                </div>
              )))}
            </div>
          </div>
        ))}
      </div>

      {/* Save Plan */}
      {allShiftsCovered() && (
        <button onClick={handleSavePlan} style={{ padding: "10px 20px", fontSize: 16 }}>
          Save Working Plan
        </button>
      )}

      {/* Display saved plans */}
      <div style={{ marginTop: 40 }}>
        <h2>Saved Working Plans</h2>
        {savedPlans.map((plan, i) => (
          <div key={i} style={{ border: "1px solid #ccc", padding: 10, marginTop: 10 }}>
            <h3>{plan.location} — {plan.monthYear}</h3>
            {plan.days.map(d => (
              <div key={d.day}>
                <strong>{d.day}</strong>
                {d.shifts.map((s, idx) => (
                  <div key={idx}>
                    Shift {idx + 1}: {s.start} - {s.end}, Pause: {s.pauseStart}-{s.pauseEnd}
                  </div>
                ))}
              </div>
            ))}
            <div>
              <strong>Teams:</strong>
              {plan.teams.map(t => (
                <div key={t.name}>
                  {t.name} (Manager: {t.manager}, Officer: {t.officer})
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
