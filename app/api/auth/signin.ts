import { NextApiRequest, NextApiResponse } from "next";
import { sign } from "jsonwebtoken";
import { User } from "@/models/user";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "your-secret-key";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { walletAddress } = req.body;

      // Check if user exists
      const user = await User.findOne({ walletAddress });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate JWT token
      const token = sign(
        { walletAddress: user.walletAddress },
        SECRET_KEY,
        { expiresIn: "7d" }
      );

      return res.status(200).json({ token });
    } catch (error) {
      console.error("Error during sign-in:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
