const Discord = require('discord.js')

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName("clear")
        .setDescription("Supprime un nombre spécifique de messages")
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option => option.setName("montant").setDescription("Combien de messages souhaitez-vous supprimer").setRequired(true).setMinValue(1).setMaxValue(99))
        .addUserOption(option => option.setName("user").setDescription("Souhaitez-vous supprimer les messages d'un membre ? (Si oui, renseignez-le)").setRequired(false)),

    execute: async (interaction, client) => {
        const amount = interaction.options.getInteger("montant");

        // Récupération de l'option "user"
        const userOption = interaction.options.getUser("user");
        const user = userOption ? userOption.id : null;

        // Suppression des messages
        const channel = interaction.channel;
        const messages = await channel.messages.fetch({ limit: amount + 1 });
        const filteredMessages = user ? messages.filter(m => m.author.id === user) : messages;
        await channel.bulkDelete(filteredMessages, true);

        // Envoi d'un message de confirmation
        await interaction.reply({ content: `**${filteredMessages.size}** messages ont été supprimés.`, ephemeral: true });
    }
}