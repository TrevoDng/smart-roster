import { User, Roster, RosterChange, RosterSnapshot, Employee, LeaveRequest, LeaveBalance, Payslip, AccrualRule } from '../types';

const STORAGE_KEYS = {
  USERS: 'roster_users',
  ROSTERS: 'roster_data',
  CHANGES: 'roster_changes',
  SNAPSHOTS: 'roster_snapshots',
  CURRENT_USER: 'roster_current_user',
  EMPLOYEES: 'hr_employees',          // NEW
  LEAVE_REQUESTS: 'hr_leave_requests', // NEW
  LEAVE_BALANCES: 'hr_leave_balances', // NEW
  PAYSLIPS: 'hr_payslips',             // NEW
  ACCRUAL_RULES: 'hr_accrual_rules',   // NEW
};

// Generate random ID (similar to SQL auto-increment)
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Generate random 6-digit company number
export const generateCompanyNumber = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generic get/set functions
export const getData = <T>(key: string): T | null => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error getting data from localStorage: ${key}`, error);
    return null;
  }
};

export const setData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error setting data to localStorage: ${key}`, error);
  }
};

// User specific functions
export const getUsers = (): User[] => {
  return getData<User[]>(STORAGE_KEYS.USERS) || [];
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  setData(STORAGE_KEYS.USERS, users);
};

export const findUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

// Current user session
export const getCurrentUser = (): User | null => {
  return getData<User>(STORAGE_KEYS.CURRENT_USER);
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    setData(STORAGE_KEYS.CURRENT_USER, user);
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// Roster specific functions
export const getRosters = (): Roster[] => {
  return getData<Roster[]>(STORAGE_KEYS.ROSTERS) || [];
};

export const saveRoster = (roster: Roster): void => {
  const rosters = getRosters();
  rosters.push(roster);
  setData(STORAGE_KEYS.ROSTERS, rosters);
};

export const updateRoster = (updatedRoster: Roster): void => {
  const rosters = getRosters();
  const index = rosters.findIndex(r => r.id === updatedRoster.id);
  if (index !== -1) {
    rosters[index] = updatedRoster;
    setData(STORAGE_KEYS.ROSTERS, rosters);
  }
};

export const getRosterById = (id: string): Roster | undefined => {
  const rosters = getRosters();
  return rosters.find(r => r.id === id);
};

// Snapshot specific functions
export const getSnapshots = (): RosterSnapshot[] => {
  return getData<RosterSnapshot[]>(STORAGE_KEYS.SNAPSHOTS) || [];
};

export const saveSnapshot = (snapshot: RosterSnapshot): void => {
  const snapshots = getSnapshots();
  snapshots.push(snapshot);
  setData(STORAGE_KEYS.SNAPSHOTS, snapshots);
};

export const getSnapshotsByRosterId = (rosterId: string): RosterSnapshot[] => {
  const snapshots = getSnapshots();
  return snapshots
    .filter(s => s.rosterId === rosterId)
    .sort((a, b) => a.version - b.version);
};

export const getLatestSnapshotByRosterId = (rosterId: string): RosterSnapshot | null => {
  const snapshots = getSnapshotsByRosterId(rosterId);
  return snapshots.length > 0 ? snapshots[snapshots.length - 1] : null;
};

export const getSnapshotByVersion = (rosterId: string, version: number): RosterSnapshot | null => {
  const snapshots = getSnapshotsByRosterId(rosterId);
  return snapshots.find(s => s.version === version) || null;
};

// Changes specific functions (keep for backward compatibility)
export const getChanges = (): RosterChange[] => {
  return getData<RosterChange[]>(STORAGE_KEYS.CHANGES) || [];
};

export const saveChange = (change: RosterChange): void => {
  const changes = getChanges();
  changes.push(change);
  setData(STORAGE_KEYS.CHANGES, changes);
};

export const getChangesByRosterId = (rosterId: string): RosterChange[] => {
  const changes = getChanges();
  return changes.filter(c => c.rosterId === rosterId);
};

// Add these functions to your storage.ts file

// Delete a roster and all its associated data
export const deleteRoster = (rosterId: string): void => {
  // Delete roster metadata
  const rosters = getRosters();
  const filteredRosters = rosters.filter(r => r.id !== rosterId);
  setData(STORAGE_KEYS.ROSTERS, filteredRosters);
  
  // Delete all snapshots for this roster
  const snapshots = getSnapshots();
  const filteredSnapshots = snapshots.filter(s => s.rosterId !== rosterId);
  setData(STORAGE_KEYS.SNAPSHOTS, filteredSnapshots);
  
  // Delete all changes for this roster (if you still use changes)
  const changes = getChanges();
  const filteredChanges = changes.filter(c => c.rosterId !== rosterId);
  setData(STORAGE_KEYS.CHANGES, filteredChanges);
};

// Check if a roster exists
export const rosterExists = (rosterId: string): boolean => {
  const rosters = getRosters();
  return rosters.some(r => r.id === rosterId);
};

// Get roster count
export const getRosterCount = (): number => {
  const rosters = getRosters();
  return rosters.length;
};

// Delete a specific snapshot/version
export const deleteSnapshot = (snapshotId: string): void => {
  const snapshots = getSnapshots();
  const filteredSnapshots = snapshots.filter(s => s.id !== snapshotId);
  setData(STORAGE_KEYS.SNAPSHOTS, filteredSnapshots);
};

// Delete all snapshots after a specific version (for rollback)
export const deleteSnapshotsAfterVersion = (rosterId: string, version: number): void => {
  const snapshots = getSnapshots();
  const filteredSnapshots = snapshots.filter(
    s => !(s.rosterId === rosterId && s.version > version)
  );
  setData(STORAGE_KEYS.SNAPSHOTS, filteredSnapshots);
};

// Get snapshots count for a roster
export const getSnapshotCount = (rosterId: string): number => {
  const snapshots = getSnapshots();
  return snapshots.filter(s => s.rosterId === rosterId).length;
};

// ============================================
// EMPLOYEE STORAGE FUNCTIONS
// ============================================
export const getAllEmployees = (): Employee[] => {
  return getData<Employee[]>(STORAGE_KEYS.EMPLOYEES) || [];
};

export const getEmployeeById = (id: string): Employee | undefined => {
  const employees = getAllEmployees();
  return employees.find(e => e.id === id);
};

export const saveEmployee = (employee: Employee): void => {
  const employees = getAllEmployees();
  const index = employees.findIndex(e => e.id === employee.id);
  if (index !== -1) {
    employees[index] = employee;
  } else {
    employees.push(employee);
  }
  setData(STORAGE_KEYS.EMPLOYEES, employees);
};

export const deleteEmployee = (id: string): void => {
  const employees = getAllEmployees();
  const filtered = employees.filter(e => e.id !== id);
  setData(STORAGE_KEYS.EMPLOYEES, filtered);
};

// ============================================
// LEAVE STORAGE FUNCTIONS
// ============================================
export const getLeaveRequests = (): LeaveRequest[] => {
  return getData<LeaveRequest[]>(STORAGE_KEYS.LEAVE_REQUESTS) || [];
};

export const getLeaveRequestsByEmployee = (employeeId: string): LeaveRequest[] => {
  const requests = getLeaveRequests();
  return requests.filter(r => r.employeeId === employeeId);
};

export const saveLeaveRequest = (request: LeaveRequest): void => {
  const requests = getLeaveRequests();
  const index = requests.findIndex(r => r.id === request.id);
  if (index !== -1) {
    requests[index] = request;
  } else {
    requests.push(request);
  }
  setData(STORAGE_KEYS.LEAVE_REQUESTS, requests);
};

export const getLeaveBalances = (): LeaveBalance[] => {
  return getData<LeaveBalance[]>(STORAGE_KEYS.LEAVE_BALANCES) || [];
};

export const getLeaveBalanceByEmployee = (employeeId: string, year: number): LeaveBalance | undefined => {
  const balances = getLeaveBalances();
  return balances.find(b => b.employeeId === employeeId && b.year === year);
};

export const saveLeaveBalance = (balance: LeaveBalance): void => {
  const balances = getLeaveBalances();
  const index = balances.findIndex(b => b.employeeId === balance.employeeId && b.year === balance.year);
  if (index !== -1) {
    balances[index] = balance;
  } else {
    balances.push(balance);
  }
  setData(STORAGE_KEYS.LEAVE_BALANCES, balances);
};

// ============================================
// PAYROLL STORAGE FUNCTIONS
// ============================================
export const getPayslips = (): Payslip[] => {
  return getData<Payslip[]>(STORAGE_KEYS.PAYSLIPS) || [];
};

export const getPayslipsByEmployee = (employeeId: string): Payslip[] => {
  const payslips = getPayslips();
  return payslips.filter(p => p.employeeId === employeeId).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
};

export const getPayslipById = (id: string): Payslip | undefined => {
  const payslips = getPayslips();
  return payslips.find(p => p.id === id);
};

export const savePayslip = (payslip: Payslip): void => {
  const payslips = getPayslips();
  const index = payslips.findIndex(p => p.id === payslip.id);
  if (index !== -1) {
    payslips[index] = payslip;
  } else {
    payslips.push(payslip);
  }
  setData(STORAGE_KEYS.PAYSLIPS, payslips);
};

// ============================================
// ACCRUAL RULES STORAGE
// ============================================
export const getAccrualRules = (): AccrualRule[] => {
  return getData<AccrualRule[]>(STORAGE_KEYS.ACCRUAL_RULES) || [];
};

export const saveAccrualRule = (rule: AccrualRule): void => {
  const rules = getAccrualRules();
  const index = rules.findIndex(r => r.id === rule.id);
  if (index !== -1) {
    rules[index] = rule;
  } else {
    rules.push(rule);
  }
  setData(STORAGE_KEYS.ACCRUAL_RULES, rules);
};

// Initialize default accrual rules
export const initializeDefaultRules = (): void => {
  const rules = getAccrualRules();
  if (rules.length === 0) {
    const defaultRules: AccrualRule[] = [
      { id: generateId(), leaveType: 'annual', daysPerMonth: 1.5, maxAccrual: 18, carryOver: true },
      { id: generateId(), leaveType: 'sick', daysPerMonth: 0.5, maxAccrual: 6, carryOver: false },
      { id: generateId(), leaveType: 'personal', daysPerMonth: 0.25, maxAccrual: 3, carryOver: false },
    ];
    setData(STORAGE_KEYS.ACCRUAL_RULES, defaultRules);
  }
};