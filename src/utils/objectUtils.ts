export const replaceObjectPropertyByValue = (obj: any, searchValue: string, newKey: string) => {
  const filteredKeys = Object.keys(obj).filter((key) => obj[key] === searchValue);
  if (!filteredKeys.length) return obj;

  const { [filteredKeys[0]]: toReplace, ...rest } = obj;
  //deletes duplicate keys
  filteredKeys.forEach((key) => delete rest[key]);

  return { [newKey]: toReplace, ...rest };
};

export const isEmptyObject = (obj: any) => {
  if (obj === null || obj === undefined) {
    return true;
  }

  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

export const getKeyByValue = <T>(value: T, map: Record<string, T>): string | undefined => {
  for (const [key, val] of Object.entries(map)) {
    if (val === value) {
      return key;
    }
  }
  return undefined;
};

interface DataItem {
  id: string;
  name: string;
  depth?: number;
  [key: string]: any;
}

interface GroupedItem {
  id: string;
  label: string;
  depth?: number;
  children: GroupedItem[];
}

export const groupBy = <T extends GroupedItem>(
  data: DataItem[],
  parentPropName: string, // The dynamic property name for parentId lookup
  builder: (item: DataItem) => T,
  isRootCallback: (obj: T) => boolean,
): T[] => {
  const groups: { [key: string]: T } = {};

  data.forEach((item) => {
    groups[item.id] = builder(item);
  });

  data.forEach((item) => {
    const parentId = item[parentPropName];
    if (parentId !== null && parentId !== undefined) {
      const parent = groups[parentId];
      if (parent) {
        parent.children.push(groups[item.id]);
      }
    }
  });

  // Filter out the children that are not roots and return only the root parents
  return Object.values(groups).filter(isRootCallback);
};

export const arrayToObject = <T extends TObject>(array: T[]) => {
  const result: Record<string, T[keyof T]> = {};

  return array.reduce((data, item) => {
    data[item.key] = item.value;
    return data;
  }, result);
};
