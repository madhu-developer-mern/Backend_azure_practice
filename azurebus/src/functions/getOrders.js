const { app } = require("@azure/functions");

// Sample orders data
const orders = [
  {
    orderId: "ORD001",
    customerName: "Madhu",
    productName: "Temperature Sensor",
    quantity: 2,
    totalAmount: 5000,
    status: "Delivered"
  },
  {
    orderId: "ORD002",
    customerName: "Rahul",
    productName: "BLE Gateway",
    quantity: 1,
    totalAmount: 5500,
    status: "Processing"
  },
  {
    orderId: "ORD003",
    customerName: "Kiran",
    productName: "Humidity Sensor",
    quantity: 3,
    totalAmount: 5400,
    status: "Shipped"
  },
  {
    orderId: "ORD004",
    customerName: "Arun",
    productName: "Cold Room Controller",
    quantity: 1,
    totalAmount: 8500,
    status: "Pending"
  }
];

// GET all orders
app.http("getOrders", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "orders",

  handler: async (request, context) => {
    try {
      context.log("Get orders API called");

      return {
        status: 200,
        jsonBody: {
          success: true,
          count: orders.length,
          data: orders
        }
      };

    } catch (error) {
      context.error("Error getting orders", error);

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