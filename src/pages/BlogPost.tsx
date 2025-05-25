
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import BlogSocialActions from "@/components/blog/BlogSocialActions";
import BlogComments from "@/components/blog/BlogComments";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles:author_id (
            username,
            avatar_url
          )
        `)
        .eq('id', id)
        .eq('published', true)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Article non trouvé
          </h1>
          <p className="text-gray-600">
            L'article que vous recherchez n'existe pas ou a été supprimé.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="space-y-6">
            {/* Titre de l'article */}
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              {post.title}
            </h1>

            {/* Résumé si disponible */}
            {post.summary && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {post.summary}
              </p>
            )}

            {/* Image de l'article */}
            {post.image_url && (
              <div className="w-full h-64 md:h-80 overflow-hidden rounded-lg">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Métadonnées de l'article */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {/* Auteur */}
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={post.profiles?.avatar_url} />
                  <AvatarFallback>
                    <User className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
                <span>Par {post.profiles?.username || 'Auteur inconnu'}</span>
              </div>

              {/* Date de publication */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDistanceToNow(new Date(post.created_at), { 
                    addSuffix: true, 
                    locale: fr 
                  })}
                </span>
              </div>

              {/* Temps de lecture */}
              {post.reading_time_minutes && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.reading_time_minutes} min de lecture</span>
                </div>
              )}
            </div>

            {/* Actions sociales */}
            <BlogSocialActions 
              postId={post.id}
              postTitle={post.title}
              postSummary={post.summary}
            />

            <Separator />
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Contenu de l'article */}
            <div 
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-blockquote:text-foreground prose-li:text-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <Separator />

            {/* Section des commentaires */}
            <div id="comments-section">
              <BlogComments postId={post.id} />
            </div>
          </CardContent>
        </Card>
      </article>
    </div>
  );
};

export default BlogPost;
