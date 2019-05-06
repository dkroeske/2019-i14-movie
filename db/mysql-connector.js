const mysql = require("mysql");
const config = require("../config/config.json");
const logger = require("tracer").colorConsole();

// let db = mysql.createConnection( {
//     host: process.env.DB_HOSTNAME || 'localhost',
//     user: process.env.DB_USERNAME || config.dbUsername,
//     password: process.env.DB_USERNAME || config.dbPassword,
//     database: process.env.DB_USERNAME || config.dbSchema,
//     insecureAuth : true
// });

// db.connect( (error) => {
//     if(error) {
//         console.log(error);
//         return;
//     } else {
//         console.log("Connected to localhost: i14");
//     }
// });

// module.exports = db;

const reconnectTimeout = 2000; // ms.

const connectionSettings = {
  connectionLimit: 20,
  host: process.env.DB_HOST || config.remote.dbServer,
  user: process.env.DB_USER || config.remote.dbUsername,
  password: process.env.DB_PASSWORD || config.remote.dbPassword,
  database: process.env.DB_DATABASE || config.remote.dbSchema,
  port: 3306,
  debug: false
};

var pool;

// http://sudoall.com/node-js-handling-mysql-disconnects/
// function handleDisconnect() {
pool = mysql.createPool(connectionSettings);

pool.on("acquire", connection => {
  logger.trace("Connection %d acquired", connection.threadId);
});

pool.on("connection", connection => {
  logger.trace("Connection to database was made");
});

pool.on("enqueue", () => {
  logger.trace("Waiting for available connection slot");
});

pool.on("release", connection => {
  logger.trace("Connection %d released", connection.threadId);
});

module.exports = pool;
