export function parseImperialLength(input: string): number | null {
  const feetUnits = ['feet', 'foot', 'ft', 'f', "'"];
  const inchesUnits = ['inches', 'inch', 'in', 'i', '"'];
  const validChars = new RegExp(`^[0-9\\s./,${feetUnits.join('')}${inchesUnits.join('')}]*$`);

  if (!validChars.test(input)) {
    return null;
  }

  // Remove trailing whitespace
  input = input.trim();

  // Check if the last character is a '/'
  if (input.endsWith('/')) {
    return null;
  }

  // Check for multiple '/' characters in the input
  if ((input.match(/\//g) || []).length > 1) {
    return null;
  }

  // Check if input has more than one 'feet' or 'inches' unit
  let feetUnitCount = 0;
  for (let i = 0; i < feetUnits.length; i++) {
    const substring = feetUnits[i];
    let startIndex = 0;
    let found = false;

    while (startIndex < input.length) {
      const index = input.indexOf(substring, startIndex);
      if (index !== -1) {
        const isOverlapping = input.slice(startIndex, index).indexOf(substring) !== -1;
        if (!isOverlapping) {
          feetUnitCount++;
          startIndex = index + substring.length;
          found = true;
        } else {
          startIndex = index + 1;
        }
      } else {
        break;
      }
    }

    if (found) {
      break;
    }
  }

  let inchesUnitCount = 0;
  for (let i = 0; i < inchesUnits.length; i++) {
    const substring = inchesUnits[i];
    let startIndex = 0;
    let found = false;

    while (startIndex < input.length) {
      const index = input.indexOf(substring, startIndex);
      if (index !== -1) {
        const isOverlapping = input.slice(startIndex, index).indexOf(substring) !== -1;
        if (!isOverlapping) {
          inchesUnitCount++;
          startIndex = index + substring.length;
          found = true;
        } else {
          startIndex = index + 1;
        }
      } else {
        break;
      }
    }

    if (found) {
      break;
    }
  }

  if (feetUnitCount > 1 || inchesUnitCount > 1) {
    return null;
  }

  let numbers;

  try {
    numbers = input
      .split(/[^0-9/.]+/)
      .filter(Boolean)
      .map((value) => {
        // return value.indexOf('/') !== -1 ? parseFloat(value.split('/')[0]) / parseFloat(value.split('/')[1]) : parseFloat(value);
        if (value.indexOf('/') !== -1) {
          const [numerator, denominator] = value.split('/').map(Number);
          if (denominator === 0) {
            throw new Error('Denominator cannot be zero');
          }
          return numerator / denominator;
        }
        return parseFloat(value);
      });
  } catch (e) {
    return null;
  }

  const feetFlag = feetUnits.some((unit) => input.indexOf(unit) !== -1);
  const inchesFlag = inchesUnits.some((unit) => input.indexOf(unit) !== -1);
  let total = 0;

  if (numbers.length === 1) {
    total = inchesFlag ? numbers[0] / 12 : numbers[0];
  } else if (numbers.length === 2) {
    if (numbers[1] < 1 && inchesFlag) {
      total = (numbers[0] + numbers[1]) / 12;
    } else {
      total = numbers[0] + numbers[1] / 12;
    }
  } else if (numbers.length === 3) {
    if (feetFlag && inchesFlag) {
      total = numbers[0] + numbers[1] / 12 + numbers[2] / 12;
    } else {
      return null;
    }
  } else {
    return null;
  }

  if (Number.isNaN(total)) {
    return null;
  }

  return total;
}
