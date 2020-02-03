export const calculate_age = dob => {
  var diff_ms = Date.now() - dob.getTime();
  var age_dt = new Date(diff_ms);
  return Math.abs(age_dt.getUTCFullYear() - 1970);
};

export const getReadableDate = date => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  let current_datetime = new Date(date);
  let formatted_date =
    current_datetime.getDate() +
    " " +
    months[current_datetime.getMonth()] +
    " " +
    current_datetime.getFullYear();
  return formatted_date;
};

export const getDayofWeek = day => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];
  return days[day];
};

export const getTime = datetime => {
  const time = new Date(datetime);
  return `${time.getUTCHours()}:${time.getUTCMinutes()}:00`;
};

export const getDateFromDay = day => {
  var date = new Date();
  var diff =
    date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1) + day;
  date = new Date(date.setDate(diff));
  var date_num = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  var month_num =
    date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  return date.getFullYear() + "-" + month_num + "-" + date_num;
};
