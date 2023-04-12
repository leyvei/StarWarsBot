const economySchema = require("../../Models/economySchema");

const Discord = require("discord.js");

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("deposit")
    .setDescription("Déposer des crédits dans votre compte galactique.")
    .addIntegerOption((option) =>
      option
        .setName("quantity")
        .setDescription("Quantité de crédits à déposer.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.SendMessages),

  execute: async (interaction) => {
    const { user, guild } = interaction;

    let Data = await economySchema.findOne({ Guild: guild.id, User: user.id });

    if (!Data) {
      return await interaction.reply({
        content:
          "Vous devez avoir un compte galactique pour déposer des crédits.",
        ephemeral: true,
      });
    }

    const amount = interaction.options.getInteger("quantity");
    if (amount <= 0) {
      return await interaction.reply({
        content:
          "Veuillez spécifier une quantité positive de crédits à déposer.",
        ephemeral: true,
      });
    }

    if (Data.Wallet < amount) {
      return await interaction.reply({
        content:
          "Vous n'avez pas suffisamment de crédits pour déposer cette quantité.",
        ephemeral: true,
      });
    }

    await economySchema.findOneAndUpdate(
      { Guild: guild.id, User: user.id },
      { $inc: { Wallet: -amount, Bank: amount } }
    );

    interaction.reply({
      content: `Vous avez déposé ${amount} crédits dans votre compte bancaire.`,
      ephemeral: true,
    });
  },
};
