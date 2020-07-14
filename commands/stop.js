const { canModifyQueue } = require("../util/WavvebotUtil");


module.exports = {
  name: "stop",
  aliases: ["parar"],
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    
    if (!queue) return message.channel.send(`<:WavveAlert:725021943811538976> **${message.author.username}**, Não há música tocando no momento!`).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.songs = [];
    queue.connection.dispatcher.end();
    queue.textChannel.send(`<:Pause_Wavve:724360712637644922> **${message.author.username}**, parou a música!`).catch(console.error);
  }
};
