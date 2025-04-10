import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (_req, res) => {
    res.send('Welcome to HostBook API 🚀');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
