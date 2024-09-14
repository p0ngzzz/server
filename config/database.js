const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
console.log("hello world")
const connectDB = async () => {
  try {
    // if node less than 18 or 19 can not use localhost use 127.0.0.1
    await mongoose.connect(process.env.DATABASE_URL, {
      //   useNewUrlParser: true, // Use new URL string parser instead of the deprecated one
      //   useUnifiedTopology: true, // Use the new server discovery and monitoring engine
      //   useCreateIndex: true, // Make Mongoose use `createIndex()` instead of `ensureIndex()` for indexes
      //   useFindAndModify: false, // Use native `findOneAndUpdate()` rather than `findAndModify()`
      //   autoIndex: false, // Disable auto-indexing in production for performance
      //   poolSize: 10, // Maintain up to 10 socket connections
      //   serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      //   socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      //   family: 4, // Use IPv4, skip trying IPv6
    }); 
    // const db = mongoose.connection.db;

    // // List all collections
    // const collections = await db.listCollections().toArray();
    // console.log('Collections:', collections.map(col => col.name));

    // use pure mongoDB command
    // const client = new MongoClient(process.env.DATABASE_URL, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });

    // await client.connect();
    // const admin = client.db().admin();
    // const { databases } = await admin.listDatabases();
    // console.log(databases)
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
