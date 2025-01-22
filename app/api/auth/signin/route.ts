import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/user';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, walletAddress } = body;

    // Validate input
    if (!username || !walletAddress) {
      return NextResponse.json({ message: "Username and wallet address are required" }, { status: 400 });
    }

    // Connect to the database
    await connectToDatabase();

    // Find user by wallet address
    const user = await User.findOne({ walletAddress });
    if (!user || user.username !== username) {
      return NextResponse.json({ message: "Invalid username or wallet address" }, { status: 401 });
    }

    // Generate JWT token
    const token = sign({ walletAddress: user.walletAddress }, SECRET_KEY, { expiresIn: '7d' });

    // Respond with the token
    return NextResponse.json({ token }, { status: 200 });

  } catch (error) {
    console.error("Error during sign-in:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
