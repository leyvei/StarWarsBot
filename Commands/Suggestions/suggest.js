const Discord = require('discord.js');
const ms = require('ms')

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Envoyer une suggestion dans le channel de modération')
        .addStringOption(option => option.setName('suggestion').setDescription('La suggestion à envoyer').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('Une description de la suggestion')),
    async execute(interaction, client) {
        const suggestion = interaction.options.getString('suggestion');
        const description = interaction.options.getString('description') || 'Pas de description fournie.';
        const suggestionEmbed = new Discord.EmbedBuilder()
            .setColor('#7289da')
            .setTitle('Nouvelle suggestion')
            .setDescription(`${suggestion}\n\n**Description :** ${description}`)
            .addFields({name: 'Auteur', value: `${interaction.user.tag} (${interaction.user.id})`})
            .setTimestamp();

        try {
            const suggestionChannel = await client.channels.cache.get('1092468035228532736');
            const suggestionMessage = await suggestionChannel.send({ embeds: [suggestionEmbed] });
            await suggestionMessage.react('✅');
            await suggestionMessage.react('❌');

            const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && !user.bot;
            const collector = suggestionMessage.createReactionCollector({ filter, time: 300000 }); // 300000ms = 5 minutes

            collector.on('collect', (reaction, user) => {
                console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
            });

            collector.on('end', async collected => {
                const approvalCount = collected.filter(reaction => reaction.emoji.name === '✅').size;
                const disapprovalCount = collected.filter(reaction => reaction.emoji.name === '❌').size;

                const approvalPercentage = Math.round((approvalCount / (approvalCount + disapprovalCount)) * 100);

                const resultEmbed = new Discord.EmbedBuilder()
                    .setColor('#7289da')
                    .setTitle('Résultats de la suggestion')
                    .setDescription(suggestion)
                    .addFields({ name: 'Approuvé', value: `${approvalCount} votes (${approvalPercentage}%)` }, { name: "Désapprouvé", value: `${disapprovalCount} votes (${100 - approvalPercentage}%)` })
                    .setTimestamp();

                if (approvalCount > disapprovalCount) {
                    resultEmbed.addFields({ name: 'Statut', value: 'Approuvé' });
                } else {
                    resultEmbed.addFields({ name: 'Statut', value: 'Non approuvé' });
                }

                await suggestionChannel.send({ embeds: [resultEmbed] });
                await suggestionMessage.reactions.removeAll().catch(error => console.error("Impossible d'enlever les réactions: ", error));
            });

            await interaction.reply({ content: 'Votre suggestion a été envoyée avec succès.', ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Une erreur est survenue lors de l\'envoi de votre suggestion.', ephemeral: true });
        }
    }
};