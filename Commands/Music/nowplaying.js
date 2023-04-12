const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription(
      "Afficher des informations sur la chanson actuellement en lecture."
    ),
  async execute(interaction) {
    const { member, guild } = interaction;
    const voiceChannel = member.voice.channel;

    const embed = new EmbedBuilder();

    if (!voiceChannel) {
      embed
        .setColor("Red")
        .setDescription(
          "Vous devez être dans un salon vocal pour utiliser les commandes musicales."
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    if (!member.voice.channelId == guild.members.me.voice.channelId) {
      embed
        .setColor("Red")
        .setDescription(
          `Vous ne pouvez pas utiliser le lecteur musical car il est déjà actif dans <#${guild.members.me.voice.channelId}>`
        );
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      const queue = await client.distube.getQueue(voiceChannel);

      if (!queue) {
        embed
          .setColor("Red")
          .setDescription("Il n'y a pas de file d'attente active.");
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      const song = queue.songs[0];
      embed
        .setColor("Blue")
        .setDescription(
          `🎶 **En cours de lecture :** \`${song.name}\` - \`${song.formattedDuration}\`.\n**Lien :** ${song.url}`
        )
        .setThumbnail(song.thumbnail);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (err) {
      console.log(err);

      embed
        .setColor("Red")
        .setDescription("⛔ | Quelque chose s'est mal passé...");

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
