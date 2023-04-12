const economySchema = require("../../Models/economySchema");

const Discord = require("discord.js");

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("set-money")
    .setDescription("Définir la quantité de crédits pour un utilisateur.")
    .addIntegerOption((option) =>
      option
        .setName("quantite")
        .setDescription("La quantité de crédits à définir.")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("L'utilisateur à qui définir des crédits.")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.SendMessages),

  execute: async (interaction) => {
    const { user, guild } = interaction;

    const roleID = "1093148825025253406";
    const role = guild.roles.cache.get(roleID);
    if (!role || !interaction.member.roles.cache.has(roleID)) {
      return await interaction.reply({
        content: "Vous n'êtes pas autorisé à exécuter cette commande.",
        ephemeral: true,
      });
    }

    const amount = interaction.options.getInteger("quantite");
    if (amount < 0) {
      return await interaction.reply({
        content:
          "Veuillez spécifier une quantité positive ou nulle de crédits à définir.",
        ephemeral: true,
      });
    }

    const targetUser = interaction.options.getUser("utilisateur");
    if (!targetUser) {
      return await interaction.reply({
        content:
          "Veuillez spécifier un utilisateur valide à qui définir des crédits.",
        ephemeral: true,
      });
    }

    let TargetData = await economySchema.findOne({
      Guild: guild.id,
      User: targetUser.id,
    });

    if (!TargetData) {
      TargetData = await economySchema.create({
        Guild: guild.id,
        User: targetUser.id,
        Wallet: 0,
        Bank: 0,
      });
    }

    await economySchema.findOneAndUpdate(
      { Guild: guild.id, User: targetUser.id },
      { $set: { Wallet: amount } }
    );

    const embed = new Discord.EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Rapport de définition de crédits")
      .setDescription(
        `L'utilisateur ${targetUser.username} a été fixé pour nombre de crédits à ${amount} crédits par ${user.username}.`
      )
      .setTimestamp();

    const targetChannel = guild.channels.cache.get("1092462727638827168");

    interaction.reply({
      content: `Vous avez défini le montant de crédits de ${targetUser.username} à ${amount}.`,
      ephemeral: true,
    });
  },
};
