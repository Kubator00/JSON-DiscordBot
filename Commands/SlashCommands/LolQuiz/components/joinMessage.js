
import Player from "./player.js";
export default async function joinMsg(msg, players,timeToReaction) {
    const filterFirstMsg = (reaction, user) => {
        return ['👍'].includes(reaction.emoji.name) && user.id !== reaction.message.author.id;
    };
    let firstMsg = await msg.followUp("```diff\n+ Osoby które chcą zagrać proszę wcisnąć łapkę w górę```");
    await firstMsg.react('👍');
    await firstMsg.awaitReactions({ filterFirstMsg, max: 8, time: timeToReaction })
        .then(collected => {
            collected = collected.first();
            for (let user of collected.users.cache) {
                if (user[1].bot)
                    continue;
                const player = new Player(user[1].id, user[1].username, user[1].avatarURL());
                players.push(player);
            }
        })
        .catch(err => {
            return msg.channel.send("```diff\n- Brak graczy, gra nie zostanie rozpoczęta```");
        });

};

