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

