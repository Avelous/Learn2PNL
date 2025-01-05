import Mux from "@mux/mux-node";

export const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
  jwtSigningKey: process.env.MUX_SIGNING_KEY,
  jwtPrivateKey: process.env.MUX_PRIVATE_KEY,
});

export const generatePlaybackToken = async (playbackId: string) => {
  const playbackToken = await mux.jwt.signPlaybackId(playbackId, {
    type: "video",
    keyId: process.env.MUX_SIGNING_KEY,
    keySecret: process.env.MUX_PRIVATE_KEY,
  });
  return playbackToken;
};
