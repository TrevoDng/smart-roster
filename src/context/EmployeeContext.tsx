// src/context/EmployeeContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Employee {
    id: string;
    name: string;
    position: string;
    department: string;
    // Add other employee fields as needed
}

interface EmployeeContextType {
    employees: Employee[];
    addEmployee: (employee: Employee) => void;
    updateEmployee: (updatedEmployee: Employee) => void;
    removeEmployee: (employeeId: string) => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const useEmployeeContext = () => {
    const context = useContext(EmployeeContext);
    if (!context) {
        throw new Error('useEmployeeContext must be used within an EmployeeProvider');
    }
    return context;
};

interface EmployeeProviderProps {
    children: ReactNode;
}

export const EmployeeProvider = ({ children }: EmployeeProviderProps) => {
    const [employees, setEmployees] = useState<Employee[]>([]);

    const addEmployee = (employee: Employee) => {
        setEmployees((prev) => [...prev, employee]);
    };

    const updateEmployee = (updatedEmployee: Employee) => {
        setEmployees((prev) =>
            prev.map((emp) => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
        );
    };

    const removeEmployee = (employeeId: string) => {
        setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
    };

    return (
        <EmployeeContext.Provider value={{ employees, addEmployee, updateEmployee, removeEmployee }}>
            {children}
        </EmployeeContext.Provider>
    );
};