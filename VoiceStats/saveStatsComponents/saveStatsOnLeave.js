import poolDB from '../../Database/conn.js';
import {usersVoiceMap} from "../saveOnlineVoiceTime.js";

export default async (client) => {
    client.on("voiceStateUpdate", (oldState, newState) => {
        checkIfSomeoneLeftVoiceChannel(client, newState);
        checkIfSomeoneJoinVoiceChannel(newState);
    });
}

const checkIfSomeoneJoinVoiceChannel = (newState) => {
    if (!newState.member.voice.channel)
        return;
    newState.member.voice.channel.members.forEach(
        element => {
            const member = usersVoiceMap.get(element.user.id);
            if (member)
                return;
            const memberConstructor = {
                id_guild: element.guild.id,
                id: element.user.id,
                timeStamp: Date.now(),
            }
            usersVoiceMap.set(element.user.id, memberConstructor);
        }
    )
}

const checkIfSomeoneLeftVoiceChannel = (client, newState) => {
    const guild = client.guilds.cache.get(newState.guild.id);
    usersVoiceMap.forEach(
        element => {
            const member = guild.members.cache.get(element.id);
            if (!member || member.guild.id !== element.id_guild || member.voice.channel)
                return;
            (async () => {
                await insertToDatabase(element);
                element.timeStamp = Date.now();
                usersVoiceMap.delete(element.id);
            })();
        }
    );
}

const insertToDatabase = async (user) => {
    let clientConn;
    const timeOnVoiceChannel = parseInt((Date.now() - user.timeStamp) / 1000);
    try {
        clientConn = await poolDB.connect();
        await clientConn.query(saveDatabaseQuery(user, timeOnVoiceChannel));
        await clientConn.query(saveDatabaseQueryLast7Days(user, timeOnVoiceChannel));
        console.log(`Uzytkownik  ${user.id} opuscil kanal czas: ${timeOnVoiceChannel}, zapis do bazy VOICE_COUNTER_USERS `);
    } catch (err) {
        console.log(err);
    } finally {
        clientConn?.release();
    }
}

const saveDatabaseQueryLast7Days = (element, timeOnVoiceChannel) => {
    const today = new Date().toISOString().slice(0, 10);
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
