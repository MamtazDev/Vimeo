const express = require("express");
const path = require("path");
const Vimeo = require("@vimeo/vimeo").Vimeo;

const router = express.Router();

const video = path.resolve("uploads/video-url.mp4");

// const client_id = "";
// const client_secret = "";
// const access_token = "";

const client_id = "af29f9f33998daead6e58200d04fc041d4df660a";
const client_secret =
  "AOGknrEYTHWqZ/FzVqMYx+vz6jkWI6UPeGS/tatfcht7LwnjFA+7xb4VzDj09Qr4LBkvRFnuU4119lRKjv/vwcl0AhTrGDu9l4QOqGjGUlsvnnK0Zfz7ZnRiac48Rl93";
const access_token = "7266aef3c8f8afbd63feb75d52d353e7";

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

module.exports = router;
