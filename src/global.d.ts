/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
declare module '*.svg' {
  import { ReactElement, SVGProps } from 'react';

  const content: (props: SVGProps<SVGElement>) => ReactElement;
  export default content;
}

declare module 'livr' {
  export type LIVRRule = string | object | Array<string | object>;
  export type LIVRExtraRule = (...args: any[]) => (value: any, params: any, outputArr: any[]) => string | undefined;

  export class Validator<T extends object> {
    rules: { [key in keyof T]: LIVRRule };
    constructor(rules: { [key in keyof T]: LIVRRule }) {
      this.rules = rules;
    }
    validate(data: T): T;
    getErrors(): { [key in keyof T]?: string };

    static registerDefaultRules(rules: { [key: string]: LIVRExtraRule });
  }

  export default { Validator };
}

declare module 'livr/lib/util.js' {
  export default {
    isNoValue: (value: any) => boolean,
    isPrimitiveValue: (value: any) => boolean,
  };
}

declare module 'flat' {
  export function unflatten(data: object, options?: object): any;
}

declare module '@reduxjs/toolkit/query/react/types' {
  import { type SubscriptionOptions } from '@reduxjs/toolkit/query/react';

  export type UseQuerySubscriptionOptions = SubscriptionOptions & {
    skip?: boolean;
    refetchOnMountOrArgChange?: boolean | number;
  };
}

type TOptionalPromise<T> = T | Promise<T>;
type TObject = Record<string, any>;
type TObject<T> = Record<string, T>;
