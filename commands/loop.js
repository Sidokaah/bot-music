const { canModifyQueue } = require("../util/WavvebotUtil");

module.exports = {
  name: "loop",
  aliases: ['l'],
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("There is nothing playing.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    // toggle from false to true and reverse
    queue.loop = !queue.loop;
    return queue.textChannel
      .send(`Loop agora ${queue.loop ? "**<:On:817710696703459370>**" : "**<:Off:817710657247379456>**"}`)
      .catch(console.error);
  }
};
