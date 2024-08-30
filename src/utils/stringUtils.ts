/* eslint-disable no-param-reassign,no-shadow */
export const toTitleCase = (str: string) => {
  return str.replace(/\b\S/g, (t) => t.toUpperCase());
};

export const toNameCase = (name: string) => {
  const lowerCaseExceptions = ['de', 'la', 'von', 'van'];

  return name
    .toLowerCase()
    .split(' ')
    .map((word, index, arr) =>
      lowerCaseExceptions.includes(word) && index !== 0 && index !== arr.length - 1
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(' ');
};

export const alphaSort = (a: string, b: string) => {
  const txtA = a.toLowerCase();
  const txtB = b.toLowerCase();

  if (txtA < txtB) return -1;
  if (txtA > txtB) return 1;

  return 0;
};

/**
 * Thanks to the wonderful people on StackOverflow: https://stackoverflow.com/a/46774740
 * @param str
 * @returns {*}
 */
export const advTitleCase = (str: string) => {
  const articles = ['a', 'an', 'the'];
  const conjunctions = ['for', 'and', 'nor', 'but', 'or', 'yet', 'so'];
  const prepositions = [
    'with',
    'at',
    'from',
    'into',
    'upon',
    'of',
    'to',
    'in',
    'for',
    'on',
    'by',
    'like',
    'over',
    'plus',
    'but',
    'up',
    'down',
    'off',
    'near',
  ];

  // The list of spacial characters can be tweaked here
  const replaceCharsWithSpace = (str: string) => str.replace(/[^0-9a-z&/\\]/gi, ' ').replace(/(\s\s+)/gi, ' ');
  const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.substr(1);
  const normalizeStr = (str: string) => str.toLowerCase().trim();
  const shouldCapitalize = (word: string, fullWordList: string[], posWithinStr: number) => {
    if (posWithinStr === 0 || posWithinStr === fullWordList.length - 1) {
      return true;
    }

    return !(articles.includes(word) || conjunctions.includes(word) || prepositions.includes(word));
  };

  str = replaceCharsWithSpace(str);
  str = normalizeStr(str);

  let words = str.split(' ');
  if (words.length <= 2) {
    // Strings less than 3 words long should always have first words capitalized
    words = words.map((w: string) => capitalizeFirstLetter(w));
  } else {
    for (let i = 0; i < words.length; i += 1) {
      words[i] = shouldCapitalize(words[i], words, i) ? capitalizeFirstLetter(words[i]) : words[i];
    }
  }

  return words.join(' ');
};

export const replaceClassName = (className: string, replacement: string, source?: string) => {
  const escapedClassName = className.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedClassName, 'g');
  return source?.replace(regex, replacement);
};
