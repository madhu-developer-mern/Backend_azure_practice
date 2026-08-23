const { app } = require("@azure/functions");
const { createRoom } = require("../data/rooms");

// HTTP Trigger API to create a new room
app.http("createRoom", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "rooms",

  handler: async (request, context) => {
    try {
      context.log("Create room API called");

      let body;

      try {
        body = await request.json();
      } catch {
        body = null;
      }

      if (!body) {
        return {
          status: 400,
          jsonBody: {
            success: false,
            message: "Required fields are missing"
          }
        };
      }

      const {
        roomName,
        facilityId,
        temperatureMin,
        temperatureMax
      } = body;

      if (
        roomName === undefined ||
        roomName === null ||
        roomName === "" ||
        facilityId === undefined ||
        facilityId === null ||
        facilityId === "" ||
        temperatureMin === undefined ||
        temperatureMin === null ||
        temperatureMax === undefined ||
        temperatureMax === null
      ) {
        return {
          status: 400,
          jsonBody: {
            success: false,
            message: "Required fields are missing"
          }
        };
      }

      const newRoom = createRoom({
        roomName,
        facilityId,
        temperatureMin,
        temperatureMax
      });

      return {
        status: 201,
        jsonBody: {
          success: true,
          message: "Room created successfully",
          data: newRoom
        }
      };
    } catch (error) {
      context.error("Error creating room", error);

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