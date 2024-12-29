const userModel = require("../models/user.model");

module.exports.createUser = async ({ email, password }) => {
  if (!email || !password) return { error: "Missing required fields" };

  const user = userModel.create({
    email,
    password,
  });
  return user;
};
