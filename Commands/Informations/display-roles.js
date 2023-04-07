const Discord = require('discord.js');

// Array des IDs des rôles par défaut
const defaultRoles = ['1092392660691599420', '1092396975560851516', '1092397344366010398', '1092397291832365146', '1092397215282102303', '1092397572058009661', '1092397485005213786', '1092397653708509205', '1092397737242284132'];

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('display-roles')
        .setDescription('Affiche les rôles par défaut.')
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator),

    execute: async (interaction) => {
        const guild = interaction.guild;
        const roleObjects = defaultRoles.map(roleID => guild.roles.cache.get(roleID));

        const roleMentions = roleObjects.map(role => `-<@&${role.id}>`).join('\n');

        const embed = new Discord.EmbedBuilder()
            .setTitle('Rôles par défaut')
            .setDescription(`Le serveur a 9 roles par défaut: \n${roleMentions}\nPour en choisir un veuillez effectuer la commande </role:1092412328806469713>`)
            .setColor('Random');

        await interaction.reply({ embeds: [embed] });
    }
};