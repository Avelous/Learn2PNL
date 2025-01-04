import axios from "axios";

export const getPreSignedUrl = async (
  filename: string,
  filetype: string,
  dir: string
) => {
  const response = await axios.post("/api/s3-upload", {
    filename,
    filetype,
    dirInBucket: dir,
  });
  return response.data;
};
