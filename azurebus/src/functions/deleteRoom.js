const { app } = require("@azure/functions");
const { deleteRoom } = require("../data/rooms");

// HTTP Trigger API to delete a room by ID
app.http("deleteRoom", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "rooms/{roomId}",
  handler: async (request, context) => {
    try {
      const roomId = request.params.roomId;
      context.log(`Delete room API called for roomId: ${roomId}`);

      const success = deleteRoom(roomId);

      if (!success) {
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
          message: "Room deleted successfully"
        }
      };
    } catch (error) {
      context.error("Error deleting room", error);
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
