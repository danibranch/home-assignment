import express, { Router } from "express";
import { registerUser, loginUser, getUserProfile } from "./service"
import { authMiddleware } from "../middlewares/authMiddleware"

const router: Router = express.Router();
/**
 * @swagger
 * /auth/register:
 *  post:
 *      summary: Register a new user
 *      description: Register a new user with email and password
 *      tags:
 *         - Auth
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          user:
 *                             type: object
 *                             properties:
 *                                  name:
 *                                      type: string
 *                                      description: The name of the user
 *                                  email:
 *                                      type: string
 *                                      description: The email of the user
 *                                  password:
 *                                      type: string
 *                                      description: The password of the user
 *                      example:
 *                          user:
 *                              name: John Doe
 *                              email: test@email.com
 *                              password: password123
 *      responses:
 *          201:
 *              description: User registered successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              success:
 *                                  type: boolean
 *                                  description: Indicates if the registration was successful
 *                              token:
 *                                  type: string
 *                                  description: The JWT token for the user to use on requests for authenticated routes
 *          400:
 *              description: Bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: The error message
 * 
 */
router.post("/register", async (req, res, next) => {
    try {
        const response = await registerUser(req.body);
        res.status(201).send(response);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /auth/login:
 *  post:
 *      summary: Login a user
 *      description: Login a user with email and password
 *      tags:
 *         - Auth
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          user:
 *                              type: object
 *                              properties:
 *                                  email:
 *                                      type: string
 *                                      description: The email of the user
 *                                  password:
 *                                      type: string
 *                                      description: The password of the user
 *                      example:
 *                          user:
 *                              email: test@email.com
 *                              password: password123
 *      responses:
 *          200:
 *              description: User logged in successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              success:
 *                                  type: boolean
 *                                  description: Indicates if the login was successful
 *                              token:
 *                                  type: string
 *                                  description: The JWT token for the user to use on requests for authenticated routes
 *          400:
 *              description: Bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: The error message
 */
router.post("/login", async (req, res, next) => {
    try {
        const response = await loginUser(req.body);
        res.status(200).send(response);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /auth/profile:
 *  get:
 *      summary: Get user profile
 *      description: Get user profile with JWT token
 *      tags:
 *          - Auth
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: User profile retrieved successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              user:
 *                                  $ref: '#/components/schemas/User'
 *          401:
 *              description: Unauthorized
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  description: The error message
 */
router.get("/profile", authMiddleware, async (req, res, next) => {
    try {
        const response = await getUserProfile(res.locals.user.id);
        res.status(200).send(response);
    }
    catch (err) {
        next(err);
    }
});

export default router;