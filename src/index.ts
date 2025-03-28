import express, { Express, Request, Response } from "express";
import authRoutes from "./auth/routes";
import userRoutes from "./users/routes";
import dataRoutes from "./data/routes";
import { authMiddleware } from "./middlewares/authMiddleware";
import { adminMiddleware } from "./middlewares/adminMiddleware";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { CustomError } from "./customError";

const app: Express = express();
const port = 3000;

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", authMiddleware, adminMiddleware, userRoutes);
app.use("/data", dataRoutes)

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./**/routes.ts"],
}
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(errorMiddleware)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});