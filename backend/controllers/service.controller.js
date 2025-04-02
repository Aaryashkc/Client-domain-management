import Service from '../models/service.model.js';

export const createService = async (req, res) => {
  try {
    const { clientId, serviceProviderId, startDate, duration, serviceType, serviceName, emails, domainCostPerYear, hostingCostPerGB } = req.body;

    if (!clientId || !serviceProviderId || !startDate || !duration || !serviceType || !serviceName || !emails) {
      return res.status(400).send({ message: "All fields are required" });
    }

    if (serviceType === 'domain only' && !domainCostPerYear) {
      return res.status(400).send({ message: "Domain cost per year is required for 'domain only' service type" });
    }
    
    if (serviceType === 'hosting only' && !hostingCostPerGB) {
      return res.status(400).send({ message: "Hosting cost per GB is required for 'hosting only' service type" });
    }
    
    if (serviceType === 'domain + hosting' && (!domainCostPerYear || !hostingCostPerGB)) {
      return res.status(400).send({ message: "Both domain cost per year and hosting cost per GB are required for 'domain + hosting' service type" });
    }

    const service = new Service({
      clientId,
      serviceProviderId, 
      startDate,
      duration,
      serviceType,
      serviceName,
      domainCostPerYear: serviceType === 'domain only' || serviceType === 'domain + hosting' ? domainCostPerYear : undefined,
      hostingCostPerGB: serviceType === 'hosting only' || serviceType === 'domain + hosting' ? hostingCostPerGB : undefined,
      endDate: calculateEndDate(startDate, duration), 
      emails,
    });

    const data = await service.save();
    res.status(201).send(data); 
  } catch (err) {
    console.error("Error creating service:", err);
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Service."
    });
  }
};

export const getServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate('clientId', 'companyName')  
      .populate('serviceProviderId', 'providerName'); 
    res.send(services);  
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving services."
    });
  }
};

export const getService = async (req, res) => {
  const id = req.params.id;
  try {
    const service = await Service.findById(id)
      .populate('clientId', 'companyName') 
      .populate('serviceProviderId', 'providerName');  
    if (!service) {
      return res.status(404).send({ message: "Service not found" });
    }
    res.send(service); 
  } catch (err) {
    res.status(500).send({
      message: err.message || `Error retrieving service with id=${id}`
    });
  }
};

export const updateServiceEmails = async (req, res) => {
  const serviceId = req.params.id;
  const { emails } = req.body;

  try {
    // Validate input
    if (!Array.isArray(emails)) {
      return res.status(400).send({ message: "Emails must be an array of email IDs" });
    }

    // Find and update the service
    const service = await Service.findByIdAndUpdate(
      serviceId, 
      { emails }, 
      { new: true }  // Return the updated document
    );

    if (!service) {
      return res.status(404).send({ message: "Service not found" });
    }

    res.send(service);
  } catch (err) {
    console.error("Error updating service emails:", err);
    res.status(500).send({
      message: err.message || "Some error occurred while updating service emails."
    });
  }
};

const calculateEndDate = (startDate, duration) => {
  const start = new Date(startDate);
  let monthsToAdd = 0;

  switch (duration) {
    case "1 month": monthsToAdd = 1; break;
    case "3 months": monthsToAdd = 3; break;
    case "6 months": monthsToAdd = 6; break;
    case "1 year": monthsToAdd = 12; break;
    case "2 years": monthsToAdd = 24; break;
    case "5 years": monthsToAdd = 60; break;
    default: monthsToAdd = 1;
  }

  start.setMonth(start.getMonth() + monthsToAdd);
  return start;
};
