import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  emailConfirmed: boolean;
  signInWithPassword: (params: { email: string; password: string }) => Promise<{ error?: Error } | void>;
  signUpWithPassword: (params: { email: string; password: string; data?: Record<string, unknown> }) => Promise<{ error?: Error } | void>;
  signInWithGoogle: () => Promise<{ error?: Error } | void>;
  signInWithGitHub: () => Promise<{ error?: Error } | void>;
  signOut: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<{ error?: Error } | void>;
  getProfile: () => Promise<{ data?: any; error?: Error }>;
  updateProfile: (profileData: any) => Promise<{ error?: Error } | void>;
  getUsersByLocation: (location: string) => Promise<{ data?: any[]; error?: Error }>;
  getProfileByUserId: (userId: string) => Promise<{ data?: any; error?: Error }>;
  createConversation: (otherUserId: string) => Promise<{ data?: any; error?: Error }>;
  getConversations: () => Promise<{ data?: any[]; error?: Error }>;
  getMessages: (conversationId: string) => Promise<{ data?: any[]; error?: Error }>;
  sendMessage: (conversationId: string, content: string) => Promise<{ error?: Error } | void>;
  markMessagesAsRead: (conversationId: string) => Promise<{ error?: Error } | void>;
  subscribeToMessages: (conversationId: string, callback: (message: any) => void) => () => void;
  createRoomListing: (listingData: any) => Promise<{ data?: any; error?: Error }>;
  getRoomListings: (userId?: string) => Promise<{ data?: any[]; error?: Error }>;
  updateRoomListing: (listingId: string, listingData: any) => Promise<{ error?: Error } | void>;
  deleteRoomListing: (listingId: string) => Promise<{ error?: Error } | void>;
  incrementListingViews: (listingId: string) => Promise<{ error?: Error } | void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailConfirmed, setEmailConfirmed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setEmailConfirmed(data.session?.user?.email_confirmed_at ? true : false);
      setLoading(false);

      if (window.location.pathname === '/auth/callback') {
        window.history.replaceState({}, document.title, '/');
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setEmailConfirmed(newSession?.user?.email_confirmed_at ? true : false);
    });
    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    session,
    loading,
    emailConfirmed,
    async signInWithPassword({ email, password }) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error };
    },
    async signUpWithPassword({ email, password, data }) {
      const { error } = await supabase.auth.signUp({ email, password, options: { data } });
      if (error) return { error };
    },
    async signInWithGoogle() {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) return { error };
    },
    async signInWithGitHub() {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) return { error };
    },
    async signOut() {
      await supabase.auth.signOut();
    },
    async resendConfirmation(email) {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      if (error) return { error };
    },
    async getProfile() {
      if (!user) return { error: new Error('No user logged in') };
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        return { error };
      }
      
      return { data: data || null };
    },
    async updateProfile(profileData) {
      if (!user) return { error: new Error('No user logged in') };
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          email: user.email,
          ...profileData,
          updated_at: new Date().toISOString(),
        });
      
      if (error) return { error };
    },
    async getUsersByLocation(location) {
      if (!user) return { error: new Error('No user logged in') };

      // Case-insensitive partial match on location (e.g., "Bangalore" matches "Koramangala, Bangalore")
      const locationPattern = `%${location}%`;

      const { data, error } = await supabase
        .from('profiles')
        .select('id,user_id,email,name,age,phone,location,occupation,company,bio,budget,move_in_date,room_type,lifestyle,interests,profile_photo,created_at')
        .ilike('location', locationPattern)
        .neq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) return { error };

      return { data: data || [] };
    },
    async getProfileByUserId(userId: string) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id,user_id,email,name,age,phone,location,occupation,company,bio,budget,move_in_date,room_type,lifestyle,interests,profile_photo,created_at,updated_at')
        .eq('user_id', userId)
        .single();

      if (error) return { error };
      return { data };
    },
    async createConversation(otherUserId: string) {
      if (!user) return { error: new Error('No user logged in') };
      
      // Ensure user1_id < user2_id for consistency
      const [user1Id, user2Id] = user.id < otherUserId 
        ? [user.id, otherUserId] 
        : [otherUserId, user.id];
      
      // Check if conversation already exists
      const { data: existing } = await supabase
        .from('conversations')
        .select('*')
        .eq('user1_id', user1Id)
        .eq('user2_id', user2Id)
        .single();
      
      if (existing) {
        return { data: existing };
      }
      
      // Create new conversation
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user1_id: user1Id,
          user2_id: user2Id,
        })
        .select()
        .single();
      
      if (error) return { error };
      return { data };
    },
    async getConversations() {
      if (!user) return { error: new Error('No user logged in') };
      
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });
      
      if (error) return { error };
      if (!conversations || conversations.length === 0) return { data: [] };
      
      // Get profile data for other users
      const transformed = await Promise.all(
        conversations.map(async (conv) => {
          const otherUserId = conv.user1_id === user.id ? conv.user2_id : conv.user1_id;
          
          // Get other user's profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('user_id, name, profile_photo')
            .eq('user_id', otherUserId)
            .single();
          
          return {
            ...conv,
            otherUserId: otherUserId,
            otherUserName: profile?.name || 'Unknown',
            otherUserPhoto: profile?.profile_photo || null,
          };
        })
      );
      
      return { data: transformed || [] };
    },
    async getMessages(conversationId: string) {
      if (!user) return { error: new Error('No user logged in') };
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) return { error };
      return { data: data || [] };
    },
    async sendMessage(conversationId: string, content: string) {
      if (!user) return { error: new Error('No user logged in') };
      
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim(),
        });
      
      if (error) return { error };
    },
    async markMessagesAsRead(conversationId: string) {
      if (!user) return { error: new Error('No user logged in') };
      
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .eq('is_read', false);
      
      if (error) return { error };
    },
    subscribeToMessages(conversationId: string, callback: (message: any) => void) {
      const channel = supabase
        .channel(`messages:${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`,
          },
          (payload) => {
            callback(payload.new);
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    },
    async createRoomListing(listingData) {
      if (!user) return { error: new Error('No user logged in') };
      
      const { data, error } = await supabase
        .from('room_listings')
        .insert({
          user_id: user.id,
          city_id: listingData.cityId || '',
          city_name: listingData.cityName || '',
          title: listingData.title,
          description: listingData.description,
          room_type: listingData.roomType,
          rent: parseInt(listingData.rent) || 0,
          deposit: parseInt(listingData.deposit) || 0,
          available_from: listingData.availableFrom,
          amenities: listingData.amenities || [],
          flatmate_preferences: listingData.flatmatePreferences || [],
          house_rules: listingData.houseRules || [],
          image_urls: listingData.imageUrls || [],
          is_active: listingData.isActive !== undefined ? listingData.isActive : true,
        })
        .select()
        .single();
      
      if (error) return { error };
      return { data };
    },
    async getRoomListings(userId?: string) {
      let query = supabase
        .from('room_listings')
        .select('*');
      
      if (userId) {
        // Get user's own listings (active or inactive)
        query = query.eq('user_id', userId);
      } else {
        // Get all active listings for browsing
        query = query.eq('is_active', true);
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) return { error };
      return { data: data || [] };
    },
    async updateRoomListing(listingId: string, listingData: any) {
      if (!user) return { error: new Error('No user logged in') };
      
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };
      
      if (listingData.title !== undefined) updateData.title = listingData.title;
      if (listingData.description !== undefined) updateData.description = listingData.description;
      if (listingData.roomType !== undefined) updateData.room_type = listingData.roomType;
      if (listingData.rent !== undefined) updateData.rent = parseInt(listingData.rent) || 0;
      if (listingData.deposit !== undefined) updateData.deposit = parseInt(listingData.deposit) || 0;
      if (listingData.availableFrom !== undefined) updateData.available_from = listingData.availableFrom;
      if (listingData.amenities !== undefined) updateData.amenities = listingData.amenities;
      if (listingData.flatmatePreferences !== undefined) updateData.flatmate_preferences = listingData.flatmatePreferences;
      if (listingData.houseRules !== undefined) updateData.house_rules = listingData.houseRules;
      if (listingData.imageUrls !== undefined) updateData.image_urls = listingData.imageUrls;
      if (listingData.isActive !== undefined) updateData.is_active = listingData.isActive;
      
      const { error } = await supabase
        .from('room_listings')
        .update(updateData)
        .eq('id', listingId)
        .eq('user_id', user.id); // Ensure user owns the listing
      
      if (error) return { error };
    },
    async deleteRoomListing(listingId: string) {
      if (!user) return { error: new Error('No user logged in') };
      
      const { error } = await supabase
        .from('room_listings')
        .delete()
        .eq('id', listingId)
        .eq('user_id', user.id); // Ensure user owns the listing
      
      if (error) return { error };
    },
    async incrementListingViews(listingId: string) {
      // Call the database function to increment views
      const { error } = await supabase.rpc('increment_listing_views', {
        listing_id: listingId
      });
      
      if (error) return { error };
    },
  }), [user, session, loading, emailConfirmed]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


