import checkChannelPermissions from "../checkChannelPermissions.js";

export default {
    name: "messageCreate",
    async execute(client, msg) {
        if (!checkChannelPermissions(msg.channel))
            return;
        if (msg.author.bot)
            return;
        let normalizeMsg = msg.content.toLowerCase();
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
        if (normalizeMsg.length !== name.length) {
            let index = normalizeMsg.indexOf(name)
            //sprawdzamy czy następny znak to litera jeśli tak to anulujemy
            if (isLetter(normalizeMsg.charAt(index + name.length)))
                return;

            //sprawdzamy czy poprzedni znak to spacja jeśli nie to anulujemy
            if (index > 0)
                if (normalizeMsg.charAt(index - 1) !== ' ')
                    return;
            //sprawdzam czy dlugosc wiadomosci nie rozni sie znaczaco od komendy
            if (Math.abs(normalizeMsg.length - name.length) > 4)
                return;
        }
        command.execute(msg);
    }
}

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}