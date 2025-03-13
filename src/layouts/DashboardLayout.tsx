import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { GraduationCap, LayoutDashboard, Calendar, Trophy, LogOut } from 'lucide-react';
import { signOut } from '../lib/auth';

export default function DashboardLayout() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-[280px_1fr]">
      <aside className="bg-muted border-r p-6">
        <div className="flex items-center gap-2 mb-8">
          <GraduationCap className="h-6 w-6" />
          <span className="font-bold">StudyPlanner</span>
        </div>
        <nav className="space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            to="/calendar"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent"
          >
            <Calendar className="h-4 w-4" />
            Calendar
          </Link>
          <Link
            to="/achievements"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent"
          >
            <Trophy className="h-4 w-4" />
            Achievements
          </Link>
        </nav>
        <div className="absolute bottom-6">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent text-muted-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
}