const pg = require('pg');
const connect_database = require('../../../../Database/databaseConn.js');

module.exports = (players, guildId) => {

    const conn = connect_database()
    const clientConn = new pg.Client(conn);

    (async () => {
        await clientConn.connect(err => {
            if (err) return console.log(err);
        });

        for (player of players) {
            await clientConn
                .query(`
        DO $$
        BEGIN
            IF EXISTS (SELECT * FROM public."LOL_QUOTES_STATS" WHERE id_discord = '${player.id}' AND id_guild = '${guildId}') THEN
                UPDATE public."LOL_QUOTES_STATS" SET correct_answers=correct_answers+${player.correctAnswers},wrong_answers=wrong_answers+${player.wrongAnswers} WHERE (id_discord='${player.id}' AND id_guild='${guildId}');
            ELSE
                INSERT INTO public."LOL_QUOTES_STATS"(id_guild, id_discord, correct_answers, wrong_answers) VALUES ('${guildId}','${player.id}',${player.correctAnswers},${player.wrongAnswers});
            END IF;
        END $$;`
                )
                .catch(err => {
                    console.log(err);
                })
        }
        await clientConn.end();

    })();
}