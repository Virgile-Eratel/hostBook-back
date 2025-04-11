import { RecommendationType } from '@prisma/client';
import PrismaService from './prisma.service';
import dotenv from 'dotenv';
import OpenAI from "openai";
const client = new OpenAI();

dotenv.config();

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
            type: "RESTAURANT" | "ACTIVITY" | "BAR" | "TOURISM" | "GROCERY";
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

    async createFromPdfText(pdfText: string) {
        try {
            const prompt = `
Tu es un assistant spécialisé dans la structuration de contenu Airbnb.

Je vais te donner le texte complet d’un livret d’accueil en PDF. Même si le document est en anglais, tu dois traduire **toutes** les informations, y compris les clés du JSON et les valeurs textuelles, en français.

Tu dois remplir un objet JSON respectant strictement le modèle suivant :

\`\`\`ts
{
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
        type: "RESTAURANT" | "ACTIVITY" | "BAR" | "TOURISM" | "GROCERY";
    }>;
}

\`\`\`

Utilise des chaînes de caractères complètes et bien écrites. Respecte le format JSON strict et n’ajoute **aucun commentaire ni explication**.

Voici le contenu du PDF :
"""
${pdfText}
"""
`;
            const openAIResponse = await client.responses.create({
                model: "gpt-4o",
                input: prompt
            },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                    }
                }
                );


            const output = openAIResponse.output_text.replace(/```json\s*([\s\S]*?)```/gm, '$1').trim();

            const stayInfoData = JSON.parse(output);

            return await this.createStay(stayInfoData);
        } catch (error) {
            console.error('Erreur dans createFromPdfText', error);
            throw error;
        }
    }

    async getStayById(id: string) {
        return this.prisma.stayInfo.findUnique({
            where: { id },
            include: { recommendations: true },
        });
    }

    async getAllStays() {
        return this.prisma.stayInfo.findMany({
            include: { recommendations: true },
        });
    }

    async updateStay(id: string, data: any) {
        return this.prisma.stayInfo.update({
            where: { id },
            data,
            include: { recommendations: true },
        });
    }

    async deleteStay(id: string) {
        await this.prisma.recommendation.deleteMany({
            where: { stayInfoId: id },
        });
        return this.prisma.stayInfo.delete({
            where: { id },
        });
    }
}

export default new StayInfoService();
