module.exports = {
  name: "messageCreate",
  execute: async (message) => {
    if (message.author.bot) return;

    let forbiddenWords = [
      "nsfw",
      "salope",
      "sac à foutre",
      "sac à merde",
      "sac a foutre",
      "sac a merde",
      "slp",
      "trou du cul",
      "tdc",
      "tdb",
      "trou de balle",
      "tamere",
      "ta mère",
      "ta mere",
      "tm",
      "ta mer",
      "porn",
      "porno",
      "pr0n",
      "p0rn",
      "gang bang",
      "cilit bang",
      "hand job",
      "blow job",
      "f u ck",
      "f u",
      "c u l",
      "p d",
      "p é d é",
      "n t m",
      "pute",
      "pouffe",
      "pouf",
      "poufiase",
      "pouffy",
      "poufyase",
      "pouffyase",
      "cul",
      "enculé",
      "en cule",
      "ntm",
      "nique ta mère",
      "enfoiré",
      "pédé",
      "pd",
      "salot",
      "mbdtc",
      "fu",
      "fuck",
      "fucker",
      "facka",
      "maddafacka (<3)",
      "bitch",
      "biatch",
      "motherfucker",
      "fum",
      "ass",
      "asshole",
      "fucking",
      "fils de pute",
      "fdp",
      "bite",
      "fuckoff",
      "fuq",
      "fuqa",
    ];
    let foundInText = false;

    for (let i in forbiddenWords) {
      if (
        message.content.toLowerCase().includes(forbiddenWords[i].toLowerCase())
      )
        foundInText = true;
    }

    if (foundInText) {
      message.delete();
    }

    if (
      message.content.toLowerCase().includes("hello") ||
      message.content.toLowerCase().includes("hi") ||
      message.content.toLowerCase().includes("salut") ||
      message.content.toLowerCase().includes("yo") ||
      message.content.toLowerCase().includes("bonjour")
    ) {
      await message.react("✌️");
    }

    if (
      message.content.includes("https://") ||
      message.content.includes("http://") ||
      message.content.includes("discord.gg") ||
      message.content.includes("www")
    ) {
      const allowedRoles = ["829256424941027328", "1091408325977047172"];
      const memberRole = message.guild.members.cache.get(message.author.id);
      // console.log(`Member: ${member}`);
      for (let i = 0; i < allowedRoles.length; i++) {
        if (memberRole == allowedRoles[i]) {
          return;
        } else {
          message.delete();
          message.channel.send({
            content:
              "Vous n'avez pas les permissions requises pour envoyer un lien dans ce serveur. Veuillez réessayer plus tard",
            ephemeral: true,
          });
        }
      }
    }
  },
};
