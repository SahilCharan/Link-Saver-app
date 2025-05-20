import React from 'react';
import { useAuth } from '../lib/hooks/useAuth';
import BookmarkForm from '../components/bookmarks/BookmarkForm';
import BookmarkList from '../components/bookmarks/BookmarkList';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div>
      <BookmarkForm userId={user.id} />
      <BookmarkList userId={user.id} />
    </div>
  );
};

export default HomePage;