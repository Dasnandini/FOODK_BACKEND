import {
  getDeliveryAgentsService,
  getDeliveryAgentByIdService,
  verifyDeliveryAgentService
} from "../services/deliveryAgent.service.js";

export const getDeliveryAgents = async (req, res) => {
  const response = await getDeliveryAgentsService(req.query);
  res.json(response);
};

export const getDeliveryAgentById = async (req, res) => {
  const response = await getDeliveryAgentByIdService(req.query.id);
  res.json(response);
};

export const verifyDeliveryAgent = async (req, res) => {
  const response = await verifyDeliveryAgentService(req);
  res.json(response);
};
