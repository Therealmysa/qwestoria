
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type ProfileCompletionFields = {
  username: boolean;
  fortniteUsername: boolean;
  bio: boolean;
}

export const useProfileCompletion = () => {  // Changed from export default to export named function
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  
  const getIncompleteFields = (): ProfileCompletionFields | null => {
    if (!profile) return null;
    
    return {
      username: Boolean(profile.username),
      fortniteUsername: Boolean(profile.fortnite_username),
      bio: Boolean(profile.bio)
    };
  };
  
  const isProfileComplete = (): boolean => {
    const fields = getIncompleteFields();
    if (!fields) return false;
    return fields.username && fields.fortniteUsername && fields.bio;
  };
  
  useEffect(() => {
    // Only run this check when we've loaded the auth state
    if (!loading) {
      if (user && profile) {
        const complete = isProfileComplete();
        // If profile is incomplete and we're not already on the profile page
        if (!complete && !window.location.pathname.includes('/profile')) {
          toast.info("Merci de compléter votre profil pour continuer", {
            description: "Certaines informations sont requises pour utiliser pleinement la plateforme.",
            duration: 5000,
          });
          navigate('/profile?setup=initial');
        }
      }
      setIsChecking(false);
    }
  }, [user, profile, loading, navigate]);
  
  return {
    isChecking,
    isProfileComplete: isProfileComplete(),
    missingFields: getIncompleteFields(),
  };
};

export default useProfileCompletion;  // Keep the default export for backward compatibility
