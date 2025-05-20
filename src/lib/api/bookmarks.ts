import { supabase } from '../supabase';
import type { Bookmark } from '../../types/bookmark';

// Fetch all bookmarks for a user
export async function fetchBookmarks(userId: string): Promise<{ data: Bookmark[] | null; error: any }> {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
}

// Create a new bookmark
export async function createBookmark(
  url: string,
  userId: string
): Promise<{ data: Bookmark | null; error: any }> {
  try {
    // Step 1: Create initial bookmark record
    const { data: bookmarkData, error: bookmarkError } = await supabase
      .from('bookmarks')
      .insert([{ url, user_id: userId }])
      .select('*')
      .single();
    
    if (bookmarkError) {
      return { data: null, error: bookmarkError };
    }
    
    // Step 2: Fetch metadata for the URL (title and favicon)
    const metadata = await fetchUrlMetadata(url);
    
    // Step 3: Fetch summary using Jina AI
    let summary = '';
    try {
      summary = await fetchSummary(url);
    } catch (error) {
      console.error('Error fetching summary:', error);
      summary = 'Summary temporarily unavailable.';
    }

    // Step 4: Update the bookmark with metadata and summary
    const { data: updatedData, error: updateError } = await supabase
      .from('bookmarks')
      .update({
        title: metadata.title || url,
        favicon: metadata.favicon || null,
        summary
      })
      .eq('id', bookmarkData.id)
      .select('*')
      .single();

    if (updateError) {
      return { data: bookmarkData, error: updateError };
    }

    return { data: updatedData, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Delete a bookmark
export async function deleteBookmark(id: string): Promise<{ error: any }> {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id);

  return { error };
}

// Fetch URL metadata (title and favicon)
async function fetchUrlMetadata(url: string): Promise<{ title: string | null; favicon: string | null }> {
  try {
    // In a real app, you would use a server/edge function to fetch the actual page
    // Here we simulate with a proxy (for demo purposes only)
    // A better approach would be to use a server-side proxy or Supabase Edge Function
    
    // For now, let's just attempt to get a favicon based on domain
    const domain = new URL(url).hostname;
    const potentialFavicon = `https://${domain}/favicon.ico`;
    
    // Basic title extraction from URL
    let title = domain;
    try {
      // Clean up the domain a bit for a nicer display
      title = domain.replace('www.', '').split('.')[0];
      // Capitalize first letter
      title = title.charAt(0).toUpperCase() + title.slice(1);
    } catch (e) {
      console.error('Error extracting title:', e);
    }
    
    return {
      title,
      favicon: potentialFavicon
    };
  } catch (error) {
    console.error('Error fetching URL metadata:', error);
    return { title: null, favicon: null };
  }
}

// Fetch summary using Jina AI
export async function fetchSummary(url: string): Promise<string> {
  try {
    const target = encodeURIComponent(url);
    const response = await fetch(`https://r.jina.ai/${target}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch summary: ${response.status} - ${errorText}`);
    }
    
    const summary = await response.text();
    return summary || 'No summary available.';
  } catch (error: any) {
    console.error('Error fetching summary:', error);
    return 'Summary temporarily unavailable.';
  }
}