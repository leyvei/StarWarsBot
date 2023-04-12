const economySchema = require("../../Models/economySchema");
const Discord = require("discord.js");

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("askmoney")
    .setDescription("Demander de l'argent.")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.SendMessages),

  cooldowns: new Discord.Collection(),

  execute: async (interaction) => {
    const { user, guild } = interaction;

    let Data = await economySchema.findOne({ Guild: guild.id, User: user.id });

    if (!Data) {
      return await interaction.reply({
        content:
          "Vous devez avoir un compte galactique pour demander de l'argent.",
        ephemeral: true,
      });
    }

    const now = Date.now();
    const cooldownAmount = 5400000; // 1h30 en millisecondes
    const existingCooldown = module.exports.cooldowns.get(interaction.user.id);

    if (existingCooldown) {
      const timeLeft = (existingCooldown - now) / 1000;
      return interaction.reply({
        content: `Veuillez attendre ${timeLeft.toFixed(
          0
        )} seconde(s) avant de pouvoir utiliser cette commande.`,
        ephemeral: true,
      });
    }

    const amount = Math.floor(Math.random() * 1001) - 500;

    if (amount >= 0) {
      await economySchema.findOneAndUpdate(
        { Guild: guild.id, User: user.id },
        { $inc: { Wallet: amount } }
      );
      interaction.reply({
        content: `Vous avez reçu ${amount} crédits !`,
        ephemeral: true,
      });
    } else {
      const absAmount = Math.abs(amount);
      if (Data.Wallet < absAmount) {
        await economySchema.findOneAndUpdate(
          { Guild: guild.id, User: user.id },
          { Wallet: 0 }
        );
        interaction.reply({
          content: `Vous avez perdu tous vos crédits...`,
          ephemeral: true,
        });
      } else {
        await economySchema.findOneAndUpdate(
          { Guild: guild.id, User: user.id },
          { $inc: { Wallet: -absAmount } }
        );
        interaction.reply({
          content: `Vous avez perdu ${absAmount} crédits...`,
          ephemeral: true,
        });
      }
    }

    module.exports.cooldowns.set(interaction.user.id, now + cooldownAmount);
    setTimeout(() => {
      module.exports.cooldowns.delete(interaction.user.id);
    }, cooldownAmount);
  },
};
