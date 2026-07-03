import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class RegistrationRepository {
  async createStep1(aadhaarNumber: string, entrepreneurName: string) {
    return prisma.entrepreneur.create({
      data: {
        aadhaarNumber,
        entrepreneurName,
      },
      include: { enterprise: { include: { address: true } } },
    });
  }

  async findByAadhaar(aadhaarNumber: string) {
    return prisma.entrepreneur.findUnique({
      where: { aadhaarNumber },
      include: { enterprise: { include: { address: true } } },
    });
  }

  async findById(id: string) {
    return prisma.entrepreneur.findUnique({
      where: { id },
      include: { enterprise: { include: { address: true } } },
    });
  }

  async findByUsername(username: string) {
    return prisma.entrepreneur.findUnique({
      where: { username },
      include: { enterprise: { include: { address: true } } },
    });
  }

  async findByPan(panNumber: string) {
    return prisma.enterprise.findFirst({
      where: { panNumber },
      include: { entrepreneur: true },
    });
  }

  /** Reset a partial registration for re-attempt */
  async resetRegistration(id: string, entrepreneurName: string) {
    return prisma.entrepreneur.update({
      where: { id },
      data: {
        entrepreneurName,
        otpVerified: false,
      },
      include: { enterprise: { include: { address: true } } },
    });
  }

  async verifyOtp(id: string) {
    return prisma.entrepreneur.update({
      where: { id },
      data: { otpVerified: true },
      include: { enterprise: { include: { address: true } } },
    });
  }

  async completeStep2(id: string, data: {
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
    return prisma.entrepreneur.update({
      where: { id },
      data: {
        username: data.username,
        mobileNumber: data.mobileNumber,
        email: data.email,
        isRegistered: true,
        enterprise: {
          create: {
            panNumber: data.panNumber,
            typeOfEnterprise: data.typeOfEnterprise,
            typeOfOrganization: data.typeOfOrganization,
            businessName: data.businessName,
            dateOfIncorporation: data.dateOfIncorporation,
            address: {
              create: {
                addressLine1: data.addressLine1,
                addressLine2: data.addressLine2,
                state: data.state,
                district: data.district,
                pinCode: data.pinCode,
              }
            }
          }
        }
      },
      include: { enterprise: { include: { address: true } } },
    });
  }
}

export const registrationRepository = new RegistrationRepository();
