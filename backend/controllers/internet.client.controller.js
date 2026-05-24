import { Customer } from "../models/customer.model.js";
import { InternetClient } from "../models/internet.client.model.js";
import { getCompanyId } from "../utils/getCompanyId.js";

// ================= CREATE =================
export const createInternetClient = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    const internetClient = await InternetClient.create({
      ...req.body,
      company: companyId,
    });

    res.status(201).json(internetClient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating internet client" });
  }
};

// ================= GET =================
export const getInternetClients = async (req, res) => {
  try {
    const companyId = await getCompanyId(req.userId);

    const internetClients = await InternetClient.find({ company: companyId });

    res.json(internetClients);
  } catch (err) {
    res.status(500).json({ message: "Error fetching internet clients" });
  }
};

// ================= UPDATE =================
export const updateInternetClient = async (req, res) => {
  try {
    const internetClient = await InternetClient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(internetClient);
  } catch (err) {
    res.status(500).json({ message: "Error updating internet client" });
  }
};

// ================= DELETE =================
export const deleteInternetClient = async (req, res) => {
  try {
    await InternetClient.findByIdAndDelete(req.params.id);
    res.json({ message: "Internet client deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting internet client" });
  }
};