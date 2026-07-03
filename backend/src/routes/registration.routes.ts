import { Router } from 'express';
import { registrationController } from '../controllers/registration.controller';
import { validateRequest } from '../middleware/validateRequest.middleware';
import { step1Schema, step2Schema, verifyOtpSchema, loginSchema, loginVerifyOtpSchema } from '../schemas/registration.schema';

const router = Router();

router.post(
  '/step1',
  validateRequest(step1Schema, {
    aadhaarNumber: 'ctl00_ContentPlaceHolder1_txtadharno',
    entrepreneurName: 'ctl00_ContentPlaceHolder1_txtownername'
  }),
  registrationController.step1
);

router.post(
  '/verify-otp',
  validateRequest(verifyOtpSchema),
  registrationController.verifyOtp
);

router.post(
  '/step2',
  validateRequest(step2Schema),
  registrationController.step2
);

router.post(
  '/login',
  validateRequest(loginSchema),
  registrationController.login
);

router.post(
  '/verify-login-otp',
  validateRequest(loginVerifyOtpSchema),
  registrationController.verifyLoginOtp
);

router.get('/:id', registrationController.getRegistration);

export default router;
