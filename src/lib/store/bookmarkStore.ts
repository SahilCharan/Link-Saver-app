import { create } from 'zustand';
import { Bookmark } from '../../types/bookmark';
import { fetchBookmarks, createBookmark, deleteBookmark } from '../api/bookmarks';

interface BookmarkState {
  bookmarks: Bookmark[];
  loading: boolean;
  error: string | null;
  fetchUserBookmarks: (userId: string) => Promise<void>;
  addBookmark: (url: string, userId: string) => Promise<void>;
  removeBookmark: (id: string) => Promise<void>;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarks: [],
  loading: false,
  error: null,
  
  fetchUserBookmarks: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await fetchBookmarks(userId);
      if (error) {
        set({ error: error.message, loading: false });
        return;
      }
      set({ bookmarks: data || [], loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch bookmarks', loading: false });
    }
  },
  
  addBookmark: async (url: string, userId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await createBookmark(url, userId);
      if (error) {
        set({ error: error.message, loading: false });
        return;
      }
      if (data) {
        set(state => ({ 
          bookmarks: [data, ...state.bookmarks],
          loading: false 
        }));
      }
    } catch (err) {
      set({ error: 'Failed to add bookmark', loading: false });
    }
  },
  
  removeBookmark: async (id: string) => {
    try {
      const { error } = await deleteBookmark(id);
      if (error) {
        set({ error: error.message });
        return;
      }
      set(state => ({
        bookmarks: state.bookmarks.filter(bookmark => bookmark.id !== id)
      }));
    } catch (err) {
      set({ error: 'Failed to remove bookmark' });
    }
  }
}));