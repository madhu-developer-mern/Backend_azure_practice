const { app } = require("@azure/functions");

const customers = [
  {
    customerId: "CUS001",
    customerName: "Rahul",
    city: "Bangalore",
    status: "ACTIVE"
  },
  {
    customerId: "CUS002",
    customerName: "Kiran",
    city: "Mysore",
    status: "ACTIVE"
  },
  {
    customerId: "CUS003",
    customerName: "Arun",
    city: "Chennai",
    status: "INACTIVE"
  }
];

app.http("getCustomers", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "customers",

  handler: async (request, context) => {
    try {
      context.log("Get customers API called");

      return {
        status: 200,
        jsonBody: {
          success: true,
          count: customers.length,
          data: customers
        }
      };
    } catch (error) {
      context.error("Error getting customers", error);

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