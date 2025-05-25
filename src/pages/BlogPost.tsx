
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
      <article className="bg-white dark:bg-[#221F26] rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Image de couverture */}
        {post.image_url && (
          <div className="aspect-video overflow-hidden">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Contenu de l'article */}
        <div className="p-8">
          {/* Métadonnées */}
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
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

          {/* Titre */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Résumé */}
          {post.summary && (
            <div className="bg-gray-50 dark:bg-gray-800/40 rounded-lg p-6 mb-8 border-l-4 border-primary dark:border-[#9b87f5]">
              <p className="text-lg text-gray-700 dark:text-gray-300 italic">
                {post.summary}
              </p>
            </div>
          )}

          {/* Tags */}
          <div className="flex items-center gap-2 mb-8">
            <Badge variant="secondary" className="text-sm">
              <BookOpen className="h-3 w-3 mr-1" />
              Article
            </Badge>
            <Badge variant="outline" className="text-sm">
              Fortnite
            </Badge>
          </div>

          {/* Contenu principal */}
          <div 
            className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-800 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-primary dark:prose-a:text-[#9b87f5] prose-strong:text-gray-800 dark:prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      {/* Bouton de retour en bas */}
      <div className="mt-8 text-center">
        <Button 
          onClick={() => navigate("/blog")} 
          variant="outline"
          className="border-primary text-primary hover:bg-primary/10 dark:border-[#9b87f5] dark:text-[#9b87f5] dark:hover:bg-[#9b87f5]/20"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voir tous les articles
        </Button>
      </div>
    </div>
  );
};

export default BlogPost;
