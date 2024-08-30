import React, { createContext, useContext, useState } from 'react';
import { TooltipContextType, TooltipProviderProps } from './types';
import { Tooltip as ReactTooltip, ITooltip } from 'react-tooltip';

export const TOOLTIP_ID_CONTEXT = 'tooltip_id_context';
const TooltipContext = createContext<TooltipContextType>({} as TooltipContextType);

const TooltipContextProvider = ({ children }: TooltipProviderProps) => {
  const [tooltipProps, setTooltipProps] = useState<ITooltip>({});

  const setTooltip = (props: ITooltip) => {
    setTooltipProps(props);
  };

  return (
    <TooltipContext.Provider
      value={React.useMemo(
        () => ({
          setTooltip,
        }),
        [tooltipProps],
      )}
    >
      <ReactTooltip id={TOOLTIP_ID_CONTEXT} {...tooltipProps} className="z-50" />
      <div id="test-tooltip"></div>
      {children}
    </TooltipContext.Provider>
  );
};

export { TooltipContext, TooltipContextProvider };

export const useTooltipContext = () => {
  return useContext(TooltipContext);
};
