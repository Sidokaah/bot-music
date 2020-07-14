const { canModifyQueue } = require("../util/WavvebotUtil");

module.exports = {
  name: "skipto",
  aliases: ["st"],
  execute(message, args) {
    if (!args.length) return message.channel.send(`<:Error_Wavve:724400612535697408> **${message.author.username}**, Uso correto: ${message.client.prefix}${module.exports.name} <Número da fila>`);

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(`<:WavveAlert:725021943811538976> **${message.author.username}**, Não há música tocando no momento!`).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.playing = true;
    queue.songs = queue.songs.slice(args[0] - 2);
    queue.connection.dispatcher.end();
    queue.textChannel.send(`<:WavveAlert:725021943811538976> **${message.author.username}** pulada ${args[0] - 1} músicas`).catch(console.error);
  }
};
