const pg = require('pg');
const connect_database = require('../Database/databaseConn.js');
const database = connect_database();
let usersVoiceMap = new Map();

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
                                INSERT INTO public."VOICE_COUNTER_USERS"(id_guild, id_discord, time_on_voice) VALUES ('${member.id_guild}','${member.id}',${member.timeOnVoiceChannel});
                        END IF;
                        END $$;`)
                        .catch(err => {
                            console.log(err);
                        })
                        .finally(console.log(`Zapis do bazy VOICE_COUNTER_USERS  ${member.id}, czas: ${member.timeOnVoiceChannel}s`));
                }
                await clientConn.end();
            }
        })();

    }, 60000 * 10);


    client.on("voiceStateUpdate", (oldState, newState) => { //wydarzenia jest aktywowane jeśli ktoś dołączył/opuścił/wyciszył się na kanale głosowym
        const guild = client.guilds.cache.get(newState.guild.id);
        //sprawdzamy czy jakiś użytkownik opuścił kanał głosowy, jeśli tak to zapisujemy dane do bazy i usuwamy je z mapy usersVoiceMap
        usersVoiceMap.forEach(
            element => {
                const member = guild.members.cache.get(element.id);
                if (member && member.guild.id == element.id_guild) { //jesli member jest nullem to nie dotyczy tego serwera
                    if (!member.voice.channel) {
                        const timeOnVoiceChannel = parseInt((Date.now() - element.timeStamp) / 1000);
                        (async () => {
                            const clientConn = new pg.Client(database);
                            try {

                                await clientConn.connect();
                                await clientConn
                                    .query(`
                    DO $$
                    BEGIN
                        IF EXISTS (SELECT * FROM public."VOICE_COUNTER_USERS" WHERE id_discord = '${element.id}' AND id_guild = '${element.id_guild}') THEN
                            UPDATE public."VOICE_COUNTER_USERS" SET time_on_voice=time_on_voice+${timeOnVoiceChannel} WHERE (id_discord='${element.id}' AND id_guild='${element.id_guild}');
                        ELSE
                            INSERT INTO public."VOICE_COUNTER_USERS"(id_guild, id_discord, time_on_voice) VALUES ('${element.id_guild}','${element.id}',${timeOnVoiceChannel});
                    END IF;
                    END $$;`
                                    )
                            }
                            catch (err) {
                                console.log(err);
                            }
                            await clientConn.end();
                            console.log(`Uzytkownik  ${element.id} opuscil kanal czas: ${timeOnVoiceChannel}, zapis do bazy VOICE_COUNTER_USERS `);
                            element.timeStamp = Date.now();
                            usersVoiceMap.delete(element.id);
                        })();
                    }
                }

            }
        );

        // sprawdzamy czy jakiś użytkownik dołączył do kanału głosowego, jeśli tak to tworzymy dla niego mape
        if (newState.member.voice.channel != null) {
            newState.member.voice.channel.members.forEach(
                element => {
                    const member = usersVoiceMap.get(element.user.id);
                    if (!member) {
                        const memberConstructor = {
                            id_guild: element.guild.id,
                            id: element.user.id,
                            timeStamp: Date.now(),
                        }

                        usersVoiceMap.set(element.user.id, memberConstructor);
                    }
                }
            )
        }
      
    });
}

