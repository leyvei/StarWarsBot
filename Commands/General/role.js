const Discord = require("discord.js");

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("role")
    .setDescription("Attribue un rôle à l'utilisateur.")
    .addStringOption((option) =>
      option
        .setName("role")
        .setDescription("Le rôle à attribuer.")
        .setRequired(true)
        .addChoices(
          { name: "Jedi", value: "1092392660691599420" },
          { name: "Sith", value: "1092396975560851516" },
          { name: "Chasseur de primes", value: "1092397344366010398" },
          { name: "Vaurien", value: "1092397291832365146" },
          { name: "Pilleur", value: "1092397215282102303" },
          { name: "Héros", value: "1092397572058009661" },
          { name: "Villain", value: "1092397485005213786" },
          { name: "Droïde Astro-mécano", value: "1092397653708509205" },
          { name: "Droïde de Protocole", value: "1092397737242284132" }
        )
    ),
  async execute(interaction) {
    const role = interaction.options.getString("role");
    const member = interaction.member;

    if (interaction.channelId == 1092408254367289436) {
      try {
        const rolesToRemove = [
          "1092392660691599420",
          "1092396975560851516",
          "1092397344366010398",
          "1092397291832365146",
          "1092397215282102303",
          "1092397572058009661",
          "1092397485005213786",
          "1092397653708509205",
          "1092397737242284132",
          "1092448256874778704",
        ];
        const matchingRoles = member.roles.cache.filter((r) =>
          rolesToRemove.includes(r.id)
        );

        await member.roles.remove(matchingRoles);

        switch (role) {
          case "1092392660691599420":
            await member.roles.add("1092392660691599420");
            break;
          case "1092396975560851516":
            await member.roles.add("1092396975560851516");
            break;
          case "1092397344366010398":
            await member.roles.add("1092397344366010398");
            break;
          case "1092397291832365146":
            await member.roles.add("1092397291832365146");
            break;
          case "1092397215282102303":
            await member.roles.add("1092397215282102303");
            break;
          case "1092397572058009661":
            await member.roles.add("1092397572058009661");
            break;
          case "1092397485005213786":
            await member.roles.add("1092397485005213786");
            break;
          case "1092397653708509205":
            await member.roles.add("1092397653708509205");
            break;
          case "1092397737242284132":
            await member.roles.add("1092397737242284132");
            break;
          default:
            await interaction.reply({
              content: "Le rôle spécifié est invalide.",
              ephemeral: true,
            });
            break;
        }

        await interaction.reply({
          content: `Le rôle <@&${role}> vous a été attribué avec succès.`,
          ephemeral: true,
        });
      } catch (error) {
        await interaction.reply({
          content: "Une erreur est survenue lors de l'attribution du rôle.",
          ephemeral: true,
        });
      }
    } else {
      await interaction.reply({
        content:
          "Veuillez effectuer cette commande dans le salon <#1092408254367289436>.",
        ephemeral: true,
      });
    }
  },
};
