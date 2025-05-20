import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BookmarkItem from '../components/bookmarks/BookmarkItem';
import { useBookmarkStore } from '../lib/store/bookmarkStore';

// Mock the bookmark store
vi.mock('../lib/store/bookmarkStore', () => ({
  useBookmarkStore: vi.fn()
}));

describe('BookmarkItem', () => {
  const mockRemoveBookmark = vi.fn();
  
  beforeEach(() => {
    vi.mocked(useBookmarkStore).mockReturnValue({
      removeBookmark: mockRemoveBookmark,
      bookmarks: [],
      loading: false,
      error: null,
      fetchUserBookmarks: vi.fn(),
      addBookmark: vi.fn()
    });
  });

  const mockBookmark = {
    id: '123',
    url: 'https://example.com',
    title: 'Example Website',
    favicon: 'https://example.com/favicon.ico',
    summary: 'This is a summary of the example website. It contains some text to show the truncation feature.',
    created_at: '2023-05-15T10:30:00Z'
  };

  it('renders the bookmark title and URL', () => {
    render(<BookmarkItem bookmark={mockBookmark} />);
    
    expect(screen.getByText('Example Website')).toBeInTheDocument();
    expect(screen.getByText('https://example.com')).toBeInTheDocument();
  });

  it('shows truncated summary and expands when clicked', () => {
    render(
      <BookmarkItem 
        bookmark={{
          ...mockBookmark,
          summary: 'A '.repeat(100) + 'very long summary that should be truncated'
        }} 
      />
    );
    
    // Check if "Show more" button exists
    const showMoreButton = screen.getByText('Show more');
    expect(showMoreButton).toBeInTheDocument();
    
    // Click the button to expand
    fireEvent.click(showMoreButton);
    
    // Now it should show "Show less"
    expect(screen.getByText('Show less')).toBeInTheDocument();
  });

  it('calls removeBookmark when delete button is clicked', async () => {
    render(<BookmarkItem bookmark={mockBookmark} />);
    
    // Find and click the delete button
    const deleteButton = screen.getByLabelText('Delete bookmark');
    fireEvent.click(deleteButton);
    
    // Verify the delete function was called with the correct ID
    expect(mockRemoveBookmark).toHaveBeenCalledWith('123');
  });

  it('renders correctly when no summary is available', () => {
    render(
      <BookmarkItem 
        bookmark={{
          ...mockBookmark,
          summary: null
        }} 
      />
    );
    
    expect(screen.getByText('No summary available')).toBeInTheDocument();
  });
});