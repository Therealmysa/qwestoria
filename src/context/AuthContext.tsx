
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthContext: Initializing auth state");

    // Setup the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("AuthContext: Auth state changed", { event, session: currentSession });
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          console.log("AuthContext: User found, fetching profile");
          setTimeout(() => fetchProfile(currentSession.user.id), 0);
        } else {
          console.log("AuthContext: No user, setting profile to null");
          setProfile(null);
        }
      }
    );

    // Initial session fetch
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("AuthContext: Initial session fetch", { session: currentSession });
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        console.log("AuthContext: Initial user found, fetching profile");
        fetchProfile(currentSession.user.id);
      } else {
        console.log("AuthContext: No initial user, setting loading to false");
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log("AuthContext: Fetching profile for user", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("AuthContext: Error fetching profile", error);
        throw error;
      }

      console.log("AuthContext: Profile fetched", data);
      setProfile(data);
    } catch (error) {
      console.error("AuthContext: Error in fetchProfile", error);
    } finally {
      console.log("AuthContext: Setting loading to false");
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
