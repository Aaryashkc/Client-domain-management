import ServiceProvider from '../models/addProvider.model.js';

export const createServiceProvider = async (req, res) => {
  try {
    const { providerName, providerEmail, providerPhone, providerAddress } = req.body;

    if (!providerName || !providerEmail || !providerPhone || !providerAddress) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const serviceProvider = new ServiceProvider({
      providerName,
      providerEmail,
      providerPhone,
      providerAddress,
    });

    const savedServiceProvider = await serviceProvider.save();
    res.status(201).json(savedServiceProvider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllServiceProviders = async (req, res) => {
  try {
    const serviceProviders = await ServiceProvider.find();
    res.status(200).json(serviceProviders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getServiceProvider = async (req, res) => {
  const { id } = req.params;
  try {
    const serviceProvider = await ServiceProvider.findById(id);
    if (!serviceProvider) {
      return res.status(404).json({ message: 'Service Provider not found' });
    }
    res.status(200).json(serviceProvider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
