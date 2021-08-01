const { play } = require("../include/play");
const { YOUTUBE_API_KEY, SOUNDCLOUD_CLIENT_ID } = require("../config.json");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const scdl = require("soundcloud-downloader");

module.exports = {
  name: "play",
  cooldown: 3,
  aliases: ["p", "tocar"],
  async execute(message, args) {
    const { channel } = message.member.voice;

    const serverQueue = message.client.queue.get(message.guild.id);
    if (!channel) return message.channel.send(`<a:v_alert:853079364651450418> **${message.author.username}**, Entre em um canal e tente novamente!`).catch(console.error);
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message.channel.send(`<:errado_rosa:828670964903575562> **${message.author.username}**, Você deve estar no mesmo canal que **${message.client.user}**!`).catch(console.error);

    if (!args.length)
      return message
        .channel.send(`<:errado_rosa:828670964903575562> **${message.author.username}**, Uso correto: ${message.client.prefix}play <URL do YouTube | Nome do vídeo | URL do Soundcloud>`)
        .catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.channel.send(`<:errado_rosa:828670964903575562> **${message.author.username}**, Não é possível conectar ao canal de voz, talvez esteja faltando permissões!`);
    if (!permissions.has("SPEAK"))
      return message.channel.send(`<:errado_rosa:828670964903575562> **${message.author.username}**, Não consigo falar neste canal de voz, verifique se tenho as permissões adequadas!`);

    const search = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
    const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
    const url = args[0];
    const urlValid = videoPattern.test(args[0]);

    // Start the playlist if playlist url was provided
    if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
      return message.client.commands.get("playlist").execute(message, args);
    }

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true
    };

    let songInfo = null;
    let song = null;

    if (urlValid) {
      try {
        songInfo = await ytdl.getInfo(url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    } else if (scRegex.test(url)) {
      // It is a valid Soundcloud URL
      if (!SOUNDCLOUD_CLIENT_ID)
        return message.channel.send(`<:errado_rosa:828670964903575562> **${message.author.username}**, Falta o Soundcloud Client ID na configuração`).catch(console.error);
      try {
        const trackInfo = await scdl.getInfo(url, SOUNDCLOUD_CLIENT_ID);
        song = {
          title: trackInfo.title,
          url: url
        };
      } catch (error) {
        if (error.statusCode === 404)
          return message.channel.send(`<:errado_rosa:828670964903575562> **${message.author.username}**, Não foi possível encontrar a faixa do Soundcloud.`).catch(console.error);
        return message.channel.send(`<:errado_rosa:828670964903575562> **${message.author.username}**, Ocorreu um erro ao reproduzir essa faixa do Soundcloud.`).catch(console.error);
      }
    } else {
      try {
        const results = await youtube.searchVideos(search, 1);
        songInfo = await ytdl.getInfo(results[0].url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (error) {
        console.error(error);
        return message.channel.send(`<:errado_rosa:828670964903575562> **${message.author.username}**, Nenhum vídeo foi encontrado com um título correspondente.`).catch(console.error);
      }
    }

    if (serverQueue) {
      serverQueue.songs.push(song);
      return serverQueue.textChannel
        .send(`<:certo_rosa:828670887326646312> **${song.title}** foi adicionado à fila por **${message.author.username}**`)
        .catch(console.error);
    }

    queueConstruct.songs.push(song);
    message.client.queue.set(message.guild.id, queueConstruct);

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
};
