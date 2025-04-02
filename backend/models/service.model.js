import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  serviceProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  duration: {
    type: String,
    required: true,
    enum: ["1 month", "3 months", "6 months", "1 year", "2 years", "5 years"],
  },
  endDate: {
    type: Date,
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['domain only', 'hosting only', 'domain + hosting'],
  },
  serviceName: {
    type: String,
    required: true,
  },
  emails: [{ type: mongoose.Schema.Types.ObjectId, 
    ref: 'Email' }],

    domainCostPerYear: { 
      type: Number, 
      required: function() { 
        return this.serviceType === 'domain only' || this.serviceType === 'domain + hosting'; 
      } 
    },
    hostingCostPerGB: { 
      type: Number, 
      required: function() { 
        return this.serviceType === 'hosting only' || this.serviceType === 'domain + hosting'; 
      } 
    }
    
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
