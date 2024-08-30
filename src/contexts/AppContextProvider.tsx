import { combineComponents } from './CombineComponents';
import { ScrollContextProvider } from './ScrollContext';
import { AppNavContextProvider } from './AppNavContext/AppNavContext';
import { TooltipContextProvider } from './TooltipContext/TooltipContext';

const providers = [AppNavContextProvider, ScrollContextProvider, TooltipContextProvider];

export const AppContextProvider = combineComponents(...providers);
