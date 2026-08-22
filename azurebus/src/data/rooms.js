// In-memory data storage for Room Management API
const rooms = [
  {
    id: "ROOM001",
    roomName: "Cold Room A",
    facilityId: "F001",
    temperatureMin: 2,
    temperatureMax: 8
  },
  {
    id: "ROOM002",
    roomName: "Cold Room B",
    facilityId: "F001",
    temperatureMin: 3,
    temperatureMax: 7
  }
];

let nextRoomNumber = 3;

/**
 * Retrieve all rooms
 */
function getAllRooms() {
  return rooms;
}

/**
 * Find room by ID
 * @param {string} roomId 
 */
function getRoomById(roomId) {
  return rooms.find(room => room.id === roomId) || null;
}

/**
 * Create a new room with auto-generated ID (ROOM003, ROOM004...)
 * @param {Object} data 
 */
function createRoom(data) {
  const id = `ROOM${String(nextRoomNumber++).padStart(3, "0")}`;
  const newRoom = {
    id,
    roomName: data.roomName,
    facilityId: data.facilityId,
    temperatureMin: Number(data.temperatureMin),
    temperatureMax: Number(data.temperatureMax)
  };
  rooms.push(newRoom);
  return newRoom;
}

/**
 * Delete a room by ID
 * @param {string} roomId 
 */
function deleteRoom(roomId) {
  const index = rooms.findIndex(room => room.id === roomId);
  if (index !== -1) {
    rooms.splice(index, 1);
    return true;
  }
  return false;
}

module.exports = {
  rooms,
  getAllRooms,
  getRoomById,
  createRoom,
  deleteRoom
};
