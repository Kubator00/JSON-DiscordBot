import fetch from "node-fetch";
import {checkResponseStatusMsg, defaultErrorMsg, LolError} from "./lolCommonFunctions.js";

export default async function fetchData(url, headers) {
    let result;
    try {
        if (headers)
            result = await fetch(url, headers);
        else
            result = await fetch(url);
    } catch (err) {
        console.error(err);
        throw new LolError(defaultErrorMsg);
    }
    try {
        checkResponseStatusMsg(result.status);
    } catch (err) {
        console.error(err);
        throw err;
    }
    return result;
}