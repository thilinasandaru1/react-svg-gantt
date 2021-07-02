const YEAR = "year";
const MONTH = "month";
const DAY = "day";
const HOUR = "hour";
const MINUTE = "minute";
const SECOND = "second";
const MILLISECOND = "millisecond";

export const diff = (date_a, date_b, scale = DAY) => {
  let milliseconds, seconds, hours, minutes, days, months, years;

  milliseconds = date_a - date_b;
  seconds = milliseconds / 1000;
  minutes = seconds / 60;
  hours = minutes / 60;
  days = hours / 24;
  months = days / 30;
  years = months / 12;

  if (!scale.endsWith("s")) {
    scale += "s";
  }

  return Math.floor(
    {
      milliseconds,
      seconds,
      minutes,
      hours,
      days,
      months,
      years,
    }[scale]
  );
};

export const today = () => {
  const vals = this.get_date_values(new Date()).slice(0, 3);
  return new Date(...vals);
};

export const now = () => {
  return new Date();
};

export const startOf = (date, scale) => {
  const scores = {
    [YEAR]: 6,
    [MONTH]: 5,
    [DAY]: 4,
    [HOUR]: 3,
    [MINUTE]: 2,
    [SECOND]: 1,
    [MILLISECOND]: 0,
  };

  function should_reset(_scale) {
    const max_score = scores[scale];
    return scores[_scale] <= max_score;
  }

  const vals = [
    date.getFullYear(),
    should_reset(YEAR) ? 0 : date.getMonth(),
    should_reset(MONTH) ? 1 : date.getDate(),
    should_reset(DAY) ? 0 : date.getHours(),
    should_reset(HOUR) ? 0 : date.getMinutes(),
    should_reset(MINUTE) ? 0 : date.getSeconds(),
    should_reset(SECOND) ? 0 : date.getMilliseconds(),
  ];
  return new Date(...vals);
};

export const clone = (date) => {
  return new Date(...get_date_values(date));
};

export const get_date_values = (date) => {
  const _date = new Date(date);
  return [
    _date.getFullYear(),
    _date.getMonth(),
    _date.getDate(),
    _date.getHours(),
    _date.getMinutes(),
    _date.getSeconds(),
  ];
};

export const getDaysInMonth = (date) => {
  const no_of_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const month = date.getMonth();

  if (month !== 1) {
    return no_of_days[month];
  }

  // Feb
  const year = date.getFullYear();
  if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
    return 29;
  }
  return 28;
};
