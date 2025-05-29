import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import creditCardTokenRoutes from './routes/main.routes';
import { initRedis } from './lib/redis';
import { validateApiKeyHeader } from './middlewares/validateHeader';

const app = express();
const PORT = process.env.PORT_SERVER;

app.use(validateApiKeyHeader);

app.use(bodyParser.json());
app.use('/creditCardToken', creditCardTokenRoutes);

app.listen(PORT, async () => {
    await initRedis();
    console.log(`Server running on http://localhost:${PORT}`);
});