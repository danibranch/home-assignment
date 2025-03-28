import express, { Router } from "express";
import {getData, postData} from "./service";

const router: Router = express.Router();

/**
 * @swagger
 * /data:
 *      get:
 *          summary: Get data
 *          description: Returns a hello world message.
 *          tags:
 *              - Data
 *          parameters:
 *              - name: city
 *                in: query
 *                description: The city to get the weather for.
 *                required: true
 *                type: string
 *                example: London
 *              - name: currency
 *                in: query
 *                description: The currency to get the crypto data for.
 *                required: true
 *                type: string
 *                example: bitcoin
 *              - name: refresh
 *                in: query
 *                description: Whether to refresh the data.
 *                required: false
 *                type: boolean
 *          responses:
 *              200:
 *                  description: A hello world message.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  city:
 *                                      type: string
 *                                      example: London
 *                                  weather:
 *                                      type: object
 *                                      properties:
 *                                          main:
 *                                              type: string
 *                                              example: Clouds
 *                                          description:
 *                                              type: string
 *                                              example: overcast clouds
 *                                          temperature:
 *                                              type: number
 *                                              example: 15.5
 *                                          units:
 *                                              type: string
 *                                              example: C
 *                                              enum: [C, F]
 *                                  crypto:
 *                                      type: object
 *                                      properties:
 *                                          currency:
 *                                              type: string
 *                                              example: bitcoin
 *                                          data:
 *                                              type: object
 *                                              properties:
 *                                                  eur:
 *                                                      type: number
 *                                                      example: 80748
 */
router.get("/", async (req, res, next) => {
    try {
        const query = req.query as { city: string; currency: string };
        const data = await getData(query);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /data:
 *  post:
 *      summary: Post data
 *      description: Returns a hello world message.
 *      tags:
 *          - Data
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          currency:
 *                              type: string
 *                              example: eur
 *                              description: The currency for which to get the crypto price
 *                              required: false
 *                          units:
 *                              type: string
 *                              example: metric 
 *                              description: The units for the weather data
 *                              required: false
 *                              enum: [metric, imperial]
 *      responses:
 *          200:
 *              description: The configuration object after updating
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              crypto:
 *                                  type: object
 *                                  properties:
 *                                      currency:
 *                                          type: string
 *                                          example: eur
 *                                          description: The currency for which to get the crypto price
 *                              weather:
 *                                  type: object
 *                                  properties:
 *                                      units:
 *                                          type: string
 *                                          example: metric
 *                                          description: The units for the weather data
 *                                          enum: [metric, imperial]
 */
router.post("/", async (req, res, next) => {
    try {
        const body = req.body as { currency?: string, units?: string };
        const data = await postData(body);
        res.status(200).json(data);
    }
    catch (error) {
        next(error);
    }
});

export default router;