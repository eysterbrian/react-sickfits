//
// Main entrypoint for the backend server
//
const cookieParser = require('cookie-parser');

require('dotenv').config({ path: 'variables.env' });

// Connect to our DB using prisma-binding to our Prisma DB
const db = require('./db');

// Create the yoga (express) server
const createServer = require('./createServer'); // graphql-yoga
const server = createServer();

// Use express middlware to handle cookies (JWT)
server.express.use(cookieParser());

// TODO: Use express middleware to populate current user

const yogaOptions = {
  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL, // only allow API access from our frontend URL
  },
};

server.start(
  yogaOptions,

  // CB called right before the server starts
  ({ port }) => {
    console.log(`Server is now running at: http://localhost:${port}`);
  }
);
