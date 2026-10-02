import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
export function AppShell({ children }: { children: ReactNode }) { return <div className="app-shell" id="top"><Navbar /><main className="app-content">{children}</main><Footer /></div>; }

