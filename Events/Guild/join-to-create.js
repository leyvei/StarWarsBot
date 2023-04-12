const client = require("../../index");
const { ChannelType, Collection } = require("discord.js");
const schema = require("../../Models/join-to-create");
let voiceManager = new Collection();

module.exports = {
  name: "jointocreate",
};

client.on("voiceStateUpdate", async (oldState, newState) => {
  const { member, guild } = oldState;
  const newChannel = newState.channel;
  const oldChannel = oldState.channel;

  let data = await schema.findOne({ Guild: guild.id });
  if (!data) return;

  const channelid = data.Channel;
  const channel = client.channels.cache.get(channelid);
  const userlimit = data.UserLimit;

  // Vérifier si l'utilisateur a déjà un salon vocal privé
  const existingChannelId = voiceManager.get(member.id);
  if (existingChannelId) {
    const existingChannel = guild.channels.cache.get(existingChannelId);
    // Rediriger l'utilisateur vers son salon vocal privé existant
    if (
      oldChannel !== newChannel &&
      newChannel &&
      newChannel.id === data.Channel
    ) {
      member.voice.setChannel(existingChannel);
      return;
    }
  }

  let voiceChannelNameList = [
    "Luke Skywalker",
    "Leia Organa",
    "Han Solo",
    "Chewbacca",
    "Darth Vader",
    "Palpatine",
    "Obi - Wan Kenobi",
    "Yoda",
    "Boba Fett",
    "Lando Calrissian",
    "C-3PO",
    "R2-D2",
    "Finn",
    "Rey",
    "Poe Dameron",
    "Kylo Ren",
    "Captain Phasma",
    "Jyn Erso",
    "Cassian Andor",
    "K - 2SO",
    "Chirrut Îmwe",
    "Baze Malbus",
  ];

  if (oldChannel !== newChannel && newChannel && newChannel.id === channel.id) {
    let randomIndex = Math.floor(Math.random() * voiceChannelNameList.length);
    const voiceChannel = await guild.channels.create({
      name: `🔊 | ${voiceChannelNameList[randomIndex]} | Id: ${Math.floor(
        Math.random() * 9999
      )}`,
      type: ChannelType.GuildVoice,
      parent: newChannel.parent,
      permissionOverwrites: [
        {
          id: member.id,
          allow: ["Connect", "ManageChannels"],
        },
        {
          id: guild.id,
          allow: ["Connect"],
        },
      ],
      userLimit: userlimit,
    });

    voiceManager.set(member.id, voiceChannel.id);

    await newChannel.permissionOverwrites.edit(member, {
      Connect: false,
    });

    setTimeout(() => {
      newChannel.permissionOverwrites.delete(member);
    }, 30000);

    return setTimeout(() => {
      member.voice.setChannel(voiceChannel);
    }, 500);
  }

  const jointocreate = voiceManager.get(member.id);
  const members = oldChannel?.members
    .filter((m) => !m.user.bot)
    .map((m) => m.id);
  if (
    jointocreate &&
    oldChannel.id === jointocreate &&
    (!newChannel || newChannel.id !== jointocreate)
  ) {
    if (members.length > 0) {
      let randomID = members[Math.floor(Math.random() * members.length)];
      let randomMember = guild.members.cache.get(randomID);
      randomMember.voice.setChannel(oldChannel).then((v) => {
        oldChannel.setName(randomMember.user.username).catch((e) => null);
        oldChannel.permissionOverwrites.edit(randomMember, {
          Connect: true,
          ManageChannels: true,
        });
      });
      voiceManager.set(member.id, null);
      voiceManager.set(randomMember.id, oldChannel.id);
    } else {
      voiceManager.set(member.id, null);
      setTimeout(() => {
        oldChannel.delete().catch((e) => null);
      }, 1000);
    }
  }
});
