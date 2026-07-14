import { User, Roster, RosterChange, RosterSnapshot } from '../types';

const STORAGE_KEYS = {
  USERS: 'roster_users',
  ROSTERS: 'roster_data',
  CHANGES: 'roster_changes',
  SNAPSHOTS: 'roster_snapshots',
  CURRENT_USER: 'roster_current_user',
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