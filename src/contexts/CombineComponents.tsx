import React, { FC, ReactNode } from 'react';

type CombinedComponentProps = {
  [key: string]: any;
  children?: ReactNode;
};

export const combineComponents = (...components: FC<any>[]): FC<any> => {
  return components.reduce(
    (AccumulatedComponents: FC<CombinedComponentProps>, CurrentComponent) => {
      return ({ children, ...props }: CombinedComponentProps): JSX.Element => {
        return (
          <AccumulatedComponents {...props}>
            <CurrentComponent>{children}</CurrentComponent>
          </AccumulatedComponents>
        );
      };
    },
    ({ children }: { children: ReactNode }) => <>{children}</>,
  );
};
