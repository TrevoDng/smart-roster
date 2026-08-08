// User types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string; // In real app, this would be hashed
  phone?: string;
  companyNumber?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

// Roster types
export type ShiftType = 'Day' | 'Night' | 'Off' | string;

export interface Employee {
  id: string;
  name: string;
  phone: string;
  email: string;
  companyNumber: string;
  circlePattern: string[]; // Array of any shift names
}

export interface EmployeeFormData {
  id: string;
  name: string;
  phone: string;
  email: string;
  companyNumber: string;
  circlePattern: string[]; // Array of any shift names
}

// Update Roster interface
export interface Roster {
  id: string;
  startDate: string;
  endDate: string;
  name: string; // Auto-generated from dates
  employees: Employee[];
  currentVersion: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  generatedData?: {
    headers: string[];
    rows: Record<string, ShiftType[]>;
    summary: Array<{ name: string; shifts: number }>;
  }; // This is only present in snapshots
}

export interface RosterChange {
  id: string;
  rosterId: string;
  employeeId: string;
  changeType: 'overtime' | 'extra_off' | 'shift_change';
  oldValue: any;
  newValue: any;
  date: string; // The date the change applies to
  changedBy: string; // User ID
  changedAt: string;
  notes?: string;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

export interface RosterState {
  rosters: Roster[];
  currentRoster: Roster | null;
  changes: RosterChange[];
  loading: boolean;
  error: string | null;
}

// Add these to your existing types file

export interface RosterFormData {
  startDate: string;
  endDate: string;
  employees: EmployeeFormData[];
}

export interface EmployeeFormData {
  id: string;
  name: string;
  phone: string;
  email: string;
  companyNumber: string;
  circlePattern: ShiftType[];
}

export interface RosterCreationStep {
  step: 1 | 2 | 3 | 4;
  title: string;
  description: string;
}

// Add these new types or update existing ones

export interface RosterSnapshot {
  id: string;
  rosterId: string;
  version: number;
  data: Roster & { generatedData: { // Ensure generatedData is always present in snapshots
    headers: string[];
    rows: Record<string, ShiftType[]>;
    summary: Array<{ name: string; shifts: number }>;
  }};
  changeType: 'created' | 'overtime' | 'extra_off' | 'shift_change';
  changeDetails: {
    employeeId?: string;
    date?: string;
    oldValue?: ShiftType;
    newValue?: ShiftType;
    notes?: string;
  };
  changedBy: string;
  changedAt: string;
}

// ============================================
// EMPLOYEE TYPES (Enhanced)
// ============================================
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  companyNumber: string;
  startDate: string;              // Employment start date
  endDate?: string;               // Employment end date (if terminated)
  status: 'active' | 'inactive' | 'terminated';
  position: string;               // Job title/position
  department: string;             // Department
  salary: number;                 // Monthly salary
  leaveBalance: number;           // Current available leave days
  totalLeaveAccrued: number;      // Total leave days accrued
  totalLeaveTaken: number;        // Total leave days taken
  createdAt: string;
  updatedAt: string;
}

// ============================================
// LEAVE TYPES
// ============================================
export interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  totalDays: number;              // Total working days (excluding weekends)
  leaveType: 'annual' | 'sick' | 'personal' | 'other';
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approvedBy?: string;            // Manager/Admin ID
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface LeaveBalance {
  employeeId: string;
  totalAnnual: number;            // Total annual leave days
  usedAnnual: number;             // Used annual leave days
  remainingAnnual: number;        // Remaining annual leave days
  totalSick: number;              // Total sick leave days
  usedSick: number;              // Used sick leave days
  remainingSick: number;         // Remaining sick leave days
  year: number;                   // Year this balance applies to
}

// ============================================
// PAYROLL TYPES
// ============================================
export interface Payslip {
  id: string;
  employeeId: string;
  month: number;                  // 1-12
  year: number;
  basicSalary: number;            // Base salary
  overtimePay: number;            // Overtime earnings
  bonusPay: number;              // Bonus/commission
  totalEarnings: number;         // Basic + Overtime + Bonus
  
  taxDeduction: number;          // Tax deduction
  pensionDeduction: number;      // Pension/retirement
  medicalDeduction: number;      // Medical aid
  otherDeductions: number;       // Other deductions
  totalDeductions: number;       // Sum of all deductions
  
  netPay: number;                // Total earnings - total deductions
  daysWorked: number;            // Days actually worked
  daysOnLeave: number;           // Days on leave
  createdAt: string;
  updatedAt: string;
}

// ============================================
// LEAVE ACCRUAL RULES
// ============================================
export interface AccrualRule {
  id: string;
  leaveType: 'annual' | 'sick' | 'personal';
  daysPerMonth: number;          // Days accrued per month
  maxAccrual: number;            // Maximum days that can be accumulated
  carryOver: boolean;            // Can unused days carry over to next year?
}
