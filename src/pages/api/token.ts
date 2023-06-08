import { NextApiRequest, NextApiResponse } from "next";
import { StreamChat } from "stream-chat";
import { env } from "~/env.mjs";

const setChatStreamToken = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.body) {
    try {
      const api_key = env.NEXT_PUBLIC_STREAM_KEY;
      const api_secret = env.NEXT_PUBLIC_STREAM_SECRET;
      const userId = req.body;
      let chatToken: string = "";

      // Initialize a Server Client
      const serverClient = StreamChat.getInstance(api_key, api_secret);
      // Create User Token
      chatToken = serverClient.createToken(userId ?? "unknown");
      res.status(200).json({ chatToken });
      return chatToken;
    } catch (err) {
      res.status(400).json({ message: JSON.stringify(err) });
      return "unauthenticated";
    }
  }
  return "";
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let token = "";
  if (req.method === "POST") {
    token = await setChatStreamToken(req, res);
    console.log("RETURNING TOKEN", token);
  }
}
