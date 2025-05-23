import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Hotel Manager System API",
            version: "1.0.0",
            description: "API documentation for the Hotel Manager System",
        },
        servers: [
            {
                url: "http://localhost:3000/hotelManagerSystem/v1",
            },
        ],
    },
    apis: ["./src/**/*.routes.js"], // Cambiado para incluir todos los archivos de rutas JS
};
const swaggerDocs = swaggerJSDoc(options);

export { swaggerDocs, swaggerUi };
