
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Copy } from "lucide-react";
import { toast } from "sonner";

interface BlogSocialActionsProps {
  postId: string;
  postTitle: string;
  postSummary?: string;
  className?: string;
}

const BlogSocialActions = ({ postId, postTitle, postSummary, className = "" }: BlogSocialActionsProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    toast.success(isLiked ? "Like retiré" : "Article liké !");
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
    setShowComments(!showComments);
    if (!showComments) {
      toast.info("Fonction commentaires bientôt disponible !");
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        className={`text-gray-500 hover:text-red-500 dark:text-gray-400 transition-colors ${
          isLiked ? "text-red-500" : ""
        }`}
      >
        <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
        {likeCount > 0 && <span className="ml-1 text-xs">{likeCount}</span>}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleComment}
        className="text-gray-500 hover:text-blue-500 dark:text-gray-400 transition-colors"
      >
        <MessageCircle className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="text-gray-500 hover:text-green-500 dark:text-gray-400 transition-colors"
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default BlogSocialActions;
