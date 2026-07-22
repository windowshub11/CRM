import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import CommandSearch from '../CommandSearch/CommandSearch';
import './appshell.css';
 
export default function AppShell({ user }) {
  const [searchOpen, setSearchOpen] = useState(false);
 
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
 
  return (
    <div className="appshell">
      <Sidebar />
      <div className="appshell-main">
        <Topbar onOpenSearch={openSearch} user={user} />
        <main className="appshell-content">
          <Outlet />
        </main>
      </div>
      {searchOpen && <CommandSearch onClose={closeSearch} />}
    </div>
  );
}
