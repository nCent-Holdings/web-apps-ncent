export const createSearchValues = (search: string, searchFilter: string, separator = ',') => {
  let result = '';
  let searchQuery = '';
  if (!search && !searchFilter) return searchQuery;

  const searchObj = (words: string) =>
    words
      .split(separator)
      .map((word) =>
        [`(name==*${word}*)`, `(wellcube/device.asset_id==*${word}*)`, `(wellcube/location.full_path==*${word}*)`].join(
          '|',
        ),
      )
      .join('|');

  const filterObj = (id: string) => `(wellcube/device.space_id==${id})`;

  if (search) {
    searchQuery = `(${searchObj(search)})`;
  }

  let resultFilter = '';

  if (searchFilter) {
    resultFilter = searchFilter
      .split(separator)
      .map((id) => {
        return filterObj(id);
      })
      .join('|');

    resultFilter = `(${resultFilter})`;
  }

  result = [searchQuery, resultFilter].filter((x) => x).join('.');

  //console.log('result NVA:', result);

  return result;
};
