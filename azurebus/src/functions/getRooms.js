const { app } = require("@azure/functions");
const { getAllRooms } = require("../data/rooms");

// HTTP Trigger API to retrieve all rooms
app.http("getRooms", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "rooms",
  handler: async (request, context) => {
    try {
      context.log("Get rooms API called");

      const rooms = getAllRooms();

      return {
        status: 200,
        jsonBody: {
          success: true,
          count: rooms.length,
          data: rooms
        }
      };
    } catch (error) {
      context.error("Error fetching rooms", error);
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
