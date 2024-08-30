export const get12Hour = (time: string) => {
  if (time === '') {
    return '';
  }

  const hourInt = parseInt(time.substring(0, 2));
  if (hourInt === 0) {
    return `12:${time.substring(3)}`;
  }

  if (hourInt > 12) {
    const prepend = hourInt - 12 < 10 ? '0' : '';

    return `${prepend}${hourInt - 12}:${time.substring(3)}`;
  } else {
    return time;
  }
};

export const getPeriod = (time: string) => {
  if (!time) {
    return '';
  }

  const hourInt = parseInt(time.substring(0, 2));
  if (hourInt < 12) {
    return 'am';
  } else {
    return 'pm';
  }
};

export const get24Hour = (time: string, period: string) => {
  if (!period) {
    console.warn(`param 'period' is missing, returning main time value`);
    return time;
  }

  if (period.toLowerCase() === 'am') {
    if (/12:\d\d/.test(time)) {
      return time.replace('12', '00');
    } else {
      return time;
    }
  }

  if (period.toLowerCase() === 'pm') {
    const hoursInt = parseInt(time.substring(0, 2));
    if (hoursInt === 12) {
      return time;
    } else {
      return `${hoursInt + 12}:${time.substring(3)}`;
    }
  }

  return time;
};

export const getUpdated12HourTime = (oldTime: string, newTime: string) => {
  const validChars = /^(1[0-2]|0[1-9])?:?[0-5]?[0-9]?$/.test(newTime);
  if (!validChars) return null;

  // Find where the string has been updated
  const newCharIdx = [...newTime].findIndex((ch, i) => ch !== oldTime[i]);
  const newChar = newTime[newCharIdx];

  let updTime = '';
  if (newTime.length === 1) {
    // Don't let users manually type a :
    if (newChar === ':') {
      updTime = '';
    }

    // 1st character must be a 0-1
    if (/[0-1]/.test(newChar)) {
      updTime = newTime;
    }
    // OR 2-9, pre-pend 0 and add :
    if (/[2-9]/.test(newChar)) {
      updTime = `0${newChar}:`;
    }
  }

  console.log('NEW TIME: ', { len: newTime.length, newTime });

  // 2rd character must be 0-9
  // If the length is 2, then we're entering the second hour field
  // which should be 0-9. We should automatically add a colon to the end
  if (newTime.length === 2) {
    if (newTime.length < oldTime.length) {
      return newTime;
    }

    if (/[0-9]/.test(newChar) && newTime !== '00' && !(newTime[0] === '1' && newChar > '2')) {
      updTime = `${newTime}:`;
    } else {
      return oldTime;
    }

    // Don't let users manually type a :
    if (newChar === ':') {
      updTime = newTime[0];
    }
  }

  // If the length is 3, then the last item should be a colon
  if (newTime.length > 2 && newTime.length < 5) {
    const cIdx = [...newTime].findIndex((ch) => ch === ':');

    if (cIdx > 0) {
      const splitTime = newTime.split(':');
      if (splitTime[1] && !/[0-5]/.test(splitTime[1])) {
        // Add this line
        return oldTime;
      }
      updTime = `${splitTime[0]}:${splitTime[1]}`;
    } else {
      updTime = `${newTime.substring(0, 2)}:${newTime.substring(2)}`;
    }
  }

  if (newTime.length === 5) {
    const validTime = /^(1[0-2]|0?[1-9]):[0-5][0-9]$/.test(newTime);
    if (!validTime) {
      return null;
    }

    if (/[0-9]/.test(newChar)) {
      updTime = newTime;
    }
  }

  return updTime;
};
