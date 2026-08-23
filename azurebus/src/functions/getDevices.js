const { app } = require("@azure/functions");

// Sample device data
const devices = [
  {
    deviceId: "DEV001",
    deviceName: "Temperature Sensor 01",
    deviceType: "Temperature Sensor",
    status: "ONLINE",
    battery: 92,
    location: "Cold Room A"
  },
  {
    deviceId: "DEV002",
    deviceName: "Humidity Sensor 01",
    deviceType: "Humidity Sensor",
    status: "ONLINE",
    battery: 78,
    location: "Cold Room A"
  },
  {
    deviceId: "DEV003",
    deviceName: "BLE Gateway 01",
    deviceType: "Gateway",
    status: "ONLINE",
    battery: 100,
    location: "Warehouse 1"
  },
  {
    deviceId: "DEV004",
    deviceName: "Temperature Sensor 02",
    deviceType: "Temperature Sensor",
    status: "OFFLINE",
    battery: 12,
    location: "Cold Room B"
  },
  {
    deviceId: "DEV005",
    deviceName: "Cold Room Controller 01",
    deviceType: "Controller",
    status: "ONLINE",
    battery: 85,
    location: "Cold Room C"
  }
];

// GET all devices
app.http("getDevices", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "devices",

  handler: async (request, context) => {
    try {
      context.log("Get devices API called");

      return {
        status: 200,
        jsonBody: {
          success: true,
          count: devices.length,
          data: devices
        }
      };
    } catch (error) {
      context.error("Error getting devices", error);

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