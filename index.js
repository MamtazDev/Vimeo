const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());

const mediaRoutes = require("./routes/media");
const vimeoRoutes = require("./routes/vimeo");
const vimeoV2Routes = require("./routes/newVimeo");

app.use("/api/v1/media", mediaRoutes);

app.use("/api/v1/vimeo", vimeoRoutes);
app.use("/api/v2/vimeo", vimeoV2Routes);
app.use("/public", express.static(path.join(__dirname, "public")));


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
mongoose.set("strictQuery", false);

app.listen(4000, () => {
  console.log("App is running on PORT 4000");
});






// const  client_id = "af29f9f33998daead6e58200d04fc041d4df660a"
// const client_secret = "AOGknrEYTHWqZ/FzVqMYx+vz6jkWI6UPeGS/tatfcht7LwnjFA+7xb4VzDj09Qr4LBkvRFnuU4119lRKjv/vwcl0AhTrGDu9l4QOqGjGUlsvnnK0Zfz7ZnRiac48Rl93"
// const access_token = "7266aef3c8f8afbd63feb75d52d353e7"