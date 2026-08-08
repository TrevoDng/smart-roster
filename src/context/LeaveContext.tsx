// src/context/LeaveContext.tsx

import { ReactNode, useContext, useState, createContext } from "react";



interface Leave {
    id: string;
    employeeId: string;
    startDate: string;
    endDate: string;
    status: 'pending' | 'approved' | 'rejected';
}

interface LeaveContextType {
    leaves: Leave[];
    addLeave: (leave: Leave) => void;
    updateLeave: (updatedLeave: Leave) => void;
    removeLeave: (leaveId: string) => void;
}

const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

export const useLeaveContext = () => {
    const context = useContext(LeaveContext);
    if (!context) {
        throw new Error('useLeaveContext must be used within a LeaveProvider');
    }
    return context;
};

interface LeaveProviderProps {
    children: ReactNode;
}

export const LeaveProvider = ({ children }: LeaveProviderProps) => {
    const [leaves, setLeaves] = useState<Leave[]>([]);

    const addLeave = (leave: Leave) => {
        setLeaves((prev) => [...prev, leave]);
    };

    const updateLeave = (updatedLeave: Leave) => {
        setLeaves((prev) =>
            prev.map((l) => (l.id === updatedLeave.id ? updatedLeave : l))
        );
    };

    const removeLeave = (leaveId: string) => {
        setLeaves((prev) => prev.filter((l) => l.id !== leaveId));
    };

    return (
        <LeaveContext.Provider value={{ leaves, addLeave, updateLeave, removeLeave }}>
            {children}
        </LeaveContext.Provider>
    );
};
