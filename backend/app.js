require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const xlsx = require('xlsx');
const Groq = require('groq-sdk');
const nodemailer = require('nodemailer');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();
const port = process.env.PORT || 5000;

app.set('trust proxy' , 1);

// Security Middleware
app.use(helmet()); 
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

// Rate Limiting: Prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 50 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Setup File Uploads (In-Memory for security)
const upload = multer({ storage: multer.memoryStorage() });

// Setup AI and Email Clients
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const transporter = nodemailer.createTransport({    
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false, // true for 465, false for other ports
    family: 4,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

// Swagger Docs (Serve at /api-docs)
// You would ideally load an external swagger.yaml, but we define it inline for the prototype
const swaggerDocument = YAML.parse(`
openapi: 3.0.0
info:
  title: Sales Insight Automator API
  version: 1.0.0
paths:
  /api/generate-insight:
    post:
      summary: Upload sales data and email an AI summary
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file:
                  type: string
                  format: binary
                email:
                  type: string
      responses:
        '200':
          description: Insight generated and emailed successfully.
`);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Main Endpoint
app.post('/api/generate-insight', upload.single('file'), async (req, res) => {
    try {
        if (!req.file || !req.body.email) {
            return res.status(400).json({ error: 'File and email are required.' });
        }

        // 1. Parse Data
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        const dataString = JSON.stringify(data).substring(0, 15000); // Truncate to avoid token limits

        // 2. Generate Insight via Gemini
     // 2. Generate Insight via Groq
        const prompt = `You are a Chief Revenue Officer. Analyze the following raw sales data and provide a concise, professional 3-paragraph executive summary. Highlight top performers, trends, and areas of concern. Data: ${dataString}`;
        
        const result = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.3-70b-versatile", // Blazing fast open-source model
        });

        const aiSummary = result.choices[0]?.message?.content || "No summary generated.";

        // 3. Dispatch Email
        await transporter.sendMail({

            from: `"Sales Automator" <${process.env.SMTP_USER}>`,
            to: req.body.email,
            subject: "Your Quarterly Sales Insight Brief",
            text: aiSummary
        });

        res.status(200).json({ message: 'Summary generated and dispatched successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during processing.' });
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
