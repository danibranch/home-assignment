import express, { Router } from "express";
import { getAllUsers, getUserById, updateUser, deleteUser } from "./service";
import { Prisma } from "@prisma/client";
import { CustomError } from "../customError";

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              id:
 *                  type: string
 *                  description: The user ID
 *                  example: b54aad77-4c3c-4657-ba9d-a20d4fdcd41a
 *              name:
 *                  type: string
 *                  description: The user name
 *                  example: John Doe
 *              email:
 *                  type: string
 *                  description: The user email
 *                  example: test@email.com
 *              password:
 *                  type: string
 *                  description: The user password
 *                  example: password123
 *              role:
 *                  type: string
 *                  description: The user role
 *                  enum: [user, admin]
 *              createdAt:
 *                  type: string
 *                  description: The user creation date
 *                  example: 2025-03-25T20:58:15.954Z
 *              updatedAt:
 *                  type: string
 *                  description: The user update date
 *                  example: 2025-03-25T20:58:15.954Z
 */

const router: Router = express.Router();

/**
 * @swagger
 * /users:
 *  get:
 *      summary: Get all users
 *      description: Get all users from the database
 *      tags:
 *          - Users
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: A list of users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/User'
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
router.get("/", async (req, res, next) => {
    try {
        const response = await getAllUsers();
        res.status(200).send(response);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /users/{id}:
 *  get:
 *      summary: Get single user by id
 *      description: Get a single user by id from the database
 *      parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            description: The user ID
 *      tags:
 *          - Users
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: A user's information
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
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
 *          404:
 *              description: User not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 */
router.get("/:id", async (req, res, next) => {
    try {
        const response = await getUserById(req.params.id);
        res.status(200).send(response);
    } catch (err) {
        next(err);
    }
})

/**
 * @swagger
 * /users/{id}:
 *  patch:
 *      summary: Update user by id
 *      description: Update a single user by id in the database
 *      parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            description: The user ID
 *      tags:
 *          - Users
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *              description: User updated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
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
 *          404:
 *              description: User not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 */
router.patch("/:id", async (req, res, next) => {
    try {
        const response = await updateUser(req.params.id, req.body);
        res.status(200).send(response);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            next(new CustomError(404, "User not found"));
        }
        next(err);
    }
})

/**
 * @swagger
 * /users/{id}:
 *  delete:
 *      summary: Delete user by id
 *      description: Delete a single user by id from the database
 *      parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            description: The user ID
 *      tags:
 *          - Users
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: User deleted successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
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
 *          404:
 *              description: User not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 */
router.delete("/:id", async (req, res, next) => {
    try {
        const response = await deleteUser(req.params.id);
        res.status(200).send(response);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            next(new CustomError(404, "User not found"));
        }
        next(err);
    }
});

export default router;