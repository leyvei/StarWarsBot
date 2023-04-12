const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const loadEvents = require("./Handlers/eventHandler");
const loadCommands = require("./Handlers/commandHandler");

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

const dotenv = require("dotenv");
dotenv.config();

const { User, Message, GuildMember, ThreadMember, Channel } = Partials;

const client = new Client({
  intents: 3276799,
  partials: [User, Message, GuildMember, ThreadMember, Channel],
});

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: true,
  emitAddSongWhenCreatingQueue: false,
  plugins: [new SpotifyPlugin()],
});

client.commands = new Collection();

module.exports = client;

client.login(process.env.TOKEN).then(() => {
  loadEvents(client);
  loadCommands(client);
});
