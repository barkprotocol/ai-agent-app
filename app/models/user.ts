import mongoose, { Document, Schema } from 'mongoose';

// Define an interface for the User document
export interface IUser extends Document {
  username: string;
  walletAddress: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema for the User model
const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true, // Ensure username is unique
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true, // Ensure wallet address is unique
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Create and export the User model
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
