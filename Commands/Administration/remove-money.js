const economySchema = require("../../Models/economySchema");

const Discord = require("discord.js");

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("remove-money")
    .setDescription("Retirer des crédits à un utilisateur.")
    .addIntegerOption((option) =>
      option
        .setName("quantity")
        .setDescription("Quantité de crédits à retirer.")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Utilisateur à qui retirer des crédits.")
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

    const amount = interaction.options.getInteger("quantity");
    if (amount <= 0) {
      return await interaction.reply({
        content:
          "Veuillez spécifier une quantité positive de crédits à retirer.",
        ephemeral: true,
      });
    }

    const targetUser = interaction.options.getUser("user");
    if (!targetUser) {
      return await interaction.reply({
        content:
          "Veuillez spécifier un utilisateur valide à qui retirer des crédits.",
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

    if (TargetData.Wallet < amount) {
      return await interaction.reply({
        content:
          "L'utilisateur ciblé n'a pas suffisamment de crédits dans son portefeuille.",
        ephemeral: true,
      });
    }

    await economySchema.findOneAndUpdate(
      { Guild: guild.id, User: targetUser.id },
      { $inc: { Wallet: -amount } }
    );

    const embed = new Discord.EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Rapport de retrait de crédits")
      .setDescription(
        `L'utilisateur ${targetUser.username} a été retiré de ${amount} crédits par ${user.username}.`
      )
      .setTimestamp();

    const targetChannel = guild.channels.cache.get("1092462727638827168");

    await targetChannel.send({ embeds: [embed] });
    interaction.reply({
      content: `Vous avez retiré ${amount} crédits à ${targetUser.username}.`,
      ephemeral: true,
    });
  },
};
