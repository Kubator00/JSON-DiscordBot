
module.exports = {
    name: "messageCreate",

    async execute(client, msg) {
        if (!msg.channel.permissionsFor(msg.client.user).has('SEND_MESSAGES')
            || !msg.channel.permissionsFor(msg.client.user).has('ADD_REACTIONS')) {
            return console.log("Nie mam uprawnień wysylania wiadomosci lub dodawania reakcji");
        }
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

        // let command = client.messageCommands.get(normalizeMsg) ||
        //     client.messageCommands.find(cmd => cmd.aliases && cmd.aliases.includes(normalizeMsg));

        let command;

        (client.messageCommands.filter(cmd => {
            if (normalizeMsg.includes(cmd.name)) {
                command = client.messageCommands.get(cmd.name);
            }
            else {
                if (cmd.aliases) {
                    cmd.aliases.filter(cmdAliases => {
                        if (normalizeMsg.includes(cmdAliases)) {
                            command = client.messageCommands.get(cmd.name);
                        }
                    })
                }
            }
        }));



        // if (!command) {
        //     (client.messageCommands.filter(cmd => {
        //         {
        //             console.log(cmd);
        //             if (cmd.aliases) {
        //                 cmd.aliases.filter(cmdAliases => {
        //                     console.log(cmdAliases);
        //                     if (normalizeMsg.includes(cmdAliases))
        //                         command = client.messageCommands.get(cmd.name);
        //                 })
        //             }
        //         }
        //     }
        //     ));
        // }

        if (!command)
            return;

        command.execute(msg);
    }
}