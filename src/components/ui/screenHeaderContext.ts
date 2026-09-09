import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

export type SetScreenHeader = Dispatch<SetStateAction<ReactNode>>;

export const ScreenHeaderContext = createContext<SetScreenHeader | null>(null);
