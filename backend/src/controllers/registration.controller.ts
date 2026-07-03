import { Request, Response, NextFunction } from 'express';
import { registrationService } from '../services/registration.service';
import { ApiResponse } from '../utils/ApiResponse';

export class RegistrationController {
  async step1(req: Request, res: Response, next: NextFunction) {
    try {
      const { aadhaarNumber, entrepreneurName } = req.body;
      const result = await registrationService.processStep1(aadhaarNumber, entrepreneurName);
      return ApiResponse.success(res, 'Step 1 completed successfully', result, 201);
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { registrationId, otp } = req.body;
      await registrationService.verifyOtp(registrationId, otp);
      return ApiResponse.success(res, 'OTP verified successfully');
    } catch (error) {
      next(error);
    }
  }

  async step2(req: Request, res: Response, next: NextFunction) {
    try {
      const { registrationId, ...data } = req.body;
      const result = await registrationService.processStep2(registrationId, data);
      return ApiResponse.success(res, 'Registration completed successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, aadhaarNumber } = req.body;
      const result = await registrationService.login(username, aadhaarNumber);
      return ApiResponse.success(res, 'Login OTP generated successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async verifyLoginOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { registrationId, otp } = req.body;
      const result = await registrationService.verifyLoginOtp(registrationId, otp);
      return ApiResponse.success(res, 'Login successful', { registration: result });
    } catch (error) {
      next(error);
    }
  }

  async getRegistration(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await registrationService.getRegistration(id as string);
      return ApiResponse.success(res, 'Registration retrieved', result);
    } catch (error) {
      next(error);
    }
  }
}

export const registrationController = new RegistrationController();
