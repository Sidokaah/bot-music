const fs = require("fs");
const config = require("../config.json");

module.exports = {
  name: "pruning",
  execute(message) {
    config.PRUNING = !config.PRUNING;

    fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => {
      if (err) {
        console.log(err);
        return message.channel.send("Ocorreu um erro ao gravar no arquivo.").catch(console.error);
      }

      return message.channel
        .send(`A remoção da mensagem é ${config.PRUNING ? "**ativado**" : "**desativado**"}`)
        .catch(console.error);
    });
  }
};
