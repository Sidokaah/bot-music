const { canModifyQueue } = require("../util/WavvebotUtil");
const { aliases } = require("./help");

module.exports = {
  name: "pause",
  aliases: ["pausar", "parar", "stop"],
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(`<a:v_alert:853079364651450418> **${message.author.username}**, Não há nada tocando.`).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      return queue.textChannel.send(`:pause_button: **${message.author.username}**, Pausou o player.`).catch(console.error);
    }
  }
};
