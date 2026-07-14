import { ShiftType, Employee, Roster, RosterSnapshot } from '../types';
import { generateId } from './storage';

export const getDateRange = (startDate: string, endDate: string): Date[] => {
  const dates: Date[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
};

export const formatDateHeader = (date: Date): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayName = days[date.getDay()];
  const dayNum = date.getDate();
  const month = date.getMonth() + 1;
  return `${dayName} ${dayNum}/${month}`;
};

// New helper: Get the date string in the format used for comparison
export const getDateKey = (date: Date): string => {
  const dayNum = date.getDate();
  const month = date.getMonth() + 1;
  return `${dayNum}/${month}`;
};

// New helper: Check if a date matches a header
export const dateMatchesHeader = (date: Date, header: string): boolean => {
  const dateKey = getDateKey(date);
  return header.includes(dateKey);
};

export const generateRosterData = (
  employees: Employee[],
  startDate: string,
  endDate: string
): {
  headers: string[];
  rows: Record<string, ShiftType[]>;
  summary: Array<{ name: string; shifts: number }>;
} => {
  const dates = getDateRange(startDate, endDate);
  const headers = dates.map(d => formatDateHeader(d));
  
  const rows: Record<string, ShiftType[]> = {};
  const summary: Array<{ name: string; shifts: number }> = [];
  
  employees.forEach((employee) => {
    const shifts: ShiftType[] = [];
    let patternIndex = 0;
    
    dates.forEach(() => {
      const shift = employee.circlePattern[patternIndex % employee.circlePattern.length];
      shifts.push(shift);
      patternIndex++;
    });
    
    rows[employee.id] = shifts;
    
    // Count shifts (excluding Off)
    const shiftCount = shifts.filter(s => s !== 'Off').length;
    summary.push({ name: employee.name, shifts: shiftCount });
  });
  
  return { headers, rows, summary };
};

export const createRosterName = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startMonth = start.toLocaleString('default', { month: 'long' });
  const endMonth = end.toLocaleString('default', { month: 'long' });
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();
  
  if (startMonth === endMonth && startYear === endYear) {
    return `${startMonth} ${startYear} Roster`;
  } else if (startYear === endYear) {
    return `${startMonth} - ${endMonth} ${startYear} Roster`;
  } else {
    return `${startMonth} ${startYear} - ${endMonth} ${endYear} Roster`;
  }
};

export const createInitialSnapshot = (
  roster: Roster,
  userId: string
): RosterSnapshot => {
  const generatedData = generateRosterData(
    roster.employees,
    roster.startDate,
    roster.endDate
  );
  
  // Create a complete roster copy with generated data
  const rosterWithData = {
    ...roster,
    generatedData: generatedData,
  };
  
  return {
    id: generateId(),
    rosterId: roster.id,
    version: 1,
    data: rosterWithData as any,
    changeType: 'created',
    changeDetails: {
      notes: 'Initial roster creation',
    },
    changedBy: userId,
    changedAt: new Date().toISOString(),
  };
};

export const createChangeSnapshot = (
  rosterId: string,
  previousSnapshot: RosterSnapshot,
  changeType: 'overtime' | 'extra_off' | 'shift_change',
  employeeId: string,
  date: string,
  oldValue: ShiftType,
  newValue: ShiftType,
  userId: string,
  notes?: string
): RosterSnapshot => {
  // Deep clone the previous roster data
  const previousRoster = JSON.parse(JSON.stringify(previousSnapshot.data));
  
  // Find the date index using the date key (day/month) comparison
  const selectedDate = new Date(date);
  const dateKey = `${selectedDate.getDate()}/${selectedDate.getMonth() + 1}`;
  
  const dateIndex = previousRoster.generatedData.headers.findIndex((h: string) => 
    h.includes(dateKey)
  );
  
  if (dateIndex === -1) {
    throw new Error(`Date not found in roster: ${date} (${dateKey})`);
  }
  
  // Update the employee's shift
  const employeeRow = previousRoster.generatedData.rows[employeeId];
  if (!employeeRow) {
    throw new Error('Employee not found in roster');
  }
  
  employeeRow[dateIndex] = newValue;
  
  // Update summary
  const employee = previousRoster.employees.find((e: any) => e.id === employeeId);
  if (employee) {
    const summaryIndex = previousRoster.generatedData.summary.findIndex(
      (s: any) => s.name === employee.name
    );
    if (summaryIndex !== -1) {
      const shiftCount = employeeRow.filter((s: ShiftType) => s !== 'Off').length;
      previousRoster.generatedData.summary[summaryIndex].shifts = shiftCount;
    }
  }
  
  // Update roster metadata
  previousRoster.updatedAt = new Date().toISOString();
  previousRoster.updatedBy = userId;
  previousRoster.currentVersion = previousSnapshot.version + 1;
  
  return {
    id: generateId(),
    rosterId: rosterId,
    version: previousSnapshot.version + 1,
    data: previousRoster,
    changeType: changeType,
    changeDetails: {
      employeeId,
      date,
      oldValue,
      newValue,
      notes: notes || `${changeType} applied on ${date}`,
    },
    changedBy: userId,
    changedAt: new Date().toISOString(),
  };
};