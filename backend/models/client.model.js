import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({

  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  clientName: {
    type: String,
    required: true,
    trim: true,
  },
  clientEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
   clientPhone:{
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value) => /^\+?\d{1,15}$/.test(value),
      message: 'Phone number is invalid',
    },
  },
    address: {
      type: String,
      required: true,
      trim: true,
    },
  clientType: {
    type: String,
    required: true,
    enum: ["external", "internal"],
  },
  clientStatus: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);

export default Client;
