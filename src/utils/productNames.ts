export const getShortName = (model: string) => {
  if (!model) return '';

  let shortName = 'Unknown';

  if (model === 'gateway') shortName = 'Connect';
  else if (model === 'basic purifier') shortName = 'Air';
  else if (model === 'advanced purifier') shortName = 'Air+';
  else if (model === 'sensor') shortName = 'Sense+';

  return shortName;
};

export const getLongName = (model: string) => {
  if (!model) return '';

  let longName = 'Unknown';

  if (model === 'gateway') longName = 'WellCube Connect';
  else if (model === 'basic purifier') longName = 'WellCube Air';
  else if (model === 'advanced purifier') longName = 'WellCube Air+';
  else if (model === 'sensor') longName = 'WellCube Sense+';

  return longName;
};
