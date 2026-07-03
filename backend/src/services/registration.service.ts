import { registrationRepository } from '../repositories/registration.repository';
import { ApiError } from '../utils/ApiError';

// In-memory OTP store: registrationId -> { otp, expiresAt }
const otpStore: Map<string, { otp: string; expiresAt: Date }> = new Map();

/** Generate a random 6-digit OTP */
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/** Flatten the nested database structure into the flat object expected by the frontend */
function flattenRegistration(entrepreneur: any) {
  if (!entrepreneur) return null;
  const { enterprise, ...rest } = entrepreneur;
  let flat = { ...rest };
  if (enterprise) {
    const { address, ...enterpriseRest } = enterprise;
    flat = { ...flat, ...enterpriseRest };
    if (address) {
      flat = { ...flat, ...address };
    }
  }
  return flat;
}

export class RegistrationService {
  async processStep1(aadhaarNumber: string, entrepreneurName: string) {
    const existing = await registrationRepository.findByAadhaar(aadhaarNumber);

    if (existing && existing.isRegistered) {
      // Fully registered — block re-registration
      throw new ApiError(409, 'This Aadhaar is already registered. Please use the Login option from the top-right menu.');
    }

    let registration;
    if (existing) {
      // Partial registration (started but never completed Step 2) — allow re-attempt
      registration = await registrationRepository.resetRegistration(existing.id, entrepreneurName);
    } else {
      registration = await registrationRepository.createStep1(aadhaarNumber, entrepreneurName);
    }

    // Generate a random OTP and store it with 5-minute expiry
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    otpStore.set(registration.id, { otp, expiresAt });

    console.log(`\n📱 OTP for Aadhaar ${aadhaarNumber}: ${otp} (valid for 5 minutes)\n`);

    return {
      registrationId: registration.id,
      message: 'OTP has been generated. Check backend console for demo OTP.',
      otp: otp, // For demo only — remove in production
    };
  }

  async verifyOtp(registrationId: string, otp: string) {
    const registration = await registrationRepository.findById(registrationId);
    if (!registration) {
      throw new ApiError(404, 'Registration not found');
    }

    if (registration.otpVerified) {
      throw new ApiError(400, 'OTP already verified');
    }

    const storedOtp = otpStore.get(registrationId);
    if (!storedOtp) {
      throw new ApiError(400, 'No OTP found. Please generate a new OTP.');
    }

    if (new Date() > storedOtp.expiresAt) {
      otpStore.delete(registrationId);
      throw new ApiError(400, 'OTP has expired. Please generate a new OTP.');
    }

    if (otp !== storedOtp.otp) {
      throw new ApiError(400, 'Invalid OTP. Please try again.');
    }

    otpStore.delete(registrationId);
    await registrationRepository.verifyOtp(registrationId);

    return { success: true };
  }

  async processStep2(registrationId: string, data: {
    username: string;
    panNumber: string;
    typeOfEnterprise: string;
    typeOfOrganization: string;
    businessName: string;
    dateOfIncorporation?: string;
    mobileNumber: string;
    email: string;
    addressLine1: string;
    addressLine2?: string;
    state: string;
    district: string;
    pinCode: string;
  }) {
    const registration = await registrationRepository.findById(registrationId);
    if (!registration) {
      throw new ApiError(404, 'Registration not found');
    }

    if (!registration.otpVerified) {
      throw new ApiError(400, 'OTP must be verified before proceeding to Step 2');
    }

    if (registration.isRegistered) {
      throw new ApiError(409, 'Step 2 is already completed for this registration');
    }

    // Check username uniqueness
    const existingUsername = await registrationRepository.findByUsername(data.username);
    if (existingUsername && existingUsername.id !== registrationId) {
      throw new ApiError(409, 'This username is already taken. Please choose a different one.');
    }

    // Check PAN uniqueness — one PAN can only link to one Aadhaar
    const existingPan = await registrationRepository.findByPan(data.panNumber);
    if (existingPan && existingPan.entrepreneurId !== registrationId) {
      throw new ApiError(409, 'This PAN is already linked to another Aadhaar number. Each PAN can only be used with one Aadhaar.');
    }

    const updated = await registrationRepository.completeStep2(registrationId, data);

    return { registration: flattenRegistration(updated) };
  }

  async login(username: string, aadhaarNumber: string) {
    const registration = await registrationRepository.findByUsername(username);
    if (!registration) {
      throw new ApiError(404, 'No account found with this username. Please register first.');
    }

    if (!registration.isRegistered) {
      throw new ApiError(400, 'Registration is incomplete. Please complete Step 2 first.');
    }

    if (registration.aadhaarNumber !== aadhaarNumber) {
      throw new ApiError(400, 'Invalid Aadhaar Number for this username.');
    }

    // Generate a random OTP and store it with 5-minute expiry
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    otpStore.set(registration.id + '_login', { otp, expiresAt }); // Use suffix to distinguish from registration OTP

    console.log(`\n📱 Login OTP for user ${username}: ${otp} (valid for 5 minutes)\n`);

    return {
      registrationId: registration.id,
      message: 'OTP has been generated. Check backend console for demo OTP.',
      otp: otp, // For demo only
    };
  }

  async verifyLoginOtp(registrationId: string, otp: string) {
    const registration = await registrationRepository.findById(registrationId);
    if (!registration) {
      throw new ApiError(404, 'Registration not found');
    }

    const storedOtp = otpStore.get(registrationId + '_login');
    if (!storedOtp) {
      throw new ApiError(400, 'No OTP found. Please generate a new OTP.');
    }

    if (new Date() > storedOtp.expiresAt) {
      otpStore.delete(registrationId + '_login');
      throw new ApiError(400, 'OTP has expired. Please generate a new OTP.');
    }

    if (otp !== storedOtp.otp) {
      throw new ApiError(400, 'Invalid OTP. Please try again.');
    }

    otpStore.delete(registrationId + '_login');

    return flattenRegistration(registration);
  }

  async getRegistration(registrationId: string) {
    const registration = await registrationRepository.findById(registrationId);
    if (!registration) {
      throw new ApiError(404, 'Registration not found');
    }
    return flattenRegistration(registration);
  }
}

export const registrationService = new RegistrationService();
