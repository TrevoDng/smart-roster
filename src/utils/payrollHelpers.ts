// src/utils/payrollHelpers.ts

const calculateGrossPay = (baseSalary: number, bonuses: number): number => {
    return baseSalary + bonuses;
};

const calculateDeductions = (tax: number, insurance: number): number => {
    return tax + insurance;
};

const calculateNetPay = (grossPay: number, deductions: number): number => {
    return grossPay - deductions;
};

export { calculateGrossPay, calculateDeductions, calculateNetPay };