import { SortingFns } from '@tanstack/table-core';
import { SortingFn } from '@tanstack/react-table';

declare module '@tanstack/table-core' {
  interface SortingFns {
    alphanumericv2: SortingFn<unknown>;
    ASCIIAsc: SortingFn<unknown>;
    fullPath: SortingFn<unknown>;
  }
}

const sortingFns: SortingFns = {
  alphanumericv2: (rowA: any, rowB: any, columnId: any): number => {
    return String(rowA.getValue(columnId)).toLowerCase() > String(rowB.getValue(columnId)).toLowerCase() ? 1 : -1;
  },
  ASCIIAsc: (rowA: any, rowB: any, columnId: any) => {
    const valueA = String(rowA.getValue(columnId));
    const valueB = String(rowB.getValue(columnId));

    for (let i = 0; i < Math.min(valueA.length, valueB.length); i++) {
      const charCodeA = valueA.charCodeAt(i);
      const charCodeB = valueB.charCodeAt(i);

      if (charCodeA !== charCodeB) {
        return charCodeA < charCodeB ? -1 : 1;
      }
    }

    // If both strings have the same prefix, the longer one should come later
    return valueA.length === valueB.length ? 0 : valueA.length < valueB.length ? -1 : 1;
  },
  fullPath: (rowA: any, rowB: any, columnId: any) => {
    const firstVal = String(rowA.getValue(columnId)).toLowerCase().replaceAll('>', '');
    const secondVal = String(rowB.getValue(columnId)).toLowerCase().replaceAll('>', '');

    return firstVal.localeCompare(secondVal);
  },
};

export default sortingFns;
