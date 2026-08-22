const { app } = require("@azure/functions");
const { getRoomById } = require("../data/rooms");

// HTTP Trigger API to retrieve a single room by ID
app.http("getRoomById", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "rooms/{roomId}",
  handler: async (request, context) => {
    try {
      const roomId = request.params.roomId;
      context.log(`Get room by ID API called for roomId: ${roomId}`);

      const room = getRoomById(roomId);

      if (!room) {
        return {
          status: 404,
          jsonBody: {
            success: false,
            message: "Room not found"
          }
        };
      }

      return {
        status: 200,
        jsonBody: {
          success: true,
          data: room
        }
      };
    } catch (error) {
      context.error("Error fetching room by ID", error);
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
