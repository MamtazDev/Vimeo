const express = require("express");
const multer = require("multer");
const path = require("path");
const Vimeo = require("@vimeo/vimeo").Vimeo;
const mongoose = require("mongoose");

const router = express.Router();

const VideoModel = mongoose.model("Video", { url: String });

const client_id = "69a7580463a9916cc6bae5e7fb13a6d37eaf26d3";
const client_secret =
  "SQuoTeCFgVkR6n0W+HAU2p3JRLUB9IgQELUyYBAVVc5BACQ3kqlBg9Bx/9fACB8hqlWyC6hJJuCV2yZbQAdSe3KrAt52HZ0wwOSQKTQlyNCNyEWFvMciIwLYwG3cHcG9";
const access_token = "793682dec78bad8b24b0fb404d6f871c";

// Set up Vimeo API client
const client = new Vimeo(client_id, client_secret, access_token);

// Set up Multer for file upload
const upload = multer({ dest: "uploads/" });

const params = {
  name: "Vimeo API SDK test upload",
  description: "This video was uploaded through the Vimeo API's NodeJS SDK.",
};

const videoStream = {
  byte: "size",
  title: "base 64",
  filePath: "../Models/Media.js",
};

// Upload video to Vimeo and save CDN URL to database
const uploadToVimeo = async (filePath) => {
  try {
    // Upload video to Vimeo
    const uploadResult = await client.upload(
      filePath,
      params,
      function (uri) {
        // Get the metadata response from the upload and log out the Vimeo.com url
        client.request(
          uri + "?fields=link",
          function (error, body, statusCode, headers) {
            if (error) {
              console.log("There was an error making the request.");
              console.log("Server reported: " + error);
              return;
            }

            console.log('"' + filePath + '" has been uploaded to ' + body.link);

            // Make an API call to edit the title and description of the video.
            client.request(
              {
                method: "PATCH",
                path: uri,
                params: {
                  name: "Vimeo API SDK test edit",
                  description:
                    "This video was edited through the Vimeo API's NodeJS SDK.",
                },
              },
              function (error, body, statusCode, headers) {
                if (error) {
                  console.log("There was an error making the request.");
                  console.log("Server reported: " + error);
                  return;
                }

                console.log(
                  "The title and description for " + uri + " has been edited."
                );

                // Make an API call to see if the video is finished transcoding.
                client.request(
                  uri + "?fields=transcode.status",
                  function (error, body, statusCode, headers) {
                    if (error) {
                      console.log("There was an error making the request.");
                      console.log("Server reported: " + error);
                      return;
                    }

                    console.log(
                      "The transcode status for " +
                        uri +
                        " is: " +
                        body.transcode.status
                    );
                  }
                );
              }
            );
          }
        );
      },
      function (bytesUploaded, bytesTotal) {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        console.log(bytesUploaded, bytesTotal, percentage + "%");
      },
      function (error) {
        console.log("Failed because: " + error);
      }
    );
    // // Get CDN URL from upload result
    // console.log("uploadResult:", uploadResult);
    // const cdnUrl = uploadResult.upload.link;

    // // Save CDN URL to database
    // const video = new VideoModel({ url: cdnUrl });
    // await video.save();

    // return cdnUrl;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
};

router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const cdnUrl = await uploadToVimeo(filePath);
    res.send(`Video uploaded to Vimeo and CDN URL saved: ${cdnUrl}`);
  } catch (error) {
    res.status(500).send("Error uploading video to Vimeo");
  }
});

module.exports = router;
