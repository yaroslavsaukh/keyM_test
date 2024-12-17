import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from "dotenv";

dotenv.config()

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Bookings Api',
            version: '1.0.0',
            description: 'API Documentation',
        },
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Booking: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Booking ID',
                        },
                        user: {
                            type: 'string',
                            description: 'User ID',
                        },
                        date: {
                            type: 'string',
                            format: 'date',
                            description: 'Booking date',
                        },
                        startTime: {
                            type: 'string',
                            description: 'Start time of the booking',
                        },
                        endTime: {
                            type: 'string',
                            description: 'End time of the booking',
                        },
                    },
                },
            },
        },
        servers: [
            {
                url: process.env.BASE_URL,
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;