const { canModifyQueue } = require("../util/WavvebotUtil");

module.exports = {
  name: "skipto",
  aliases: ["st"],
  execute(message, args) {
    if (!args.length) return message.channel.send(`<:errado_rosa:828670964903575562> **${message.author.username}**, Uso correto: ${message.client.prefix}${module.exports.name} <Número da fila>`);

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(`<a:v_alert:853079364651450418> **${message.author.username}**, Não há música tocando no momento!`).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.playing = true;
    queue.songs = queue.songs.slice(args[0] - 2);
    queue.connection.dispatcher.end();
    queue.textChannel.send(`<a:v_alert:853079364651450418> **${message.author.username}** pulada ${args[0] - 1} músicas`).catch(console.error);
  }
};
