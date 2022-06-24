import poolDB from '../../Database/conn.js';
import {usersVoiceMap} from "../saveOnlineVoiceTime.js";
// inserts into database stats in interval to secure data during unexpected events
export default async () => {
    setInterval(() => {
        (async () => {
            if (usersVoiceMap.size < 1)
                return;
            let members = copyUsersDataToArray();
            const clientConn = await poolDB.connect();
            for (let member of members) {
                await insertStatsIntoDb(clientConn, member);
                await insertStatsFromLast7DaysIntoDb(clientConn, member);
                console.log(`Inserted into VOICE_COUNTER_USERS  ${member.id}, time: ${member.timeOnVoiceChannel}s`);
            }
            clientConn?.release();
        })();
    }, 60000 * 10);
}

const copyUsersDataToArray = () => {
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
    return members;
}

const insertStatsIntoDb = async (clientConn, member) => {
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
    }
}

const insertStatsFromLast7DaysIntoDb = async (clientConn, member) => {
    const today = new Date().toISOString().slice(0, 10);
    try {
        await clientConn.query(`
                    DO $$
                    BEGIN
                        IF EXISTS (SELECT * FROM public."VOICE_COUNTER_USERS_LAST_7_DAYS" WHERE id_discord = '${member.id}' AND id_guild = '${member.id_guild}' AND date='${today}') THEN
                            UPDATE public."VOICE_COUNTER_USERS_LAST_7_DAYS" SET time_on_voice=time_on_voice+${member.timeOnVoiceChannel} WHERE (id_discord='${member.id}' AND id_guild='${member.id_guild}' AND date='${today}');
                        ELSE
                            INSERT INTO public."VOICE_COUNTER_USERS_LAST_7_DAYS"(id_guild, id_discord, time_on_voice) VALUES ('${member.id_guild}','${member.id}',${member.timeOnVoiceChannel});
                    END IF;
                    END $$;`)
    } catch (err) {
        console.log(err);
    }
}