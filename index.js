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

const mongodbUri =
  "mongodb+srv://mamtazfreelancer:f7FcczeDomuZ5F3L@cluster0.6ds5s8q.mongodb.net/uploadproject";

mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to mongodb...");
});
mongoose.set("strictQuery", false);

mongoose.connection.on("error", (err) => {
  console.log("Error connecting to mongo", err);
});

app.listen(4000, () => {
  console.log("App is running on PORT 4000");
});
