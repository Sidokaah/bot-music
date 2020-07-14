const { canModifyQueue } = require("../util/WavvebotUtil");

module.exports = {
  name: "skip",
  aliases: ["s", "pular", "sk"],
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.channel.send(`<:WavveAlert:725021943811538976> **${message.author.username}**, Não há música tocando no momento!`).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.playing = true;
    queue.connection.dispatcher.end();
    queue.textChannel.send(`<:WavveAlert:725021943811538976> **${message.author.username}**, pulou a musica para a proxima.`).catch(console.error);
  }
};
