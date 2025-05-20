import React, { useState } from 'react';
import { Trash2Icon, ExternalLinkIcon } from 'lucide-react';
import { Bookmark } from '../../types/bookmark';
import { useBookmarkStore } from '../../lib/store/bookmarkStore';
import Button from '../ui/Button';

interface BookmarkItemProps {
  bookmark: Bookmark;
}

const BookmarkItem: React.FC<BookmarkItemProps> = ({ bookmark }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { removeBookmark } = useBookmarkStore();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await removeBookmark(bookmark.id);
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Format date nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  // Truncate summary if it's too long
  const truncateSummary = (summary: string | null, maxLength = 150) => {
    if (!summary) return 'No summary available';
    return summary.length > maxLength
      ? `${summary.substring(0, maxLength)}...`
      : summary;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 mb-4 transition-all hover:shadow-md">
      <div className="flex items-start">
        {bookmark.favicon && (
          <img
            src={bookmark.favicon}
            alt=""
            className="w-6 h-6 mr-3 mt-1"
            onError={(e) => {
              // If favicon fails to load, hide it
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {bookmark.title || bookmark.url}
            </h3>
            <div className="flex space-x-2 ml-4">
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
                aria-label="Open link"
              >
                <ExternalLinkIcon size={18} />
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                isLoading={isDeleting}
                className="text-red-600 hover:text-red-800 p-0"
                aria-label="Delete bookmark"
              >
                <Trash2Icon size={18} />
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-2 truncate">
            {bookmark.url}
          </p>
          <div className="mb-2">
            <span className="text-xs text-gray-500">
              Saved on {formatDate(bookmark.created_at)}
            </span>
          </div>
          <div className="prose prose-sm max-w-none">
            <div
              className={`text-gray-700 text-sm ${
                isExpanded ? '' : 'line-clamp-3'
              }`}
            >
              {bookmark.summary 
                ? (isExpanded 
                    ? bookmark.summary 
                    : truncateSummary(bookmark.summary))
                : 'No summary available'}
            </div>
          </div>
          {bookmark.summary && bookmark.summary.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-800 text-sm mt-2 transition-colors"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookmarkItem;