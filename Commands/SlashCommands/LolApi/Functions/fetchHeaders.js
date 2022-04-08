const lolApiToken = process.env.LOL_TOKEN;


export default {
    headers: {
        "X-Riot-Token": lolApiToken
    }
}
