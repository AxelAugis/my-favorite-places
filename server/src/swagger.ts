import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "My Favorite Places API",
      version: "1.0.0",
      description:
        "OpenAPI document generated from JSDoc annotations in Express controllers.",
    },
    servers: [{ url: "/" }],
    tags: [{ name: "users" }, { name: "addresses" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          required: ["message"],
          properties: {
            message: {
              type: "string",
            },
          },
        },
        User: {
          type: "object",
          required: ["id", "email", "createdAt"],
          properties: {
            id: {
              type: "number",
            },
            email: {
              type: "string",
              format: "email",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        UserResponse: {
          type: "object",
          required: ["item"],
          properties: {
            item: {
              $ref: "#/components/schemas/User",
            },
          },
        },
        TokenResponse: {
          type: "object",
          required: ["token"],
          properties: {
            token: {
              type: "string",
            },
          },
        },
        Address: {
          type: "object",
          required: ["id", "name", "description", "lng", "lat", "createdAt"],
          properties: {
            id: {
              type: "number",
            },
            name: {
              type: "string",
            },
            description: {
              type: "string",
              nullable: true,
            },
            lng: {
              type: "number",
            },
            lat: {
              type: "number",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        AddressResponse: {
          type: "object",
          required: ["item"],
          properties: {
            item: {
              $ref: "#/components/schemas/Address",
            },
          },
        },
        AddressesResponse: {
          type: "object",
          required: ["items"],
          properties: {
            items: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Address",
              },
            },
          },
        },
      },
    },
  },
  apis: [
    resolve(process.cwd(), "src/controllers/**/*.{ts,js}"),
    resolve(process.cwd(), "dist/controllers/**/*.js"),
  ],
};

export function buildOpenApiDocument() {
  return swaggerJsdoc(swaggerOptions);
}

export async function writeOpenApiJsonFile() {
  const filePath = resolve(process.cwd(), "openapi.json");
  const document = buildOpenApiDocument();
  const nextContent = `${JSON.stringify(document, null, 2)}\n`;

  try {
    const currentContent = await readFile(filePath, "utf8");
    if (currentContent === nextContent) {
      return filePath;
    }
  } catch (err) {
    // If the file does not exist yet, continue and create it.
  }

  await writeFile(filePath, nextContent, "utf8");
  return filePath;
}
