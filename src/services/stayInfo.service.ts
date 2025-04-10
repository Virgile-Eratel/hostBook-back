import { RecommendationType } from '@prisma/client';
import PrismaService from './prisma.service';

class StayInfoService {
  private prisma = PrismaService.getInstance().getClient();

  async createStay(data: {
    arrival: {
      time: string;
      accessInstructions: string;
      additionalInfo: string;
    };
    departure: {
      time: string;
      exitInstructions: string;
      additionalInfo: string;
    };
    accommodation: {
      wifiName: string;
      wifiPassword: string;
      houseRules: string;
      ownerContact: string;
      ownerName: string;
      generalInfo: string;
    };
    recommendations?: Array<{
      name: string;
      address?: string;
      description?: string;
      type: string;
    }>;
  }) {
    const { arrival, departure, accommodation, recommendations = [] } = data;

    return this.prisma.stayInfo.create({
      data: {
        arrivalTime: arrival.time,
        accessInstructions: arrival.accessInstructions,
        arrivalAdditionalInfo: arrival.additionalInfo,
        departureTime: departure.time,
        exitInstructions: departure.exitInstructions,
        departureAdditionalInfo: departure.additionalInfo,
        wifiName: accommodation.wifiName,
        wifiPassword: accommodation.wifiPassword,
        houseRules: accommodation.houseRules,
        ownerContact: accommodation.ownerContact,
        ownerName: accommodation.ownerName,
        generalInfo: accommodation.generalInfo,
        recommendations: {
          create: recommendations.map((rec) => ({
            name: rec.name,
            address: rec.address || '',
            description: rec.description || '',
            type: rec.type.toUpperCase() as RecommendationType,
          })),
        },
      },
      include: {
        recommendations: true,
      },
    });
  }

  async getStayById(id: string) {
    return this.prisma.stayInfo.findUnique({
      where: { id },
      include: {
        recommendations: true,
      },
    });
  }

  async getAllStays() {
    return this.prisma.stayInfo.findMany({
      include: {
        recommendations: true,
      },
    });
  }

  async updateStay(id: string, data: any) {
    // Implementation for update would go here
    // This would be more complex as it would need to handle recommendations updates
    return this.prisma.stayInfo.update({
      where: { id },
      data,
      include: {
        recommendations: true,
      },
    });
  }

  async deleteStay(id: string) {
    // First delete all related recommendations
    await this.prisma.recommendation.deleteMany({
      where: { stayInfoId: id },
    });

    // Then delete the stay
    return this.prisma.stayInfo.delete({
      where: { id },
    });
  }
}

export default new StayInfoService();
