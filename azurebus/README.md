# Room Management Backend API (Azure Functions v4 Node.js)

A lightweight **Room Management Backend API** built using **Node.js 20** and the modern **Azure Functions v4 Programming Model** (`@azure/functions`).

This repository demonstrates how to build RESTful HTTP Trigger APIs without Express.js, using in-memory state for local testing and learning ahead of deploying via **Azure DevOps CI/CD**.

---

## 🏗️ System Architecture & Request Execution Flow

When an HTTP request is made to the Azure Function app, it follows this lifecycle:

```text
Postman / Client / cURL
         ↓
HTTP Request (e.g. GET /api/rooms)
         ↓
Azure Functions Host Runtime (Default Port: 7071)
         ↓
HTTP Trigger Router (Matches route & method registered via app.http)
         ↓
JavaScript Handler Execution (handler: async (request, context) => ...)
         ↓
Business Logic / In-Memory Data Store (src/data/rooms.js)
         ↓
HTTP Response Object ({ status: 200, jsonBody: { ... } })
         ↓
Postman / Client
```

---

## 📁 Project Folder Structure

```text
azure-room-api/
│
├── src/
│   ├── functions/
│   │   ├── getRooms.js       # GET /api/rooms (Get all rooms)
│   │   ├── getRoomById.js    # GET /api/rooms/{roomId} (Get single room)
│   │   ├── createRoom.js     # POST /api/rooms (Create room)
│   │   └── deleteRoom.js     # DELETE /api/rooms/{roomId} (Delete room)
│   │
│   └── data/
│       └── rooms.js          # In-memory room data store & helper functions
│
├── host.json                 # Azure Functions global settings & extension bundles
├── package.json              # Dependencies, scripts, and Node.js version target
├── test.js                   # Automated unit test suite for business logic
├── .funcignore               # Excludes test & dev files when deploying to Azure
├── .gitignore                # Git ignore configuration
└── README.md                 # Complete documentation & API guide
```

---

## 💡 Key Azure Functions Concepts Explained

### 1. Function Registration (`app.http`)
The modern v4 model uses `app.http(name, options)` to register HTTP endpoints cleanly inside JavaScript files without needing legacy `function.json` files.

Example (`src/functions/getRooms.js`):
```javascript
const { app } = require("@azure/functions");

app.http("getRooms", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "rooms",
  handler: async (request, context) => { ... }
});
```
- **`methods`**: Defines supported HTTP verbs (`["GET"]`, `["POST"]`, `["DELETE"]`).
- **`authLevel`**: `"anonymous"` allows public access without a key (ideal for local practice).
- **`route`**: Overrides default routing. Endpoint will be available at `/api/rooms`.

### 2. Request Object (`request`)
- **Route Parameters**: Parameters defined in route string like `"rooms/{roomId}"` are accessed via `request.params.roomId`.
- **JSON Request Body**: Parsed asynchronously using `await request.json()`.

### 3. Context Object (`context`)
- **`context.log(...)`**: Outputs informational logs to console during local development or **Azure Application Insights** in production.
- **`context.error(...)`**: Logs error tracebacks for diagnostics.

### 4. Returning HTTP Responses
Return an object containing:
- `status`: HTTP status code integer (e.g. `200`, `201`, `400`, `404`, `500`).
- `jsonBody`: Object automatically formatted and serialized to JSON.

---

## 🚦 HTTP Status Codes & Usage Rationale

| Status Code | Name | Usage in This API |
| :--- | :--- | :--- |
| **`200 OK`** | Request Succeeded | Returned by `GET /api/rooms`, `GET /api/rooms/{roomId}` (when found), and `DELETE /api/rooms/{roomId}` (when deleted). |
| **`201 Created`** | Resource Created | Returned by `POST /api/rooms` when a room is validated and created with a generated ID. |
| **`400 Bad Request`** | Client Side Error | Returned by `POST /api/rooms` if required fields (`roomName`, `facilityId`, `temperatureMin`, `temperatureMax`) are missing. |
| **`404 Not Found`** | Resource Not Found | Returned by `GET /api/rooms/{roomId}` or `DELETE /api/rooms/{roomId}` when the requested `roomId` does not exist. |
| **`500 Internal Error`**| Server Side Error | Returned inside `catch(error)` blocks when an unhandled server error occurs. |

---

## ⚙️ Local Development Setup

### Prerequisites
1. **Node.js 20** or higher (`node -v`)
2. **Azure Functions Core Tools v4** (`func --version`)

### Steps to Run Locally

1. **Clone or navigate to the directory**:
   ```bash
   cd azure-room-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run unit tests**:
   ```bash
   npm test
   ```

4. **Start local Azure Functions host**:
   ```bash
   npm start
   # or directly: func start
   ```

The output will list the active local endpoints:
```text
Functions:
    createRoom: [POST] http://localhost:7071/api/rooms
    deleteRoom: [DELETE] http://localhost:7071/api/rooms/{roomId}
    getRoomById: [GET] http://localhost:7071/api/rooms/{roomId}
    getRooms: [GET] http://localhost:7071/api/rooms
```

---

## 🧪 API Testing Guide (Postman & cURL)

### 1. Get All Rooms
- **Method**: `GET`
- **URL**: `http://localhost:7071/api/rooms`
- **Expected Status**: `200 OK`
- **Response**:
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "id": "ROOM001",
        "roomName": "Cold Room A",
        "facilityId": "F001",
        "temperatureMin": 2,
        "temperatureMax": 8
      },
      {
        "id": "ROOM002",
        "roomName": "Cold Room B",
        "facilityId": "F001",
        "temperatureMin": 3,
        "temperatureMax": 7
      }
    ]
  }
  ```
- **cURL Command**:
  ```bash
  curl -X GET http://localhost:7071/api/rooms
  ```

---

### 2. Get Single Room
- **Method**: `GET`
- **URL**: `http://localhost:7071/api/rooms/ROOM001`
- **Expected Status**: `200 OK`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "ROOM001",
      "roomName": "Cold Room A",
      "facilityId": "F001",
      "temperatureMin": 2,
      "temperatureMax": 8
    }
  }
  ```
- **Non-existent Room Test**:
  - **URL**: `http://localhost:7071/api/rooms/ROOM999`
  - **Expected Status**: `404 Not Found`
  - **Response**:
    ```json
    {
      "success": false,
      "message": "Room not found"
    }
    ```
- **cURL Command**:
  ```bash
  curl -X GET http://localhost:7071/api/rooms/ROOM001
  ```

---

### 3. Create Room
- **Method**: `POST`
- **URL**: `http://localhost:7071/api/rooms`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "roomName": "Cold Room C",
    "facilityId": "F002",
    "temperatureMin": 2,
    "temperatureMax": 6
  }
  ```
- **Expected Status**: `201 Created`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Room created successfully",
    "data": {
      "id": "ROOM003",
      "roomName": "Cold Room C",
      "facilityId": "F002",
      "temperatureMin": 2,
      "temperatureMax": 6
    }
  }
  ```
- **Missing Fields Test**:
  - Send `{ "roomName": "Incomplete Room" }`
  - **Expected Status**: `400 Bad Request`
  - **Response**:
    ```json
    {
      "success": false,
      "message": "Required fields are missing"
    }
    ```
- **cURL Command**:
  ```bash
  curl -X POST http://localhost:7071/api/rooms \
    -H "Content-Type: application/json" \
    -d "{\"roomName\": \"Cold Room C\", \"facilityId\": \"F002\", \"temperatureMin\": 2, \"temperatureMax\": 6}"
  ```

---

### 4. Delete Room
- **Method**: `DELETE`
- **URL**: `http://localhost:7071/api/rooms/ROOM001`
- **Expected Status**: `200 OK`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Room deleted successfully"
  }
  ```
- **Delete Non-existent Room Test**:
  - Send `DELETE http://localhost:7071/api/rooms/ROOM999`
  - **Expected Status**: `404 Not Found`
  - **Response**:
    ```json
    {
      "success": false,
      "message": "Room not found"
    }
    ```
- **cURL Command**:
  ```bash
  curl -X DELETE http://localhost:7071/api/rooms/ROOM001
  ```

---

## 🚀 Azure DevOps Deployment Readiness

This codebase is structured specifically to integrate seamlessly into **Azure DevOps Pipelines**:

1. **`package.json` configuration**: Declares Node 20 target and startup commands.
2. **Deployment filter (`.funcignore`)**: Ensures heavy development artifacts (`node_modules`, test scripts) are not uploaded directly; Azure DevOps will run `npm install --production` during deployment build.
3. **Application Insights Integration**: Logs produced via `context.log` and `context.error` are automatically ingested by Azure Application Insights when deployed to an Azure Function App resource.

### Roadmap for CI/CD:
```text
1. Local Testing (Completed)
      ↓
2. Commit & Push Code to Git Repository
      ↓
3. Provision Azure Function App Resource in Azure Portal
      ↓
4. Create Azure DevOps Pipeline (yaml) with Build & Deploy tasks
      ↓
5. Deploy to Azure & Test Production URLs & App Insights Logs
```
