import { NextApiRequest, NextApiResponse } from "next";
import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
  region: "us-east-2",
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  signatureVersion: "s3v4",
  headers: {'Access-Control-Allow-Origin': '*'}, 
  apiVersion: "2006-03-01",
});

export default async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }
  
    try {
      const name = req.body.name;
      const type = req.body.type;
      console.log("name being passed:" + name+"hatethis");
      console.log("what da type: " + type+"hatethis");
      console.log("what da bucket name:" + process.env.BUCKET_NAME+"hatethis");
  
      const fileParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: name,
        Expires: 600,
        ContentType: type,
        ACL: "public-read"
      };
      
      console.log("trying to send data");
      const url = await s3.getSignedUrlPromise('putObject', fileParams);

  
      res.status(200).json({ url });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err });
    }
  };
  

export const config = {
    api: {
      bodyParser: {
        sizeLimit: "8mb", // Set desired value here
      },
    },
  };

