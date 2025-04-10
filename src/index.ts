import express from 'express';
import { PrismaClient, RecommendationType } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

app.use(express.json());

app.post('/stay', async (req, res) => {
    try {
        const {
            arrival,
            departure,
            accommodation,
            recommendations = []
        } = req.body;

        const stay = await prisma.stayInfo.create({
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
                    create: recommendations.map((rec: any) => ({
                        name: rec.name,
                        address: rec.address || '',
                        description: rec.description || '',
                        type: rec.type.toUpperCase() as RecommendationType
                    })),
                },
            },
        });

        res.status(201).json(stay);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create stay info' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
