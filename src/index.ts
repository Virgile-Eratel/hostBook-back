import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

app.use(express.json());

app.get('/', (_req, res) => {
    res.send('Welcome to HostBook API 🚀');
});

app.use('/api', routes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
