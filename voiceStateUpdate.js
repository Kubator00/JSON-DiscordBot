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

    //co 5 minut zapisujemy wszystkich aktywnych na kanałach głosowych użykowników aby na wypadek awarii nie utracić danych z mapy
    setInterval(() => { 
            usersVoiceMap.forEach(
                element => {
                    const clientConn = new pg.Client(database);
                    clientConn.connect(err => {
                        if (err) return console.log(err);
                    });
                    const timeOnVoiceChannel = parseInt((Date.now() - element.timeStamp) / 1000);
                    clientConn
                        .query(`INSERT INTO public."VOICE_COUNTER_USERS"(id, username, time_on_voice) VALUES (${element.id},'${element.username}',${timeOnVoiceChannel}) ON CONFLICT (id) DO UPDATE SET time_on_voice = public."VOICE_COUNTER_USERS".time_on_voice + ${timeOnVoiceChannel}`)
                        .then(res => {
                            console.log('Table is successfully created');
                        })
                        .catch(err => {
                            console.log(err);
                        })
                        .finally(() => {
                            clientConn.end();
                            console.log("Polaczenie zakonczone");
                        });
                    element.timeStamp = Date.now();
                }
            );

    }, 300000);


    client.on("voiceStateUpdate", (oldState, newState) => { //wydarzenia jest aktywowane jeśli ktoś dołączył/opuścił/wyciszył się na kanale głosowym
        const Guild = client.guilds.cache.get("440616514090172449");
        
        // sprawdzamy czy jakiś użytkownik dołączył do kanału głosowego, jeśli tak to tworzymy dla niego mape
        try {
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
        }
        catch { console.log("Wyjscie lub blad") }

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
                        .then(res => {
                            console.log('Table is successfully created');
                            clientConn.end();
                        })
                        .catch(err => {
                            console.log(err);
                        })
                        .finally(() => {
                            clientConn.end();
                            console.log("Polaczenie zakonczone");
                        });
                    element.timeStamp = Date.now();
                    usersVoiceMap.delete(element.id);
                }
            }

        );

    });
}