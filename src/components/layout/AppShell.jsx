import { Navbar } from './Navbar';

export function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
