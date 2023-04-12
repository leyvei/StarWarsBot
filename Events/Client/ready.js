const { Client } = require("discord.js");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  name: "ready",
  once: true,
  execute: async (client) => {
    await mongoose.connect(process.env.MONGODB || "", {
      keepAlive: true,
    });

    if (mongoose.connect) {
      console.log(`Base de données connecté...`);
    }

    console.log(`${client.user.username} est maintenant en ligne.`);
  },
};
