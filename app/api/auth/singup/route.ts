import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/user';
import { z } from 'zod';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

// Define the expected request body schema using Zod for input validation
const signupSchema = z.object({
  username: z.string().min(1, "Username is required"),
  walletAddress: z.string().min(1, "Wallet address is required"),
});

export async function POST(req: NextRequest) {
  try {
    // Parse and validate incoming data
    const body = await req.json();
    const validatedData = signupSchema.parse(body);

    // Connect to the database (MongoDB example)
    await connectToDatabase();

    const { username, walletAddress } = validatedData;

    // Check if user already exists based on wallet address
    const existingUser = await User.findOne({ walletAddress });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // Create new user and save to the database
    const newUser = new User({
      username,
      walletAddress,
    });
    await newUser.save();

    // Create a JWT token for the user
    const token = sign(
      { walletAddress: newUser.walletAddress },
      SECRET_KEY,
      { expiresIn: '7d' }
    );

    // Send the response with the JWT token
    return NextResponse.json({ token }, { status: 201 }); // Return 201 for successful user creation

  } catch (error) {
    console.error('Error during sign-up:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid data", details: error.errors }, { status: 400 });
    }

    // Handle other errors (e.g., database issues)
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
  }
}
