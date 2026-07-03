import { z } from 'zod';

// Verhoeff algorithm matrices for Aadhaar validation
const d = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];
const p = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

function validateVerhoeff(num: string) {
  let c = 0;
  let myArray = String(num).split('');
  myArray.reverse();
  for (let i = 0; i < myArray.length; i++) {
    c = d[c][p[i % 8][parseInt(myArray[i], 10)]];
  }
  return c === 0;
}

export const step1Schema = z.object({
  aadhaarNumber: z.string()
    .length(12, 'Aadhaar Number must be exactly 12 digits')
    .regex(/^[2-9]\d{11}$/, 'Aadhaar must not start with 0 or 1 and contain only numeric digits')
    .refine(validateVerhoeff, { message: 'Invalid Aadhaar Number (Checksum failed)' }),
  entrepreneurName: z.string().min(1, 'Entrepreneur Name is required'),
});

export const verifyOtpSchema = z.object({
  registrationId: z.string().uuid('Invalid registration ID'),
  otp: z.string().min(6, 'OTP must be at least 6 digits'),
});

export const step2Schema = z.object({
  registrationId: z.string().uuid('Invalid registration ID'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username must be at most 30 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Invalid PAN Number format (e.g. ABCDE1234F)'),
  typeOfEnterprise: z.enum(['Micro', 'Small', 'Medium'], { message: 'Type of Enterprise is required' }),
  typeOfOrganization: z.enum([
    'Proprietorship', 'Hindu Undivided Family (HUF)', 'Partnership',
    'Limited Liability Partnership (LLP)', 'Private Limited Company',
    'Public Limited Company', 'Cooperative Society', 'Society', 'Trust'
  ], { message: 'Type of Organization is required' }),
  businessName: z.string().min(1, 'Business/Enterprise Name is required'),
  dateOfIncorporation: z.string().optional(),
  mobileNumber: z.string().length(10, 'Mobile number must be 10 digits').regex(/^\d+$/, 'Mobile number must contain only digits'),
  email: z.string().email('Invalid email format'),
  addressLine1: z.string().min(1, 'Address Line 1 is required'),
  addressLine2: z.string().optional(),
  state: z.string().min(1, 'State is required'),
  district: z.string().min(1, 'District is required'),
  pinCode: z.string().length(6, 'PIN Code must be 6 digits').regex(/^\d+$/, 'PIN Code must contain only digits'),
});

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  aadhaarNumber: z.string()
    .length(12, 'Aadhaar Number must be exactly 12 digits')
    .regex(/^[2-9]\d{11}$/, 'Aadhaar must not start with 0 or 1 and contain only numeric digits')
    .refine(validateVerhoeff, { message: 'Invalid Aadhaar Number (Checksum failed)' }),
});

export const loginVerifyOtpSchema = z.object({
  registrationId: z.string().uuid('Invalid registration ID'),
  otp: z.string().min(6, 'OTP must be at least 6 digits'),
});
