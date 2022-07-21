import { get_uuid, get_path } from "./uberduck.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

// intents - https://discord.com/developers/docs/topics/gateway#list-of-intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.login(process.env.BOT_TOKEN);

client.on("ready", () => {
  console.log("Bot is ready!");
});

// respond to messages of form:
// @Charles Martinet say "i am awesome" as "mario"

client.on("messageCreate", async (msg) => {
  // prevents bot from chatting with itself
  if (msg.author.bot) {
    return;
  }

  // checks if bot has been mentioned
  if (!msg.mentions.users.has(client.user.id)) {
    return;
  }

  // clean message content
  let cln_content = msg.cleanContent.toLowerCase();

  // check if command is correctly structured
  let is_correct = /^@charles martinet say ".*?" as ".*?"$/.test(cln_content);

  if (!is_correct) {
    await msg.reply("I don't quite understand.");
    return;
  }

  // get text and voice
  let arr = cln_content.match(/".*?"/g);
  let text = arr[0].replace(/"/g, "");
  let voice = arr[1].replace(/"/g, "");

  let voices = {
    yourself: "charles-martinet",
    mario: "mario-sports-mix",
    "baby mario": "baby-mario",
    luigi: "luigi",
    wario: "wario",
    waluigi: "waluigi",
  };

  // check if voice is available
  let is_available = voices.hasOwnProperty(voice);
  if (!is_available) {
    await msg.reply("I can't do that voice.");
    return;
  }

  // reply to person
  await msg.reply("Sure! I'll get right on it.");

  let uuid = await get_uuid(voices[voice], text);
  let path = await get_path(uuid);
  await msg.reply("Here you go!");
  msg.channel.send({
    files: [path],
  });
});
