import React from 'react';
import { BookmarkIcon } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../lib/hooks/useAuth';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  const { user, loading } = useAuth();

  // If user is already authenticated, redirect to home
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="w-full max-w-sm mx-auto lg:w-96">
          <div className="flex justify-center mb-6">
            <BookmarkIcon size={40} className="text-blue-600" />
          </div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h2>
            {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
      <div className="relative flex-1 hidden w-0 lg:block">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
          <div className="max-w-2xl p-12 text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Link Saver + Auto-Summary</h1>
            <p className="text-xl">
              Save your important links and get automatic summaries to quickly understand the content
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;