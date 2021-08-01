const { canModifyQueue } = require("../util/WavvebotUtil");

module.exports = {
  name: "shuffle",
  aliases: ["embaralhar"],
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send(`<a:v_alert:853079364651450418> **${message.author.username}**, Não há música tocando no momento!`).catch(console.error);
    if (!canModifyQueue(message.member)) return;

    let songs = queue.songs;
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    queue.songs = songs;
    message.client.queue.set(message.guild.id, queue);
    queue.textChannel.send(`<:certo_rosa:828670887326646312> **${message.author.username}**, embaralhou a fila.`).catch(console.error);
  }
};
