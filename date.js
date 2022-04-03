module.exports = { minute, hour, day_message, day_of_the_week, full_day_message }

//tylko godzina
function hour() {
  var date = new Date();
  var hour = date.getHours();
  if (hour == 24)
    hour = "0";
  if (hour < 10)
    hour = "0" + hour;
  return hour;
}
//tylko minuta
function minute() {
  var date = new Date();
  var minute = date.getMinutes();
  if (minute < 10)
    minute = "0" + minute;
  return minute;
}

//data + pełna nazwa miesiąca + rok
function full_day_message() {
  var date = new Date();
  var fullMonth = full_month();

  return date.getDate() + " " + fullMonth + " " + date.getFullYear() + "r.";
}

//data liczbowo
function day_message() {
  var date = new Date();
  var month = Number.parseInt(date.getMonth()) + 1;
  return date.getDate() + "." + month + "." + date.getFullYear() + "r.";
}


//nazwa dnia tygodnia, tytul kanalu glosowego
function day_of_the_week() {
  var date = new Date();
  var dayOfTheWeek = date.getDay();
  switch (dayOfTheWeek) {
    case 0:
      dayOfTheWeek = "Niedziela";
      break;
    case 1:
      dayOfTheWeek = "Poniedziałek";
      break;
    case 2:
      dayOfTheWeek = "Wtorek";
      break;
    case 3:
      dayOfTheWeek = "Środa";
      break;
    case 4:
      dayOfTheWeek = "Czwartek";
      break;
    case 5:
      dayOfTheWeek = "Piątek";
      break;
    case 6:
      dayOfTheWeek = "Sobota";
      break;
    default:
      dayOfTheWeek = "";
  }

  return dayOfTheWeek;
}




