import poolDB from '../../Database/databaseConn.js';
import {usersVoiceMap} from "../saveOnlineVoiceTime.js";

export default async (client) => {
    client.on("voiceStateUpdate", (oldState, newState) => {

        const guild = client.guilds.cache.get(newState.guild.id);
        //sprawdzamy czy jakiś użytkownik opuścił kanał głosowy, jeśli tak to zapisujemy dane do bazy i usuwamy je z mapy usersVoiceMap
        usersVoiceMap.forEach(
            element => {
                const member = guild.members.cache.get(element.id);
                if (member && member.guild.id === element.id_guild) { //jesli member jest nullem to nie dotyczy tego serwera
                    if (!member.voice.channel) {
                        const timeOnVoiceChannel = parseInt((Date.now() - element.timeStamp) / 1000);
                        (async () => {
                            let clientConn;
                            try {
                                clientConn = await poolDB.connect();
                                await clientConn.query(saveDatabaseQuery(element, timeOnVoiceChannel));
                                await clientConn.query(saveDatabaseQueryLast7Days(element, timeOnVoiceChannel));
                                console.log(`Uzytkownik  ${element.id} opuscil kanal czas: ${timeOnVoiceChannel}, zapis do bazy VOICE_COUNTER_USERS `);
                            } catch (err) {
                                console.log(err);
                            } finally {
                                clientConn?.release();
                            }
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

const saveDatabaseQueryLast7Days = (element, timeOnVoiceChannel) => {
    const today = new Date().toISOString().slice(0,10);
    return (
        `DO $$
    BEGIN
    IF EXISTS (SELECT * FROM public."VOICE_COUNTER_USERS_LAST_7_DAYS" WHERE id_discord = '${element.id}' AND id_guild = '${element.id_guild}' AND date='${today}') THEN
    UPDATE public."VOICE_COUNTER_USERS_LAST_7_DAYS" SET time_on_voice=time_on_voice+${timeOnVoiceChannel} WHERE (id_discord='${element.id}' AND id_guild='${element.id_guild}' AND date='${today}');
    ELSE
    INSERT INTO public."VOICE_COUNTER_USERS_LAST_7_DAYS"(id_guild, id_discord, time_on_voice) VALUES ('${element.id_guild}','${element.id}',${timeOnVoiceChannel});
    END IF;
    END $$;`)
}

const saveDatabaseQuery = (element, timeOnVoiceChannel) => {
    return (
        `DO $$
    BEGIN
        IF EXISTS (SELECT * FROM public."VOICE_COUNTER_USERS" WHERE id_discord = '${element.id}' AND id_guild = '${element.id_guild}') THEN
            UPDATE public."VOICE_COUNTER_USERS" SET time_on_voice=time_on_voice+${timeOnVoiceChannel} WHERE (id_discord='${element.id}' AND id_guild='${element.id_guild}');
        ELSE
            INSERT INTO public."VOICE_COUNTER_USERS"(id_guild, id_discord, time_on_voice) VALUES ('${element.id_guild}','${element.id}',${timeOnVoiceChannel});
        END IF;
END $$;`)
}
