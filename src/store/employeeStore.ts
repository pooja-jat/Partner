import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Employee } from '../types';

interface EmployeeState {
  employees: Employee[];
  isLoading: boolean;
  initialize: () => Promise<void>;
  addEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
  updateEmployee: (id: string, employee: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  isLoading: false,

  initialize: async () => {
    try {
      const json = await AsyncStorage.getItem('employees');
      if (json) {
        set({ employees: JSON.parse(json) });
      } else {
        const defaultEmployees = [
          { 
            id: 'EMP1', 
            name: 'Rahul Kumar', 
            branchName: 'Noida Sector 62 Branch', 
            role: 'Professional', 
            mainService: 'AC Repair', 
            subService: 'Split AC Servicing', 
            experience: '5 years', 
            mobileNumber: '9876543215', 
            isActive: true 
          },
          { 
            id: 'EMP2', 
            name: 'Pankaj Singh', 
            branchName: 'Noida Sector 62 Branch', 
            role: 'Professional', 
            mainService: 'Water Purifier Repair', 
            subService: 'RO Installation', 
            experience: '4 years', 
            mobileNumber: '9876543216', 
            isActive: true 
          },
          { 
            id: 'EMP3', 
            name: 'Aman Verma', 
            branchName: 'Noida Sector 62 Branch', 
            role: 'Professional', 
            mainService: 'Washing Machine Repair', 
            subService: 'Fully Automatic Top Load Repair', 
            experience: '3 years', 
            mobileNumber: '9876543217', 
            isActive: true 
          }
        ];
        set({ employees: defaultEmployees });
        await AsyncStorage.setItem('employees', JSON.stringify(defaultEmployees));
      }
    } catch (e) {
      console.warn('Failed to load employees', e);
    }
  },

  addEmployee: async (employeeData) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: Date.now().toString(),
    };
    const updatedEmployees = [...get().employees, newEmployee];
    set({ employees: updatedEmployees });
    await AsyncStorage.setItem('employees', JSON.stringify(updatedEmployees));
  },

  updateEmployee: async (id, updatedData) => {
    const updatedEmployees = get().employees.map((e) =>
      e.id === id ? { ...e, ...updatedData } : e
    );
    set({ employees: updatedEmployees });
    await AsyncStorage.setItem('employees', JSON.stringify(updatedEmployees));
  },

  deleteEmployee: async (id) => {
    const updatedEmployees = get().employees.filter((e) => e.id !== id);
    set({ employees: updatedEmployees });
    await AsyncStorage.setItem('employees', JSON.stringify(updatedEmployees));
  },
}));
