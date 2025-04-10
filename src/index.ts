import express from 'express';
import routes from './routes';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Welcome route
app.get('/', (_req, res) => {
    res.send('Welcome to HostBook API 🚀');
});

// API routes
app.use('/api', routes);

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
