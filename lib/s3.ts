export const getPreSignedUrl = async (
  filename: string,
  filetype: string,
  dir: string
) => {
  const response = await fetch("/api/s3-upload", {
    method: "POST",
    body: JSON.stringify({
      filename,
      filetype,
      dirInBucket: dir,
    }),
  });
  return response.json();
};
