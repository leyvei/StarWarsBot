const client = require("../../index");
const emojies = require("../../emojies.json");
const Discord = require("discord.js");

client.emotes = emojies.emoji;

const status = (queue) =>
  `Volume: \`${queue.volume}%\` | Filtre: \`${
    queue.filters.names.join(", ") || "Off"
  }\` | boucle: \`${
    queue.repeatMode ? (queue.repeatMode === 2 ? "All Queue" : "Ce son") : "Off"
  }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

client.distube
  .on("playSong", (queue, song) => {
    const embed = new Discord.EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Lecture en cours")
      .setDescription(`"${song.name}" - "${song.formattedDuration}"`)
      .addFields(
        { name: "Demandé par", value: `${song.user}` },
        { name: "Informations sur la lecture", value: `${status(queue)}` }
      );

    client.channels.cache.get("1092462727638827168").send({ embeds: [embed] });
  })
  .on("addSong", (queue, song) => {
    const embed = new Discord.EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Nouvelle chanson ajoutée")
      .setDescription(
        `"${song.name}" - "${song.formattedDuration}" a été ajouté à la file d'attente par ${song.user}`
      );

    client.channels.cache.get("1092462727638827168").send({ embeds: [embed] });
  })
  .on("addList", (queue, playlist) => {
    const embed = new Discord.EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Nouvelle playlist ajoutée")
      .setDescription(
        `La playlist \`${playlist.name}\` (${
          playlist.songs.length
        } sons) a été ajoutée à la file d'attente par ${
          playlist.user
        }\n${status(queue)}`
      );

    client.channels.cache.get("1092462727638827168").send({ embeds: [embed] });
  })
  .on("error", (channel, e) => {
    if (channel)
      channel.send(
        `${client.emotes.error} | Erreur rencontrée: ${e
          .toString()
          .slice(0, 1974)}`
      );
    else console.error(e);
  })
  .on("empty", () => {
    return;
  })
  .on("searchNoResult", (message, query) =>
    message.reply(`${client.emotes.error} | Aucun résultat pour \`${query}\`!`)
  )
  .on("finish", (queue) => {
    const embed = new Discord.EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Lecture terminée")
      .setDescription("La file d'attente est vide");

    client.channels.cache.get("1092462727638827168").send({ embeds: [embed] });
  });
