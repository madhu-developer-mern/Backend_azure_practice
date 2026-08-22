const assert = require("assert");
const { getAllRooms, getRoomById, createRoom, deleteRoom } = require("./src/data/rooms");

console.log("Starting Room API Data & Business Logic Tests...\n");

// 1. Get All Initial Rooms
const initialRooms = getAllRooms();
console.log("1. Testing GET All Rooms...");
assert.strictEqual(initialRooms.length, 2, "Initial rooms count should be 2");
assert.strictEqual(initialRooms[0].id, "ROOM001");
assert.strictEqual(initialRooms[1].id, "ROOM002");
console.log("   ✓ GET All Rooms passed!");

// 2. Get Single Room by ID
console.log("2. Testing GET Room by ID...");
const room1 = getRoomById("ROOM001");
assert.notStrictEqual(room1, null, "ROOM001 should exist");
assert.strictEqual(room1.roomName, "Cold Room A");

const roomMissing = getRoomById("ROOM999");
assert.strictEqual(roomMissing, null, "ROOM999 should return null");
console.log("   ✓ GET Room by ID passed!");

// 3. Create Room
console.log("3. Testing POST Create Room...");
const newRoomData = {
  roomName: "Cold Room C",
  facilityId: "F002",
  temperatureMin: 2,
  temperatureMax: 6
};
const createdRoom = createRoom(newRoomData);
assert.strictEqual(createdRoom.id, "ROOM003", "Generated ID should be ROOM003");
assert.strictEqual(createdRoom.roomName, "Cold Room C");
assert.strictEqual(getAllRooms().length, 3, "Rooms count should be 3 after creation");
console.log("   ✓ POST Create Room passed!");

// 4. Delete Room
console.log("4. Testing DELETE Room...");
const deleteSuccess = deleteRoom("ROOM001");
assert.strictEqual(deleteSuccess, true, "ROOM001 deletion should return true");
assert.strictEqual(getRoomById("ROOM001"), null, "ROOM001 should no longer exist");
assert.strictEqual(getAllRooms().length, 2, "Rooms count should be 2 after deletion");

const deleteFailure = deleteRoom("ROOM001");
assert.strictEqual(deleteFailure, false, "Deleting already deleted room should return false");
console.log("   ✓ DELETE Room passed!");

console.log("\nAll data & business logic tests passed successfully!");
