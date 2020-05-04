export interface User {
  id: number;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNo: string;
  isActive: boolean;
  isDoctor: boolean;
  invalidAttempt: number;
  firstLogin: Date;
  password: string;
  confirmPassword: string;
};
