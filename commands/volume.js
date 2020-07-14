const { canModifyQueue } = require("../util/WavvebotUtil");

module.exports = {
  name: "volume",
  aliases: ["v", "vol"],
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.channel.send(`<:WavveAlert:725021943811538976> **${message.author.username}**, Não há música tocando no momento!`).catch(console.error);
    if (!canModifyQueue(message.member))
      return message.channel.send(`<:WavveAlert:725021943811538976> **${message.author.username}**, Entre em um canal e tente novamente!`).catch(console.error);

    if (!args[0]) return message.channel.send(`<a:Volume_Wavve:715589150358896703> **${message.author.username}**, O volume atual é: __${queue.volume}%__`).catch(console.error);
    if (isNaN(args[0])) return message.channel.send(`<:WavveAlert:725021943811538976> **${message.author.username}**, Por favor, use um número para definir o volume.`).catch(console.error);
    if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
      return message.channel.send(`<:Error_Wavve:724400612535697408> Parece que você usou o comando de forma errada, **${message.author.username}\nUso correto:** _${message.client.prefix}volume <1-100>_`).catch(console.error);

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    return queue.textChannel.send(`<a:Volume_Wavve:715589150358896703> **${message.author.username}**, alterou o volume da musica para: __${args[0]}%__`).catch(console.error);
  }
};
