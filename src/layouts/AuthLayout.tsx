import React from 'react';
import { Outlet } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block bg-muted">
        <div className="h-full flex items-center justify-center p-8">
          <div className="space-y-6 max-w-lg">
            <GraduationCap className="h-12 w-12" />
            <h1 className="text-3xl font-bold">StudyPlanner</h1>
            <p className="text-muted-foreground">
              Organize your studies, track your progress, and achieve your academic goals with
              StudyPlanner - your personal academic success companion.
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}