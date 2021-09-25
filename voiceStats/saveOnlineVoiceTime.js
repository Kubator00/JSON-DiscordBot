const pg = require('pg');


let usersVoiceMap = new Map();
const DATABASE_HOST = process.env.DATABASE_HOST;
const DATABASE_USER = process.env.DATABASE_USER;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_NAME = process.env.DATABASE_NAME;

const database = {
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    host: DATABASE_HOST,
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
};



module.exports = (client) => {
    let serverId;

    client.on("ready", () => {
        serverId = client.guilds.cache.map(guild => guild.id);
        serverId = String(serverId[0]);

        // dodaje użytkowników do mapy jeśli bot się zresetuje
        const Guild = client.guilds.cache.get(serverId);
        let onlineUsers = Guild.channels.cache.filter(element => element.type === 'GUILD_VOICE');
        let onlineUsers1 = onlineUsers.filter(element => element.members.size > 0);
        onlineUsers1.forEach(
            element1 => element1.members.forEach(
                element => {
                    const member = usersVoiceMap.get(element.user.id);
                    if (!member) {
                        const memberConstructor = {
                            id: element.user.id,
                            username: element.user.username,
                            timeStamp: Date.now(),
                        }
                        usersVoiceMap.set(element.user.id, memberConstructor);
                    }
                }
            )
        );
    });

    //co 5 minut zapisujemy wszystkich aktywnych na kanałach głosowych użykowników aby na wypadek awarii nie utracić danych z mapy
    setInterval(() => {

        (async () => {
            if (usersVoiceMap.size > 0) {
                const clientConn = new pg.Client(database);
                await clientConn.connect(err => {
                    if (err) return console.log(err);
                });

                let members = [];
                usersVoiceMap.forEach(
                    element => {
                        const timeOnVoiceChannel = parseInt((Date.now() - element.timeStamp) / 1000);
                        let result = [element.id, element.username, timeOnVoiceChannel];
                        element.timeStamp = Date.now();
                        members.push(result);
                    }
                )
                for (member of members) {
                    await clientConn
                        .query(`INSERT INTO public."VOICE_COUNTER_USERS"(id, username, time_on_voice) VALUES (${member[0]},'${member[1]}',${member[2]}) ON CONFLICT (id) DO UPDATE SET time_on_voice = public."VOICE_COUNTER_USERS".time_on_voice + ${member[2]}`)
                        .catch(err => {
                            console.log(err);
                        })
                }

                await clientConn.end();
            }
        })();


    }, 300000);


    client.on("voiceStateUpdate", (oldState, newState) => { //wydarzenia jest aktywowane jeśli ktoś dołączył/opuścił/wyciszył się na kanale głosowym
        const Guild = client.guilds.cache.get(serverId);
        // sprawdzamy czy jakiś użytkownik dołączył do kanału głosowego, jeśli tak to tworzymy dla niego mape

        if (newState.member.voice.channel != null) {
            newState.member.voice.channel.members.forEach(
                element => {
                    const member = usersVoiceMap.get(element.user.id);
                    if (!member) {
                        const memberConstructor = {
                            id: element.user.id,
                            username: element.user.username,
                            timeStamp: Date.now(),
                        }
                        usersVoiceMap.set(element.user.id, memberConstructor);
                    }
                }
            )
        }


        //sprawdzamy czy jakiś użytkownik opuścił kanał głosowy, jeśli tak to zapisujemy dane do bazy i usuwamy je z mapy usersVoiceMap
        usersVoiceMap.forEach(
            element => {
                const Member = Guild.members.cache.get(element.id);
                if (!Member.voice.channel) {
                    const clientConn = new pg.Client(database);
                    clientConn.connect(err => {
                        if (err) return console.log(err);
                    });

                    const timeOnVoiceChannel = parseInt((Date.now() - element.timeStamp) / 1000);
                    clientConn
                        .query(`INSERT INTO public."VOICE_COUNTER_USERS"(id, username, time_on_voice) VALUES (${element.id},'${element.username}',${timeOnVoiceChannel}) ON CONFLICT (id) DO UPDATE SET time_on_voice = public."VOICE_COUNTER_USERS".time_on_voice + ${timeOnVoiceChannel}`)
                        .catch(err => {
                            console.log(err);
                        })
                        .finally(() => {
                            clientConn.end();
                        });
                    element.timeStamp = Date.now();
                    usersVoiceMap.delete(element.id);
                }
            }

        );

    });
}

