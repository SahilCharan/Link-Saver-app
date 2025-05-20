import React, { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { useBookmarkStore } from '../../lib/store/bookmarkStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import toast from 'react-hot-toast';

interface BookmarkFormProps {
  userId: string;
}

const BookmarkForm: React.FC<BookmarkFormProps> = ({ userId }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const { addBookmark, loading } = useBookmarkStore();

  const validateUrl = (value: string) => {
    try {
      new URL(value);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate URL format
    if (!validateUrl(url)) {
      setError('Please enter a valid URL (e.g. https://example.com)');
      return;
    }

    try {
      toast.promise(
        addBookmark(url, userId),
        {
          loading: 'Saving bookmark...',
          success: 'Bookmark saved!',
          error: 'Failed to save bookmark',
        }
      );
      setUrl('');
    } catch (err) {
      console.error('Error adding bookmark:', err);
      setError('Failed to save bookmark. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8 transition-all hover:shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Bookmark</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          aria-label="URL"
          error={error}
          fullWidth
          required
        />
        <Button
          type="submit"
          isLoading={loading}
          disabled={loading || !url.trim()}
          size="md"
          className="sm:mt-0 mt-1 whitespace-nowrap"
        >
          <PlusIcon size={18} className="mr-1" />
          Save Link
        </Button>
      </form>
    </div>
  );
};

export default BookmarkForm;