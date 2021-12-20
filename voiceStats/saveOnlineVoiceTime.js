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

    client.on("ready", () => {
        // dodaje użytkowników do mapy jeśli bot się zresetuje
        for (guildId of client.guilds.cache.map(guild => guild.id)) {
            const guild = client.guilds.cache.get(guildId);
            let voiceChannels = (guild.channels.cache.filter(element => element.type === 'GUILD_VOICE')).filter(element => element.members.size > 0);
            voiceChannels.forEach(
                element1 => element1.members.forEach(
                    element => {
                        const member = usersVoiceMap.get(element.user.id);
                        if (!member) {
                            const memberConstructor = {
                                id_guild: element.guild.id,
                                id: element.user.id,
                                username: element.user.username,
                                nickname: element.nickname,
                                timeStamp: Date.now(),
                            }
                            usersVoiceMap.set(element.user.id, memberConstructor);
                        }
                    }
                )
            );
        }
    });

    //co 10 minut zapisujemy wszystkich aktywnych na kanałach głosowych użykowników aby na wypadek awarii nie utracić danych z mapy
    setInterval(() => {

        (async () => {
            if (usersVoiceMap.size > 0) {
                const clientConn = new pg.Client(database);
                await clientConn.connect(err => {
                    if (err) return console.log(err);
                });
                //wszystkie dane z mapy zapisuje do tablicy poniewaz inaczej nie jestem w stanie wywolac zapisu do bazy danych przez async/await

                let members = [];
                usersVoiceMap.forEach(
                    element => {
                        let result = {
                            id_guild: element.id_guild,
                            id: element.id,
                            username: element.username,
                            timeOnVoiceChannel: parseInt((Date.now() - element.timeStamp) / 1000)
                        };
                        element.timeStamp = Date.now();
                        members.push(result);
                    }
                )
                for (member of members) {
                    await clientConn
                        .query(`
                        DO $$
                        BEGIN
                            IF EXISTS (SELECT * FROM public."VOICE_COUNTER_USERS" WHERE id_discord = '${member.id}' AND id_guild = '${member.id_guild}') THEN
                                UPDATE public."VOICE_COUNTER_USERS" SET time_on_voice=time_on_voice+${member.timeOnVoiceChannel} WHERE (id_discord='${member.id}' AND id_guild='${member.id_guild}');
                            ELSE
                                INSERT INTO public."VOICE_COUNTER_USERS"(id_guild, id_discord, username, time_on_voice) VALUES ('${member.id_guild}','${member.id}','${member.username}',${member.timeOnVoiceChannel});
                        END IF;
                        END $$;`)
                        .catch(err => {
                            console.log(err);
                        })
                        .finally(console.log(`Zapis do bazy VOICE_COUNTER_USERS  ${member.username}, czas: ${member.timeOnVoiceChannel}`));
                }
                await clientConn.end();
            }
        })();

    }, 60000 * 10);


    client.on("voiceStateUpdate", (oldState, newState) => { //wydarzenia jest aktywowane jeśli ktoś dołączył/opuścił/wyciszył się na kanale głosowym

        // sprawdzamy czy jakiś użytkownik dołączył do kanału głosowego, jeśli tak to tworzymy dla niego mape
        if (newState.member.voice.channel != null) {
            newState.member.voice.channel.members.forEach(
                element => {
                    const member = usersVoiceMap.get(element.user.id);
                    if (!member) {
                        const memberConstructor = {
                            id_guild: element.guild.id,
                            id: element.user.id,
                            username: element.user.username,
                            timeStamp: Date.now(),
                        }
                        usersVoiceMap.set(element.user.id, memberConstructor);
                    }
                }
            )
        }
        const guild = client.guilds.cache.get(newState.guild.id);
        //sprawdzamy czy jakiś użytkownik opuścił kanał głosowy, jeśli tak to zapisujemy dane do bazy i usuwamy je z mapy usersVoiceMap
        usersVoiceMap.forEach(
            element => {
                const member = guild.members.cache.get(element.id);
                if (member && member.guild.id == element.id_guild) { //jesli member jest nullem to nie dotyczy tego serwera
                    if (!member.voice.channel) {
                        const clientConn = new pg.Client(database);
                        clientConn.connect(err => {
                            if (err) return console.log(err);
                        });

                        const timeOnVoiceChannel = parseInt((Date.now() - element.timeStamp) / 1000);
                        clientConn
                            .query(`
                    DO $$
                    BEGIN
                        IF EXISTS (SELECT * FROM public."VOICE_COUNTER_USERS" WHERE id_discord = '${element.id}' AND id_guild = '${element.id_guild}') THEN
                            UPDATE public."VOICE_COUNTER_USERS" SET time_on_voice=time_on_voice+${timeOnVoiceChannel} WHERE (id_discord='${element.id}' AND id_guild='${element.id_guild}');
                        ELSE
                            INSERT INTO public."VOICE_COUNTER_USERS"(id_guild, id_discord, username, time_on_voice) VALUES ('${element.id_guild}','${element.id}','${element.username}',${timeOnVoiceChannel});
                    END IF;
                    END $$;`
                            )
                            .catch(err => {
                                console.log(err);
                            })
                            .finally(() => {
                                console.log(`Uzytkownik  ${element.username} opuscil kanal czas: ${timeOnVoiceChannel}, zapis do bazy VOICE_COUNTER_USERS `);
                                clientConn.end();
                                element.timeStamp = Date.now();
                            });
                        usersVoiceMap.delete(element.id);
                    }
                }
            }
        );
    });
}

