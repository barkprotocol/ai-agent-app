import { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/lib/supabase";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Authenticate user with Supabase
    const { data: userData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    // Hash the password before storing it in Prisma (if needed)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user in Prisma (for example, creating a user record)
    const user = await prisma.user.upsert({
      where: { email },
      update: { updatedAt: new Date() },
      create: { email, password: hashedPassword },
    });

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error during authentication or database operation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
