
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  ArrowLeft,
  BookOpen,
  Loader2,
  Share2,
  Heart,
  MessageCircle,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  summary: string | null;
  content: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  author_id: string;
}

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBlogPost(id);
    }
  }, [id]);

  const fetchBlogPost = async (postId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", postId)
        .eq("published", true)
        .single();

      if (error) throw error;
      setPost(data as BlogPost);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      toast.error("Impossible de charger l'article");
      navigate("/blog");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.summary || "",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié dans le presse-papiers");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary dark:text-[#9b87f5]" />
          <span className="ml-2 text-gray-500 dark:text-gray-400">Chargement de l'article...</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Article non trouvé
          </h1>
          <Button onClick={() => navigate("/blog")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {/* Header avec bouton retour */}
        <div className="mb-6">
          <Button 
            onClick={() => navigate("/blog")} 
            variant="ghost" 
            className="mb-4 text-primary dark:text-[#9b87f5] hover:bg-primary/10 dark:hover:bg-[#9b87f5]/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au blog
          </Button>
        </div>

        {/* Article */}
        <article className="bg-white dark:bg-[#221F26] rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Image de couverture */}
          {post.image_url && (
            <div className="aspect-video overflow-hidden relative">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}

          {/* Contenu de l'article */}
          <div className="p-8 lg:p-12">
            {/* Métadonnées */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.created_at)}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>5 min de lecture</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={shareArticle}
                  className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-[#9b87f5]"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-red-500 dark:text-gray-400"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-blue-500 dark:text-gray-400"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Titre */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
              {post.title}
            </h1>

            {/* Résumé */}
            {post.summary && (
              <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 dark:from-[#9b87f5]/10 dark:to-blue-500/10 rounded-xl p-6 mb-8 border-l-4 border-primary dark:border-[#9b87f5]">
                <p className="text-lg text-gray-700 dark:text-gray-300 italic leading-relaxed">
                  {post.summary}
                </p>
              </div>
            )}

            {/* Tags */}
            <div className="flex items-center gap-2 mb-10">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <BookOpen className="h-3 w-3 mr-1" />
                Article
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                Fortnite
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                Gaming
              </Badge>
            </div>

            {/* Contenu principal avec styles améliorés */}
            <div 
              className="blog-content prose prose-lg max-w-none dark:prose-invert
                prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
                prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8 prose-h1:pb-3 prose-h1:border-b prose-h1:border-gray-200 dark:prose-h1:border-gray-700
                prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-primary dark:prose-h2:text-[#9b87f5]
                prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-gray-800 dark:prose-h3:text-gray-200
                prose-h4:text-xl prose-h4:mb-2 prose-h4:mt-4 prose-h4:text-gray-700 dark:prose-h4:text-gray-300
                prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-primary dark:prose-a:text-[#9b87f5] prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
                prose-em:text-gray-600 dark:prose-em:text-gray-400
                prose-blockquote:border-l-4 prose-blockquote:border-primary dark:prose-blockquote:border-[#9b87f5] prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800/40 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:my-6
                prose-ul:my-6 prose-ol:my-6
                prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:mb-2
                prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
                prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
                prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8
                prose-table:my-6 prose-table:border-collapse
                prose-th:bg-gray-50 dark:prose-th:bg-gray-800 prose-th:px-4 prose-th:py-2 prose-th:border prose-th:border-gray-200 dark:prose-th:border-gray-700 prose-th:font-semibold
                prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700
                prose-hr:border-gray-200 dark:prose-hr:border-gray-700 prose-hr:my-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>

        {/* Bouton de retour en bas */}
        <div className="mt-12 text-center">
          <Button 
            onClick={() => navigate("/blog")} 
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary/10 dark:border-[#9b87f5] dark:text-[#9b87f5] dark:hover:bg-[#9b87f5]/20 px-8 py-3"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voir tous les articles
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
