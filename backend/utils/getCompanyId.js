import { User } from "../models/user.model.js";

export const getCompanyId = async (userId) => {
  const user = await User.findById(userId);
  return user?.company;
};