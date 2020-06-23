//
// Main entrypoint for the backend server
//
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: 'variables.env' });

// Connect to our DB using prisma-binding to our Prisma DB
const db = require('./db');

// Create the yoga (express) server
const createServer = require('./createServer'); // graphql-yoga
const server = createServer();

// Use express middlware to handle cookies (JWT)
server.express.use(cookieParser());

// If the request has a JWT token, then verify token and add the
// userId to our req object
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    // Get the userId from the JWT if the token is verified
    const { userId } = jwt.verify(token, process.env.APP_SECRET);

    // Add any valid userId onto our req object
    req.userId = userId;

    console.log(`=== Current User: ${userId}`);
  }
  next();
});

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
