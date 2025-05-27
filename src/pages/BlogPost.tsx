import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Loader2 } from "lucide-react";

interface BlogPostType {
  id: string;
  created_at: string;
  title: string;
  content: string;
  author: string;
  image_url: string | null;
}

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!id) {
          throw new Error("Article non trouvé");
        }

        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        setPost(data as BlogPostType);
      } catch (err: any) {
        setError(err.message || "Impossible de charger l'article");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-purple-500 to-amber-500 dark:from-white dark:via-[#f1c40f] dark:to-[#9b87f5] mb-4">
              Article de Blog
            </h1>
          </div>

          {loading ? (
            <div className="flex justify-center items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Chargement de l'article...
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : post ? (
            <>
              {/* Post Image */}
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full rounded-lg shadow-md mb-6"
                />
              )}

              {/* Post Content */}
              <div className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert">
                <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
                <div className="text-gray-500 mb-4">
                  Publié le{" "}
                  {format(new Date(post.created_at), "dd MMMM yyyy", {
                    locale: fr,
                  })} par {post.author}
                </div>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            </>
          ) : (
            <div>Article non trouvé</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
