const { MessageEmbed } = require("discord.js");
const { play } = require("../include/play");
const { YOUTUBE_API_KEY, MAX_PLAYLIST_SIZE } = require("../config.json");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);

module.exports = {
  name: "playlist",
  cooldown: 3,
  aliases: ["pl"],
  async execute(message, args) {
    const { PRUNING } = require("../config.json");
    const { channel } = message.member.voice;

    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message.channel.send(`<:errado_rosa:828670964903575562> **${message.author.username}**, Você deve estar no mesmo canal que **${message.client.user}**`).catch(console.error);

    if (!args.length)
      return message
        .send(`<:errado_rosa:828670964903575562> **${message.author.username}**, Uso correto: ${message.client.prefix}playlist <YouTube Playlist URL | Playlist Name>`)
        .catch(console.error);
    if (!channel) return message.channel.send(`<a:v_alert:853079364651450418> **${message.author.username}**, Você precisa ingressar em um canal de voz primeiro!`).catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.channel.send(`<:errado_rosa:828670964903575562> **${message.author.username}**, Não é possível conectar ao canal de voz, talvez esteja faltando permissões!`);
    if (!permissions.has("SPEAK"))
      return message.channel.send(`<:errado_rosa:828670964903575562> **${message.author.username}**, Não consigo falar neste canal de voz, verifique se tenho as permissões adequadas!`);

    const search = args.join(" ");
    const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
    const url = args[0];
    const urlValid = pattern.test(args[0]);

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true
    };

    let song = null;
    let playlist = null;
    let videos = [];

    if (urlValid) {
      try {
        playlist = await youtube.getPlaylist(url, { part: "snippet" });
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
      } catch (error) {
        console.error(error);
        return message.channel.send(`<:errado_rosa:828670964903575562> **${message.author.username}**, Lista de reprodução não encontrada :(`).catch(console.error);
      }
    } else {
      try {
        const results = await youtube.searchPlaylists(search, 1, { part: "snippet" });
        playlist = results[0];
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 100, { part: "snippet" });
      } catch (error) {
        console.error(error);
        return message.channel.send(`<:errado_rosa:828670964903575562> **${message.author.username}**, Lista de reprodução não encontrada :(`).catch(console.error);
      }
    }

    videos.forEach((video) => {
      song = {
        title: video.title,
        url: video.url,
        duration: video.durationSeconds
      };

      if (serverQueue) {
        serverQueue.songs.push(song);
        if (!PRUNING)
          message.channel
            .send(`<:certo_rosa:828670887326646312> **${song.title}** foi adicionado à fila por **${message.author.username}**`)
            .catch(console.error);
      } else {
        queueConstruct.songs.push(song);
      }
    });

    let playlistEmbed = new MessageEmbed()
      .setTitle(`${playlist.title}`)
      .setURL(playlist.url)
      .setColor("#F8AA2A")
      .setTimestamp();

    if (!PRUNING) {
      playlistEmbed.setDescription(queueConstruct.songs.map((song, index) => `${index + 1}. ${song.title}`));
      if (playlistEmbed.description.length >= 2048)
        playlistEmbed.description =
          playlistEmbed.description.substr(0, 2007) + `\n<:errado_rosa:828670964903575562> **${message.author.username}**, Lista de reprodução maior que o limite de caracteres...`;
    }

    message.channel.send(`<:certo_rosa:828670887326646312> **${message.author.username}** Iniciou uma lista de reprodução.`, playlistEmbed);

    if (!serverQueue) message.client.queue.set(message.guild.id, queueConstruct);

    if (!serverQueue) {
      try {
        queueConstruct.connection = await channel.join();
        await queueConstruct.connection.voice.setSelfDeaf(true);
        play(queueConstruct.songs[0], message);
      } catch (error) {
        console.error(error);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel.send(`<:errado_rosa:828670964903575562> **${message.author.username}**, Não foi possível conectar no canal: **${error}**`).catch(console.error);
      }
    }
  }
};
