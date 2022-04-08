import poolDB from '../../Database/databaseConn.js';
import {usersVoiceMap} from "../saveOnlineVoiceTime.js";

export default async () => {
    setInterval(() => {
        (async () => {
            if (usersVoiceMap.size > 0) {
                const clientConn = await poolDB.connect();
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
                for (let member of members) {
                    try {
                        await clientConn.query(`
                    DO $$
                    BEGIN
                        IF EXISTS (SELECT * FROM public."VOICE_COUNTER_USERS" WHERE id_discord = '${member.id}' AND id_guild = '${member.id_guild}') THEN
                            UPDATE public."VOICE_COUNTER_USERS" SET time_on_voice=time_on_voice+${member.timeOnVoiceChannel} WHERE (id_discord='${member.id}' AND id_guild='${member.id_guild}');
                        ELSE
                            INSERT INTO public."VOICE_COUNTER_USERS"(id_guild, id_discord, time_on_voice) VALUES ('${member.id_guild}','${member.id}',${member.timeOnVoiceChannel});
                    END IF;
                    END $$;`)
                    } catch (err) {
                        console.log(err);
                        continue;
                    }
                    console.log(`Zapis do bazy VOICE_COUNTER_USERS  ${member.id}, czas: ${member.timeOnVoiceChannel}s`);
                }
                clientConn?.release();
            }

        })();
    }, 60000 * 10);
}