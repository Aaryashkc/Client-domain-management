import Email from '../models/email.model.js';

export const createEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const newEmail = new Email({ email });
    await newEmail.save();
    res.status(201).json(newEmail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmails = async (req, res) => {
  try {
    const emails = await Email.find();
    res.status(200).json(emails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEmail = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEmail = await Email.findByIdAndDelete(id);
    if (!deletedEmail) {
      return res.status(404).json({ message: 'Email not found' });
    }
    res.status(200).json({ message: 'Email deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}