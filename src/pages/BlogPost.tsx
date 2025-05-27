
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Loader2, ArrowLeft, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BlogSocialActions from "@/components/blog/BlogSocialActions";
import BlogComments from "@/components/blog/BlogComments";

interface BlogPostType {
  id: string;
  created_at: string;
  title: string;
  content: string;
  author_id: string;
  image_url: string | null;
  published: boolean;
  reading_time_minutes: number | null;
  slug: string | null;
  summary: string | null;
  updated_at: string;
}

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  const handleGoBack = () => {
    navigate("/blog");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au blog
            </Button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 dark:from-blue-400 dark:via-blue-500 dark:to-cyan-400 mb-4">
              Article de Blog
            </h1>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="mr-2 h-8 w-8 animate-spin text-blue-500" />
              <span className="text-lg text-muted-foreground">Chargement de l'article...</span>
            </div>
          ) : error ? (
            <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <CardContent className="pt-6">
                <div className="text-red-600 dark:text-red-400 text-center">
                  <p className="text-lg font-medium">{error}</p>
                  <Button 
                    variant="outline" 
                    onClick={handleGoBack}
                    className="mt-4 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    Retour au blog
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : post ? (
            <div className="space-y-8">
              {/* Post Header Card */}
              <Card className="overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-blue-100 dark:border-blue-800 shadow-xl">
                {post.image_url && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <CardContent className="p-8">
                  {/* Title */}
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                    {post.title}
                  </h2>

                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Par {post.author_id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(new Date(post.created_at), "dd MMMM yyyy", {
                          locale: fr,
                        })}
                      </span>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.reading_time_minutes || 5} min de lecture
                    </Badge>
                  </div>

                  {/* Summary */}
                  {post.summary && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 border-l-4 border-blue-500">
                      <p className="text-blue-800 dark:text-blue-200 italic text-lg leading-relaxed">
                        {post.summary}
                      </p>
                    </div>
                  )}

                  {/* Social Actions */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <BlogSocialActions
                      postId={post.id}
                      postTitle={post.title}
                      postSummary={post.summary}
                      className="flex-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Post Content */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-blue-100 dark:border-blue-800 shadow-xl">
                <CardContent className="p-8">
                  <div 
                    className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white"
                    dangerouslySetInnerHTML={{ __html: post.content }} 
                  />
                </CardContent>
              </Card>

              {/* Comments Section */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-blue-100 dark:border-blue-800 shadow-xl" id="comments-section">
                <CardContent className="p-8">
                  <BlogComments postId={post.id} />
                </CardContent>
              </Card>

              {/* Back to Blog Button */}
              <div className="text-center">
                <Button
                  onClick={handleGoBack}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Retour au blog
                </Button>
              </div>
            </div>
          ) : (
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-blue-100 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <p className="text-xl text-muted-foreground mb-4">Article non trouvé</p>
                  <Button 
                    variant="outline" 
                    onClick={handleGoBack}
                    className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                  >
                    Retour au blog
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
