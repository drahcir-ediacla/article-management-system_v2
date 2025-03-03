"use client"; // Required for Next.js App Router (use only in client components)

import { Provider } from "react-redux";
import { store } from "./store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
