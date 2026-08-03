import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express"; // 👈 சேர்க்கப்பட்டது
import { generateOpenApi } from "@ts-rest/open-api"; // 👈 சேர்க்கப்பட்டது

import { createExpressEndpoints } from "@ts-rest/express";
import multer from "multer";
import { upload } from "./middlewares/upload.middleware";
import { authenticateDeliveryPartner } from "./middlewares/delivery-auth.middleware";
import * as uploadController from "./controllers/upload.controller";

import { contract, expressRouterContract } from "@fish/contracts";
import { appRouter } from "./routes";
import { authenticateAdmin } from "./middlewares/auth.middleware";

import { prisma } from "./lib/prisma";

// ---------------------------------------------------
// Express Setup
// ---------------------------------------------------

const app = express();
const port = Number(process.env.PORT) || 3001;

// ---------------------------------------------------
// Middleware
// ---------------------------------------------------

// Comma-separated list of allowed origins, e.g.
// "https://shop.yourdomain.com,https://admin.yourdomain.com"
const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (allowedOrigins.length === 0) {
  console.warn(
    "[CORS] CORS_ALLOWED_ORIGINS is not set — allowing ALL origins. " +
      "This is fine for local dev but must be set to your real " +
      "frontend/admin domain(s) before deploying to production."
  );
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Requests with no Origin header (mobile apps, curl, server-to-server)
      // are always allowed — CORS only applies to browsers.
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS: origin "${origin}" is not allowed`)
      );
    },
    credentials: true,
  })
);

// Note: Helmet பயன்படுத்துவதால் சில நேரங்களில் Swagger CSS/JS லோடாவதில் சிக்கல் வரலாம்.
// அதனால் அதன் Content Security Policy (CSP)-ஐ Swagger-க்காக மட்டும் கீழே தளர்த்தியுள்ளோம்.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cloudflare.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cloudflare.com"],
        imgSrc: ["'self'", "data:", "https://swagger.io"],
      },
    },
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// ---------------------------------------------------
// Swagger Documentation Setup 🚀
// ---------------------------------------------------

// 1. ts-rest காண்ட்ராக்ட்டில் இருந்து OpenAPI Spec-ஐ உருவாக்குதல்
const openApiDocument = generateOpenApi(contract, {
  info: {
    title: "Fish Store API",
    version: "1.0.0",
    description: "Auto-generated Swagger documentation using ts-rest",
  },
  // உங்கள் API-யில் Bearer Auth இருந்தால் அதை இங்கு சேர்க்கலாம்
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
});

// 2. Swagger UI எண்ட்பாயிண்ட்டை உருவாக்குதல் (/api-docs)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

// 3. Raw JSON வடிவில் பார்க்க விரும்பினால் (விருப்பத்திற்குரியது)
app.get("/api-docs.json", (req, res) => res.json(openApiDocument));

// ---------------------------------------------------
// Health Check
// ---------------------------------------------------

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "Fish Store API Running",
    docs: `http://localhost:${port}/api-docs` // UI லிங்க்
  });
});

app.use(
  "/admin",
  authenticateAdmin
);

app.use(
  "/delivery/orders",
  authenticateDeliveryPartner
);

app.post(
  "/upload",
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message:
              "Image is too large — max allowed is 20MB.",
          });
        }
        return res
          .status(400)
          .json({ message: err.message });
      }

      if (err) {
        console.error("[upload middleware]", err);
        return res
          .status(500)
          .json({ message: "Upload failed." });
      }

      next();
    });
  },
  async (req, res) => {
    const result = await uploadController.uploadImage({ req });
    res.status(result.status).json(result.body);
  }
);

// ---------------------------------------------------
// Register ts-rest Endpoints
// ---------------------------------------------------

createExpressEndpoints(expressRouterContract, appRouter, app, {
  logInitialization: true,
  responseValidation: true,
  requestValidationErrorHandler: "combined",
});

// ---------------------------------------------------
// Global Error Handler
// ---------------------------------------------------

app.use(
  (
    err: unknown,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  },
);

// ---------------------------------------------------
// Start Server
// ---------------------------------------------------

app.listen(port, "0.0.0.0", () => {
  console.log(`Node.js Backend Server running on port ${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api-docs 📄`);
});
