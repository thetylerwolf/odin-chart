import { DateTime } from 'luxon';

export default function (date = new Date(), options = {}) {
  const { part = 'datetime', amount = 0, unit = 'days' } = options;

  let result;

  if (amount > 0) {
    result = DateTime.fromISO(date).plus({ [unit]: amount });
  } else if (amount < 0) {
    result = DateTime.fromISO(date).minus({ [unit]: -1 * amount });
  } else {
    result = DateTime.fromISO(date);
  }

  if (part === 'date') {
    return result.toLocaleString(DateTime.DATE_MED);
  } else if (part === 'time') {
    return result.toLocaleString(DateTime.TIME_WITH_SECONDS);
  }

  return result.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
}
