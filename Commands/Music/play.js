const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Jouer une chanson.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Renseigner le nom ou l'URL d'une chanson")
        .setRequired(true)
    ),
  async execute(interaction) {
    const { options, member, guild, channel } = interaction;

    const query = options.getString("query");
    const voiceChannel = member.voice.channel;

    const embed = new EmbedBuilder();

    if (!voiceChannel || member.voice.channelId !== "1092509778703568966") {
      embed
        .setColor("Red")
        .setDescription(
          "Vous devez être dans le salon <#1092509778703568966> pour exécuter cette commande"
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!member.voice.channelId == guild.members.me.voice.channelId) {
      embed
        .setColor("Red")
        .setDescription(
          `Vous ne pouvez pas utiliser le lecteur de musique car il est déjà actif dans <#${guild.members.me.voice.channelId}>`
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      client.distube.play(voiceChannel, query, {
        textChannel: channel,
        member: member,
      });
      return interaction.reply({
        content: "🎶 Requête reçue.",
        ephemeral: true,
      });
    } catch (err) {
      embed
        .setColor("Red")
        .setDescription(`⛔ | Quelque chose s'est mal passé...\n${err}`);

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
