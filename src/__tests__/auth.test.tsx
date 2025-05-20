import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../lib/hooks/useAuth';
import { supabase } from '../lib/supabase';

// Mock the supabase client
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn()
    }
  }
}));

describe('useAuth hook', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock getSession to return null session initially
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null
    });
    
    // Mock authListener to return an unsubscribe function
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } }
    });
  });

  it('initializes with no user and loading state', async () => {
    const { result } = renderHook(() => useAuth());
    
    // Initial state should have no user and be in loading state
    expect(result.current.user).toBe(null);
    expect(result.current.loading).toBe(true);
    
    // Need to wait for the useEffect to complete
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('calls signUp with correct parameters', async () => {
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: { id: 'test-id', email: 'test@example.com' }, session: null },
      error: null
    });
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.signUp('test@example.com', 'password123');
    });
    
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });

  it('calls signIn with correct parameters', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { 
        user: { id: 'test-id', email: 'test@example.com' },
        session: { user: { id: 'test-id', email: 'test@example.com' } }
      },
      error: null
    });
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.signIn('test@example.com', 'password123');
    });
    
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });

  it('calls signOut correctly', async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.signOut();
    });
    
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});