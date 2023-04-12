const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const client = require("../../index");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("filter")
    .setDescription("Ajouter un filtre à la musique")
    .addStringOption((option) =>
      option
        .setName("filter")
        .setDescription("Filtre à mettre")
        .addChoices(
          { name: "clear", value: "clear" },
          { name: "3d", value: "3d" },
          { name: "bassboost", value: "bassboost" },
          { name: "echo", value: "echo" },
          { name: "karaoke", value: "karaoke" },
          { name: "nightcore", value: "nightcore" },
          { name: "vaporwave", value: "vaporwave" },
          { name: "flanger", value: "flanger" },
          { name: "gate", value: "gate" },
          { name: "haas", value: "haas" },
          { name: "reverse", value: "reverse" },
          { name: "surround", value: "surround" },
          { name: "phaser", value: "phaser" },
          { name: "tremolo", value: "tremolo" },
          { name: "earwax", value: "earwax" }
        )
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
      const queue = client?.distube?.getQueue(interaction?.guild?.id);

      if (interaction.options.getString("filter") == "clear") {
        queue.filters.clear();
        return interaction.reply({
          content: `🎶 Filtre(s) réinitialisés.`,
          ephemeral: true,
        });
      }

      if (!queue || !queue?.playing)
        return interaction
          ?.reply({
            content: `Il n'y a aucune musique en cours de lecture`,
            ephemeral: true,
          })
          .catch((e) => {});
      queue.filters.add(`${interaction.options.getString("filter")}`);

      return interaction.reply({
        content: `🎶 Nouveau filtre: ${interaction.options.getString(
          "filter"
        )}.`,
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
