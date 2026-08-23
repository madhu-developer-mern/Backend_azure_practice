const { app } = require("@azure/functions");

// Sample electronics data
const electronics = [
  {
    productId: "ELEC001",
    productName: "Smart Temperature Monitor",
    category: "IoT Device",
    brand: "ThinxSense",
    price: 3200,
    stock: 25
  },
  {
    productId: "ELEC002",
    productName: "WiFi Smart Plug",
    category: "Smart Home",
    brand: "TechHome",
    price: 1200,
    stock: 40
  },
  {
    productId: "ELEC003",
    productName: "LoRaWAN Gateway",
    category: "Gateway",
    brand: "IoT Connect",
    price: 12500,
    stock: 6
  },
  {
    productId: "ELEC004",
    productName: "Industrial Data Logger",
    category: "Data Logger",
    brand: "SenseTrack",
    price: 6800,
    stock: 12
  },
  {
    productId: "ELEC005",
    productName: "BLE Beacon",
    category: "Bluetooth Device",
    brand: "BeaconPro",
    price: 950,
    stock: 50
  }
];

// GET API
app.http("getElectronics", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "electronics",

  handler: async (request, context) => {
    try {
      context.log("Get electronics API called");

      return {
        status: 200,
        jsonBody: {
          success: true,
          count: electronics.length,
          data: electronics
        }
      };

    } catch (error) {
      context.error("Error getting electronics", error);

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