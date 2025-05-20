import React, { useEffect } from 'react';
import { useBookmarkStore } from '../../lib/store/bookmarkStore';
import BookmarkItem from './BookmarkItem';
import { LinkIcon } from 'lucide-react';

interface BookmarkListProps {
  userId: string;
}

const BookmarkList: React.FC<BookmarkListProps> = ({ userId }) => {
  const { bookmarks, loading, error, fetchUserBookmarks } = useBookmarkStore();

  useEffect(() => {
    if (userId) {
      fetchUserBookmarks(userId);
    }
  }, [userId, fetchUserBookmarks]);

  if (loading && bookmarks.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-red-800">Error loading bookmarks: {error}</p>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <LinkIcon size={32} className="text-blue-600" />
          </div>
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No bookmarks yet</h3>
        <p className="text-gray-500 mb-6">
          Start saving your first link by entering a URL above
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Your Bookmarks</h2>
      <div className="space-y-4">
        {bookmarks.map((bookmark) => (
          <BookmarkItem key={bookmark.id} bookmark={bookmark} />
        ))}
      </div>
    </div>
  );
};

export default BookmarkList;