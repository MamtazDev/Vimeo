const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());

const mediaRoutes = require("./routes/media");
const vimeoRoutes = require("./routes/vimeo");

app.use("/api/v1/media", mediaRoutes); 

app.use("/api/v1/vimeo", vimeoRoutes); 

app.use("/public", express.static(path.join(__dirname, "public")));

const mongodbUri = `mongodb+srv://nahidMurad:nahidMurad123@custer1.q65c1qw.mongodb.net/vimeo`;
// const mongodbUri = "mongodb+srv://mamtazfreelancer:f7FcczeDomuZ5F3L@cluster0.6ds5s8q.mongodb.net/uploadproject";

// const mongodbUri = "mongodb+srv://mamtazfreelancer:ABgQGVk1XAHPkIbG@custer1.q65c1qw.mongodb.net/?retryWrites=true&w=majority&appName=soCreative";
mongoose.set("strictQuery", false);

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mamtazfreelancer:ABgQGVk1XAHPkIbG@custer1.q65c1qw.mongodb.net/?retryWrites=true&w=majority&appName=vimeo";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


// mongoose.connect(mongodbUri, () => {
//   console.log("Connected to MongoDB");
// });

// // mongoose.connect(mongodbUri, {
// //   useNewUrlParser: true,
// // });

// mongoose.connection.on("connected", () => {
//   console.log("Connected to mongodb...");
// });
// // mongoose.set('strictQuery', false);

// mongoose.connection.on("error", (err) => {
//   console.log("Error connecting to mongo", err);
// });

app.listen(4000, () => {
  console.log("App is running on PORT 4000");
});






// const  client_id = "af29f9f33998daead6e58200d04fc041d4df660a"
// const client_secret = "AOGknrEYTHWqZ/FzVqMYx+vz6jkWI6UPeGS/tatfcht7LwnjFA+7xb4VzDj09Qr4LBkvRFnuU4119lRKjv/vwcl0AhTrGDu9l4QOqGjGUlsvnnK0Zfz7ZnRiac48Rl93"
// const access_token = "7266aef3c8f8afbd63feb75d52d353e7"