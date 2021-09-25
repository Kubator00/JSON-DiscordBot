const checkPremissions = require("../checkPremissions");

module.exports = {
    name: "messageCreate",

    async execute(client, msg) {

        if (!checkPremissions)
            return;


        if (msg.author.bot)
            return;

        let normalizeMsg = msg.content.toLowerCase();
        normalizeMsg = normalizeMsg.normalize("NFD").replace(/[\u0300-\u036f]/g, "");  //usuwamy wszystkie polskie znaki poza ł
        function removeDiacritics(str) { //usuwa ł ponieważ funkcja normalize tego nie jest w stanie zrobic
            let strArray = str.split('');
            for (let i = 0; i < strArray.length; i++) {
                if (strArray[i] == 'ł')
                    strArray[i] = 'l';
            }
            return strArray.join('');
        }

        normalizeMsg = removeDiacritics(normalizeMsg);

        let command;
        let name;
        (client.messageCommands.filter(cmd => {
            if (normalizeMsg.includes(cmd.name)) {
                command = client.messageCommands.get(cmd.name);
                name = command.name;
            }
            else {
                if (cmd.aliases) {
                    cmd.aliases.filter(cmdAliases => {
                        if (normalizeMsg.includes(cmdAliases)) {
                            command = client.messageCommands.get(cmd.name);
                            name = cmdAliases;
                        }
                    })
                }
            }
        }));

        if (!command)
            return;

        if (msg.content.length != name.length) {
            let index = msg.content.indexOf(name)

            //sprawdzamy czy następny znak to litera jeśli tak to anulujemy
            if (isLetter(msg.content.charAt(index + name.length)))
                return;

            //sprawdzamy czy poprzedni znak to spacja jeśli nie to anulujemy
            if (index > 0) {
                if (msg.content.charAt(index - 1) != ' ')
                    return;
            }

        }

        command.execute(msg);
    }
}

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}