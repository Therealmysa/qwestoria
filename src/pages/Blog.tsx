import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdBanner from "@/components/advertisements/AdBanner";

interface Post {
  id: string;
  created_at: string;
  title: string;
  content: string;
  author_id: string;
  category: string;
  image_url: string;
}

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts', searchTerm, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('blog_posts')
        .select(`
          id,
          created_at,
          title,
          content,
          author_id,
          category,
          image_url,
          profiles (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      if (selectedCategory !== "Tous") {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const { data: categories } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('category')
        .distinct();

      if (error) throw error;
      return data.map(item => item.category);
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-gray-900">
      {/* Banner Ad */}
      <div className="container mx-auto px-4 pt-6">
        <AdBanner position="banner" maxAds={1} />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="mb-8 dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border dark:border-slate-600/15 bg-white/90 backdrop-blur-md shadow-2xl dark:shadow-slate-500/20">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Le Qwest Blog</CardTitle>
                <CardDescription>Découvrez les dernières nouvelles, astuces et histoires de la communauté Qwestoria.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Rechercher un article..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <ScrollArea className="rounded-md border dark:bg-slate-900/40 dark:border-slate-600/30">
                  <div className="grid grid-cols-[100px_1fr] items-center gap-x-4 py-2 px-3">
                    <div className="text-sm font-medium leading-none">Catégories</div>
                    <div className="flex h-8 items-center space-x-2">
                      <Badge
                        variant={selectedCategory === "Tous" ? "secondary" : "outline"}
                        onClick={() => setSelectedCategory("Tous")}
                        className="cursor-pointer"
                      >
                        Tous
                      </Badge>
                      {categories?.map((category) => (
                        <Badge
                          key={category}
                          variant={selectedCategory === category ? "secondary" : "outline"}
                          onClick={() => setSelectedCategory(category)}
                          className="cursor-pointer"
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-2"></div>
                <p className="text-sm">Chargement des articles...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts?.map((post: Post & { profiles: { username: string, avatar_url: string } }) => (
                  <Card key={post.id} className="dark:bg-slate-800/20 dark:backdrop-blur-xl dark:border dark:border-slate-600/15 bg-white/90 backdrop-blur-md shadow-2xl dark:shadow-slate-500/20">
                    <Link to={`/blog/${post.id}`}>
                      {post.image_url && (
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-t-md"
                        />
                      )}
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold">{post.title}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={post.profiles?.avatar_url} />
                              <AvatarFallback>{post.profiles?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {post.profiles?.username} - {formatDate(post.created_at)}
                            </span>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                          {post.content}
                        </p>
                        <Badge variant="secondary" className="mt-4">{post.category}</Badge>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sidebar Ads */}
            <AdBanner position="sidebar" maxAds={2} />
            
          </div>
        </div>
      </div>

      {/* Popup Ads */}
      <AdBanner position="popup" maxAds={1} />
    </div>
  );
};

export default Blog;
