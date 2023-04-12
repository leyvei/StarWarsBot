const Discord = require("discord.js");

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("rules")
    .setDescription("Renvoie les règles du serveur")
    .addBooleanOption((option) =>
      option.setName("dm").setDescription("Recevoir les règles en DM")
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Utilisateur à qui envoyer les règles")
        .setRequired(false)
    ),

  async execute(interaction) {
    const rulesEmbed = new Discord.EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("Règles du serveur communautaire Star Wars FR")
      .setDescription(
        "Voici les règles à respecter pour assurer une ambiance saine et amicale sur le serveur :"
      )
      .addFields(
        {
          name: "1. Respectez les autres membres",
          value:
            "Traitez-les avec respect et courtoisie, et évitez tout langage ou comportement offensant, discriminatoire, violent ou haineux.",
        },
        {
          name: "2. Pas de spam",
          value:
            "Évitez de spammer les canaux de discussion avec des messages répétitifs ou inutiles, des publicités ou des liens non pertinents.",
        },
        {
          name: "3. Restez dans le thème",
          value:
            "Le serveur est dédié à Star Wars, donc gardez les discussions, les images et les vidéos dans le thème de la franchise.",
        },
        {
          name: "4. Pas de spoilers",
          value:
            "Évitez de divulguer des informations sur les intrigues des films, des séries ou des livres récents de Star Wars sans avertir les autres membres. Utilisez des balises spoiler pour masquer les informations sensibles.",
        },
        {
          name: "5. Pas de harcèlement",
          value:
            "Le harcèlement sous toutes ses formes n'est pas toléré sur le serveur, qu'il s'agisse de harcèlement sexuel, de cyberintimidation ou de harcèlement moral.",
        },
        {
          name: "6. Soyez respectueux des modérateurs",
          value:
            "Les modérateurs sont là pour aider à maintenir une ambiance saine et sécuritaire sur le serveur, donc respectez leurs décisions et leurs demandes.",
        },
        {
          name: "7. Évitez les débats politiques ou religieux",
          value:
            "Pour éviter les tensions et les conflits, évitez les discussions sur les sujets politiques ou religieux.",
        },
        {
          name: "8. Pas de contenu NSFW",
          value:
            "Le contenu pour adultes ou à caractère sexuel n'est pas autorisé sur le serveur.",
        }
      )
      .setTimestamp();

    const sendDM = interaction.options.getBoolean("dm");
    const user = interaction.options.getUser("user");
    const member = interaction.guild.members.cache.get(interaction.user.id);

    if (member.permissions.has("ADMINISTRATOR")) {
      const mentionUser = interaction.options.getUser("user");
      if (mentionUser && sendDM) {
        await mentionUser.send({ embeds: [rulesEmbed] });
        await interaction.reply({
          content: `Les règles ont été envoyées à <@${mentionUser.id}> en DM.`,
          ephemeral: true,
        });
      } else if (!mentionUser && !sendDM) {
        await interaction.reply({ embeds: [rulesEmbed] });
      } else if (mentionUser && !sendDM) {
        await interaction.reply({
          content: `Si vous souhaitez envoyer les règles en DM renseigner l'option dm en tant que True`,
          ephemeral: true,
        });
      } else if (!mentionUser && sendDM) {
        await interaction.member.send({ embeds: [rulesEmbed] });
        await interaction.reply({
          content: `Les règles vous ont été envoyées en DM.`,
          ephemeral: true,
        });
      }
    } else {
      if (sendDM) {
        return interaction.reply({
          content:
            "Désolé, vous devez avoir les permissions d'administrateur pour afficher les règles directement sur le serveur. Vous pouvez utiliser l'option `dm` pour recevoir les règles en DM.",
          ephemeral: true,
        });
      }
      await user.send({ embeds: [rulesEmbed] });
      await interaction.reply({
        content: "Les règles vous ont été envoyées en DM.",
        ephemeral: true,
      });
    }
  },
};
