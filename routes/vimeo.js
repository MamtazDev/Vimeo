const express = require("express");
// const mediaController = require("../controllers/mediaController");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Vimeo = require('@vimeo/vimeo').Vimeo;
const mongoose = require('mongoose');


const router = express.Router();


const VideoModel = mongoose.model('Video', { url: String });


const  client_id = "af29f9f33998daead6e58200d04fc041d4df660a"
const client_secret = "AOGknrEYTHWqZ/FzVqMYx+vz6jkWI6UPeGS/tatfcht7LwnjFA+7xb4VzDj09Qr4LBkvRFnuU4119lRKjv/vwcl0AhTrGDu9l4QOqGjGUlsvnnK0Zfz7ZnRiac48Rl93"
const access_token = "7266aef3c8f8afbd63feb75d52d353e7"

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
            vimeoClient.request(uri + '?fields=link', function (error, body, statusCode, headers) {
              if (error) {
                console.log('There was an error making the request.')
                console.log('Server reported: ' + error) 
                return
              }
        
              console.log('"' + filePath + '" has been uploaded to ' + body.link)
        
              // Make an API call to edit the title and description of the video.
              vimeoClient.request({
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
                vimeoClient.request(
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