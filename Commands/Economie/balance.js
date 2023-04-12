const economySchema = require("../../Models/economySchema");

const Discord = require("discord.js");

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("balance")
    .setDescription("Vérifier le solde de votre compte galactique")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.SendMessages),

  execute: async (interaction) => {
    const { user, guild } = interaction;

    let Data = await economySchema
      .findOne({ Guild: interaction.guild.id, User: interaction.user.id })
      .exec();

    if (!Data)
      return await interaction.reply({
        content: `Vous devez avoir un compte galactique pour exécuter cette commande.`,
        ephemeral: true,
      });

    const wallet = Math.round(Data.Wallet);
    const bank = Math.round(Data.Bank);
    const total = Math.round(Data.Wallet + Data.Bank);

    const embed = new Discord.EmbedBuilder()
      .setColor("Orange")
      .setTitle("Solde du compte galactique")
      .addFields({
        name: "Solde",
        value: `**Banque:** ${bank}\n**Porte-monnaie:** ${wallet}\n**Total:** ${total}`,
      });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
