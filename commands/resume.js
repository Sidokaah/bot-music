const { canModifyQueue } = require("../util/WavvebotUtil");

module.exports = {
  name: "resume",
  aliases: ["r", "unpause", "resumir"],
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(`<a:v_alert:853079364651450418> **${message.author.username}**, Não há música tocando no momento!`).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      return queue.textChannel.send(`<:certo_rosa:828670887326646312> **${message.author.username}**, Musica foi retornada!`).catch(console.error);
    }

    return message.channel.send(`<a:v_alert:853079364651450418> **${message.author.username}**, A fila não está em pausa.`).catch(console.error);
  }
};
