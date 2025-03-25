import mongoose from 'mongoose';

const serviceProviderSchema = new mongoose.Schema({
  providerName: {
    type: String,
    required: true,
    trim: true,
  },
  providerEmail: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  providerPhone: {
    type: String,
    required: true,
    trim: true,
  },
  providerAddress: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: Boolean,
    default: true, 
  },
}, { timestamps: true }); 

const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);

export default ServiceProvider;
