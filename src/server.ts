import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the responsebusy 
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  app.get("/filteredimage", async (req, res) => {

    try
    {
      const { image_url: imageUrl } = req.query;

      //1.Validate Image_url 
      if (!imageUrl)
      {
        res.status(400)        
        .send("Please specified image url after the main url. (filteredimage?image_url=YOUR_IMAGE_URL)");
      }
      else
      {
        //2.Call filterImageFromURL(image_url) to Filter the Image
        const ImagePath = await filterImageFromURL(imageUrl);

        //3.Send the resulting file in the response
        res.status(200).sendFile(ImagePath);

        //4.deletes any files on the server on finish of the responsebusy 
        res.on("finish", () => deleteLocalFiles([ImagePath]));

      }
    }
    catch(err)
    {
      res.status(422).send
      (
         "Error:" + err
      );
    }   

  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();