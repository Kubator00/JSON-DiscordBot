export function hourAsString() {
    const date = new Date();
    let hour = date.getHours();
    if (hour === 24)
        hour = '0';
    if (hour < 10)
        hour = '0' + hour;
    return hour;
}

export function minute() {
    return new Date().getMinutes();
}

export function fullDay() {
    return new Date().getUTCDate();
}

export function dayOfTheWeek() {
    const dayOfTheWeek = new Date().getDay();
    const daysOfTheWeek = ['Niedziela', 'Poniedzialek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
    return daysOfTheWeek[dayOfTheWeek];
}




