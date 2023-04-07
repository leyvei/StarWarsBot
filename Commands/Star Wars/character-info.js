const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('character-info')
        .setDescription('Génère une fiche sur un personnage aléatoire de Star Wars.'),
    async execute(interaction) {
        await axios.get(`https://swapi.dev/api/people/${Math.floor(Math.random() * 82) + 1}`).then((data) => {
            const character = data.data
            const homeworld = character.homeworld;

            const embed = new EmbedBuilder()
                .setColor("#f9e51e")
                .setTitle(character.name)
                .addFields(
                    { name: 'Genre', value: character.gender === 'male' ? 'Homme' : character.gender === 'female' ? 'Femme' : 'Non-binaire' },
                    { name: 'Planète natale', value: homeworld },
                    { name: 'Taille', value: character.height + ' cm' },
                    { name: 'Poids', value: character.mass + ' kg' },
                    { name: 'Couleur des yeux', value: character.eye_color === 'blue' ? 'Bleu' : character.eye_color === 'brown' ? 'Marron' : character.eye_color === 'yellow' ? 'Jaune' : character.eye_color === 'red' ? 'Rouge' : character.eye_color === 'orange' ? "Orange" : character.eye_color},
                    { name: 'Couleur des cheveux', value: character.hair_color === 'blond' ? 'Blond' : character.hair_color === 'brown' ? 'Brun' : character.hair_color === 'black' ? 'Noir' : character.hair_color === 'white' ? 'Blanc' : character.hair_color},
                    { name: 'Année de naissance', value: character.birth_year ? character.birth_year : "Aucune" })
                .setThumbnail('https://i.postimg.cc/XJkCKGGd/SWLogo.png')
                .setFooter({ text: 'Informations fournies par l\'API Star Wars' });

            interaction.reply({ embeds: [embed], ephemeral: true });
        })

    }
}