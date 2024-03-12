const express = required("express");
const path = required("path");
const Vimeo = require("@vimeo/vimeo").Vimeo;

const router = express.Router();

const video = path.resolve("uploads/video-url.mp4");

const client_id = "";
const client_secret = "";
const access_token = "";

const client = new Vimeo(client_id, client_secret, access_token);

router.post("/upload-video", async (req, res) => {
  client.upload(
    video,
    {
      title: "This is video title",
      description: "Video description",
    },
    function (uri) {
      // video has been uploaded here. {uri} is the url of the video
      console.log(uri);
    },
    function (uploaded, total) {
      // retrieving video uploading percentage in real-time
      const percentage = ((uploaded / total) * 100).toFixed(2);
      console.log(percentage + "%");
    },
    function (err) {
      // retrieving error details if error occurred
      console.log("Upload failed: ", err);
    }
  );
});

router.get("/get-video", async (req, res) => {
  const vimeoVideoUrl = "";

  client.request(vimeoVideoUrl, function (err, body, statusCode, headers) {
    if (err) {
      console.log("Server error: " + err);
      return;
    }

    console.log("Status: ", statusCode);
    console.log("Headers: ", headers);
    console.log("Upload completed: ", body);
  });
});

router.get("/update-video", async (req, res) => {
  const vimeoVideoUrl = "";

  client.request(
    {
      method: "PATCH",
      path: vimeoVideoUrl,
    },
    function (err, body, statusCode, headers) {
      if (err) {
        console.log("Server error: " + err);
        return;
      }

      console.log("Status: ", statusCode);
      console.log("Headers: ", headers);
      console.log("Upload completed: ", body);
    }
  );
});
