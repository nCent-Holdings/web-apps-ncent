import { ITooltip } from 'react-tooltip';

export interface TooltipProviderProps {
  children: React.ReactNode;
}

export interface TooltipContextType {
  setTooltip: (props: ITooltip) => void;
}
