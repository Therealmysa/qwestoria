import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface BlogSocialActionsProps {
  postId: string;
  postTitle: string;
  postSummary?: string;
  className?: string;
}

const BlogSocialActions = ({ postId, postTitle, postSummary, className = "" }: BlogSocialActionsProps) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCounts();
    if (user) {
      checkIfLiked();
    }
  }, [postId, user]);

  const fetchCounts = async () => {
    try {
      // Récupérer le nombre de likes
      const { data: likeData, error: likeError } = await supabase
        .rpc('get_blog_post_like_count', { post_id: postId });
      
      if (likeError) throw likeError;
      setLikeCount(likeData || 0);

      // Récupérer le nombre de commentaires
      const { data: commentData, error: commentError } = await supabase
        .rpc('get_blog_post_comment_count', { post_id: postId });
      
      if (commentError) throw commentError;
      setCommentCount(commentData || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des compteurs:', error);
    }
  };

  const checkIfLiked = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .rpc('user_has_liked_post', { 
          post_id: postId, 
          user_id: user.id 
        });
      
      if (error) throw error;
      setIsLiked(data || false);
    } catch (error) {
      console.error('Erreur lors de la vérification du like:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour liker un article");
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isLiked) {
        // Supprimer le like
        const { error } = await supabase
          .from('blog_post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (error) throw error;
        
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
        toast.success("Like retiré");
      } else {
        // Ajouter le like
        const { error } = await supabase
          .from('blog_post_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });

        if (error) throw error;
        
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
        toast.success("Article liké !");
      }
    } catch (error) {
      console.error('Erreur lors du like:', error);
      toast.error("Erreur lors du like");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: postTitle,
          text: postSummary || "Découvrez cet article intéressant",
          url: url,
        });
        toast.success("Article partagé avec succès !");
      } catch (error) {
        // L'utilisateur a annulé le partage
        console.log("Partage annulé");
      }
    } else {
      // Fallback : copier le lien
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Lien copié dans le presse-papiers !");
      } catch (error) {
        toast.error("Impossible de copier le lien");
      }
    }
  };

  const handleComment = () => {
    // Faire défiler vers la section des commentaires
    const commentsSection = document.getElementById('comments-section');
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={isLoading}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
          isLiked 
            ? "text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30" 
            : "text-gray-600 hover:text-red-500 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20"
        }`}
      >
        <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
        <span className="text-sm font-medium">{likeCount}</span>
        <span className="hidden sm:inline text-sm">J'aime</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleComment}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-600 hover:text-blue-500 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 transition-all duration-200"
      >
        <MessageCircle className="h-4 w-4" />
        <span className="text-sm font-medium">{commentCount}</span>
        <span className="hidden sm:inline text-sm">Commenter</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-600 hover:text-green-500 hover:bg-green-50 dark:text-gray-400 dark:hover:text-green-400 dark:hover:bg-green-900/20 transition-all duration-200"
      >
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline text-sm">Partager</span>
      </Button>
    </div>
  );
};

export default BlogSocialActions;
