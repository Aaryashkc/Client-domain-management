import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
}, { timestamps: true });

const Email = mongoose.model('Email', emailSchema);

export default Email;
