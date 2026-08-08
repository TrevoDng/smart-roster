// src/context/PayrollContext.tsx

import React, { ReactNode, useContext, useState, createContext } from "react";



interface Payroll {
    id: string;
    employeeId: string;
    salary: number;
    bonus: number;
    deductions: number;
}

interface PayrollContextType {
    payrolls: Payroll[];
    addPayroll: (payroll: Payroll) => void;
    updatePayroll: (updatedPayroll: Payroll) => void;
    removePayroll: (payrollId: string) => void;
}

const PayrollContext = createContext<PayrollContextType | undefined>(undefined);

export const usePayrollContext = () => {
    const context = useContext(PayrollContext);
    if (!context) {
        throw new Error('usePayrollContext must be used within a PayrollProvider');
    }
    return context;
};

interface PayrollProviderProps {
    children: ReactNode;
}

export const PayrollProvider = ({ children }: PayrollProviderProps) => {
    const [payrolls, setPayrolls] = useState<Payroll[]>([]);

    const addPayroll = (payroll: Payroll) => {
        setPayrolls((prev) => [...prev, payroll]);
    };

    const updatePayroll = (updatedPayroll: Payroll) => {
        setPayrolls((prev) =>
            prev.map((p) => (p.id === updatedPayroll.id ? updatedPayroll : p))
        );
    };

    const removePayroll = (payrollId: string) => {
        setPayrolls((prev) => prev.filter((p) => p.id !== payrollId));
    };

    return (
        <PayrollContext.Provider value={{ payrolls, addPayroll, updatePayroll, removePayroll }}>
            {children}
        </PayrollContext.Provider>
    );
};
