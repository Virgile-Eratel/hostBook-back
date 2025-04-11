import { Request, Response } from 'express';
import stayInfoService from '../services/stayInfo.service';
import multer from 'multer';
import pdfParse from 'pdf-parse';

const storage = multer.memoryStorage();
export const upload = multer({ storage });

class StayInfoController {
    async createStay(req: Request, res: Response) {
        try {
            const stay = await stayInfoService.createStay(req.body);
            res.status(201).json(stay);
        } catch (error) {
            console.error('Error creating stay:', error);
            res.status(500).json({ error: 'Failed to create stay info' });
        }
    }

    async analyzePdf(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'Aucun fichier n\'a été envoyé' });
            }

            const data = await pdfParse(req.file.buffer);
            const pdfText: string = data.text;

            const stayInfo = await stayInfoService.createFromPdfText(pdfText);

            return res.status(200).json(stayInfo);
        } catch (error) {
            console.error('Erreur dans analyzePdf', error);
            return res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    }

    async getStayById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { password } = req.query; // Récupérer le mot de passe depuis les paramètres de la requête

            if (!password) {
                return res.status(401).json({ error: 'Password is required to access stay information' });
            }

            const stay = await stayInfoService.getStayById(id);

            if (!stay) {
                return res.status(404).json({ error: 'Stay not found' });
            }

            if (stay.accessPassword !== password) {
                return res.status(401).json({ error: 'Invalid password' });
            }

            res.status(200).json(stay);
        } catch (error) {
            console.error('Error fetching stay:', error);
            res.status(500).json({ error: 'Failed to fetch stay info' });
        }
    }

    async getAllStays(req: Request, res: Response) {
        try {
            const stays = await stayInfoService.getAllStays();
            res.status(200).json(stays);
        } catch (error) {
            console.error('Error fetching stays:', error);
            res.status(500).json({ error: 'Failed to fetch stays' });
        }
    }

    async updateStay(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const stay = await stayInfoService.updateStay(id, req.body);
            res.status(200).json(stay);
        } catch (error) {
            console.error('Error updating stay:', error);
            res.status(500).json({ error: 'Failed to update stay info' });
        }
    }
}

export default new StayInfoController();
