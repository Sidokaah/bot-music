const { MessageEmbed } = require("discord.js")


module.exports = {
  name: "help",
  aliases: ["h", "ajuda"],
  execute(message) {
    let commands = message.client.commands.array();

    let helpEmbed = new MessageEmbed()
    .setColor('RANDOM')
    .setTitle('<:WavveHeadSet:732146337021427812> ▸ Wavve™ | Comandos de `Musica`')
    .setAuthor('Wavve™ | Prefixo: [w!]', 'https://cdn.discordapp.com/attachments/713525597027958797/724133741236191272/nf1yen2ub3l2riq1g9x2.png', 'https://discord.gg/bPX94q6')
    .setDescription('**Lista de todos os comandos:**\n`w!help` - Painel de ajuda do Wavve.\n`w!play` - Reproduz áudio do YouTube ou Soundcloud.\n`w!search` - Pesquise e selecione vídeos para reproduzir.\n`w!pause` - Pausar a música atualmente sendo reproduzida.\n`w!skip` - Pula a música atualmente sendo reproduzida.\n`w!resume` - Retomar a música atualmente sendo reproduzida.\n`w!stop` - Pára a música atual.\n`w!playlist` - Reproduzir uma lista de reprodução do youtube.\n`w!volume` - Altera o volume da música atualmente sendo reproduzida.\n`w!loop` - Alternar loop de música.\n`w!pruning` - Alternar remoção de mensagens de bot.\n`w!queue` - Mostre a fila de músicas e agora em reprodução.\n`w!remove` - Remover música da fila.\n`w!lyrics` - Pesquisa a letra da música tocando atualmente.\n`w!shuffle` - Aleatório na fila.\n`w!nowplaying` - Mostrar agora a reprodução da música.\n`w!skipto` - Ir para o número da fila selecionado.')
    .setThumbnail('https://cdn.discordapp.com/attachments/713525597027958797/724133741236191272/nf1yen2ub3l2riq1g9x2.png')
    .setTimestamp()
    .setFooter('Copyright ©️ 2020 Wavve™. All Rights Reserved.', 'https://cdn.discordapp.com/attachments/713525597027958797/724133741236191272/nf1yen2ub3l2riq1g9x2.png');
  
  return message.channel.send(helpEmbed).catch(console.error);
}
};