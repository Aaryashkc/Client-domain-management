import Client from '../models/client.model.js';

// Create a new client
export const createClient = async (req, res) => {
  try {
    console.log("Received data:", req.body);  // Log the received data
    const { companyName, clientName, clientEmail, clientPhone, address, clientType } = req.body;

    if (!clientName || !clientEmail || !companyName) {
      return res.status(400).send({ message: "Client name and email are required" });
    }

    const client = new Client({
      companyName,
      clientName,
      clientEmail,
      clientPhone,
      address,
      clientType,
    });

    const data = await client.save();
    res.status(201).send(data);  // Respond with the created client data
  } catch (err) {
    console.error("Error creating client:", err);  // Log error if any
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Client."
    });
  }
};

// Retrieve all Clients
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find();  // Fetch all clients from the database
    res.send(clients);  // Respond with the list of clients
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving clients."
    });
  }
};

// Find a single Client with an id
export const getClient = async (req, res) => {
  const id = req.params.id;  // Get the client ID from request parameters

  try {
    const client = await Client.findById(id);  // Find client by ID

    if (!client) {
      return res.status(404).send({ message: "Client not found" });
    }

    res.send(client);  // Respond with the found client
  } catch (err) {
    res.status(500).send({
      message: err.message || `Error retrieving client with id=${id}`
    });
  }
};

// Toggle client status (active/inactive)
export const toggleClientStatus = async (req, res) => {
  const id = req.params.id;  // Get the client ID from request parameters

  try {
    const client = await Client.findById(id);  // Find the client by ID

    if (!client) {
      return res.status(404).send({ message: "Client not found" });
    }

    // Toggle the client status
    client.clientStatus = !client.clientStatus;  // If true, change to false; if false, change to true

    // Save the updated client
    await client.save();

    res.status(200).send({
      message: `Client status updated to ${client.clientStatus ? 'active' : 'inactive'}`,
      client
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error toggling client status."
    });
  }
};
