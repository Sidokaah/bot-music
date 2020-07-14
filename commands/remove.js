const { canModifyQueue } = require("../util/WavvebotUtil");

module.exports = {
  name: "remove",
  aliases: ['remover'],
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(`<:WavveAlert:725021943811538976> **${message.author.username}**, Não há música tocando no momento!`).catch(console.error);
    if (!canModifyQueue(message.member)) return;
    
    if (!args.length) return message.channel.send(`<:WavveAlert:725021943811538976> **${message.author.username}**, Uso correto: ${message.client.prefix}remove <Número da fila>`);
    if (isNaN(args[0])) return message.channel.send(`<:WavveAlert:725021943811538976> **${message.author.username}**, Uso correto: ${message.client.prefix}remove <Número da fila>`);

    const song = queue.songs.splice(args[0] - 1, 1);
    queue.textChannel.send(`<:WavveTrue:724514898788220961> **${message.author.username}**, Musica **${song[0].title}** foi removida da fila.`);
  }
};
