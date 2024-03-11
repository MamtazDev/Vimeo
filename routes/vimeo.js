const express = require("express");
// const mediaController = require("../controllers/mediaController");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Vimeo = require('@vimeo/vimeo').Vimeo;
const mongoose = require('mongoose');


const router = express.Router();


const VideoModel = mongoose.model('Video', { url: String });


const  client_id = "536834dbe6f5fde38ca5e913f8fe1e9f26cd0952"
const client_secret = "glS5EFdHhmvXNFCvafQinITZ6vymrGA8oA0JKXnjW7uf0sQ2dKERG8R+6cnNcpqzeYttO/c5rbOiS0lDeK0LYUbNm2wHPVbTWREenLnJdPQ9KBnmpcLeO1BGKHE+hOjF"
const access_token = ""

// Set up Vimeo API client
const vimeoClient = new Vimeo(client_id, client_secret, access_token);



// Set up Multer for file upload
const upload = multer({ dest: 'uploads/' });


const params = {
  name: 'Vimeo API SDK test upload',
  description: "This video was uploaded through the Vimeo API's NodeJS SDK."
}


const videoStream = {
  byte: "size",
  title: "base 64",
  filePath: "../Models/Media.js"
}

// Upload video to Vimeo and save CDN URL to database
const uploadToVimeo = async (filePath) => {
    try {
        // Upload video to Vimeo
        const uploadResult = await vimeoClient.upload(
          filePath,
          params,
          function (uri) {
            // Get the metadata response from the upload and log out the Vimeo.com url
            client.request(uri + '?fields=link', function (error, body, statusCode, headers) {
              if (error) {
                console.log('There was an error making the request.')
                console.log('Server reported: ' + error) 
                return
              }
        
              console.log('"' + filePath + '" has been uploaded to ' + body.link)
        
              // Make an API call to edit the title and description of the video.
              client.request({
                method: 'PATCH',
                path: uri,
                params: {
                  name: 'Vimeo API SDK test edit',
                  description: "This video was edited through the Vimeo API's NodeJS SDK."
                }
              }, function (error, body, statusCode, headers) {
                if (error) {
                  console.log('There was an error making the request.')
                  console.log('Server reported: ' + error)
                  return
                }
        
                console.log('The title and description for ' + uri + ' has been edited.')
        
                // Make an API call to see if the video is finished transcoding.
                client.request(
                  uri + '?fields=transcode.status',
                  function (error, body, statusCode, headers) {
                    if (error) {
                      console.log('There was an error making the request.')
                      console.log('Server reported: ' + error)
                      return
                    }
        
                    console.log('The transcode status for ' + uri + ' is: ' + body.transcode.status)
                  }
                )
              })
            })
          },
          function (bytesUploaded, bytesTotal) {
            const percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
            console.log(bytesUploaded, bytesTotal, percentage + '%')
          },
          function (error) {
            console.log('Failed because: ' + error)
          }
        )
        ;

        // Get CDN URL from upload result
        // console.log("uploadResult:")
        const cdnUrl = uploadResult.upload[0].link;

        // Save CDN URL to database
        const video = new VideoModel({ url: cdnUrl });
        await video.save();

        return cdnUrl;
    } catch (error) {
        console.error('Error uploading video:', error);
        throw error;
    }
};

router.post('/upload', upload.single('video'), async (req, res) => {
  try {
      const filePath = req.file.path;
      console.log("filePath:", filePath)
      const cdnUrl = await uploadToVimeo(filePath);
      res.send(`Video uploaded to Vimeo and CDN URL saved: ${cdnUrl}`);
  } catch (error) {
      res.status(500).send('Error uploading video to Vimeo');
  }
});

module.exports = router;
