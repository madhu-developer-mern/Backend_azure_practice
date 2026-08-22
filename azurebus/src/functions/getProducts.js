const { app } = require("@azure/functions");

// Sample product data
const products = [
  {
    productId: "PROD001",
    productName: "Temperature Sensor",
    category: "Sensor",
    price: 2500,
    stock: 20
  },
  {
    productId: "PROD002",
    productName: "Humidity Sensor",
    category: "Sensor",
    price: 1800,
    stock: 15
  },
  {
    productId: "PROD003",
    productName: "BLE Gateway",
    category: "Gateway",
    price: 5500,
    stock: 8
  },
  {
    productId: "PROD004",
    productName: "Cold Room Controller",
    category: "Controller",
    price: 8500,
    stock: 5
  }
];

// HTTP Trigger API to get all products
app.http("getProducts", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "products",

  handler: async (request, context) => {
    try {
      context.log("Get products API called");

      return {
        status: 200,
        jsonBody: {
          success: true,
          count: products.length,
          data: products
        }
      };

    } catch (error) {
      context.error("Error getting products", error);

      return {
        status: 500,
        jsonBody: {
          success: false,
          message: "Internal server error"
        }
      };
    }
  }
});