
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Entrez un email valide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères").optional(),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const socialLinks = [
    { 
      name: "TikTok", 
      url: "https://www.tiktok.com/@bradcon_tv",
      color: "bg-black hover:bg-gray-900"
    },
    { 
      name: "Twitch", 
      url: "https://www.twitch.tv/bradcon91",
      color: "bg-purple-700 hover:bg-purple-800"
    },
    { 
      name: "Snapchat", 
      url: "https://www.snapchat.com/add/bradcontv",
      color: "bg-yellow-400 hover:bg-yellow-500 text-black"
    },
    { 
      name: "Instagram", 
      url: "https://www.instagram.com/eymeric.alt/",
      color: "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600"
    },
  ];

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      if (isLogin) {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) throw error;

        toast.success("Connexion réussie !");
        navigate("/dashboard");
      } else {
        // Sign up
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              username: values.username,
            },
          },
        });

        if (error) throw error;

        toast.success(
          "Inscription réussie ! Vérifiez votre email pour confirmer."
        );
        setIsLogin(true);
      }
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#1A1F2C] to-[#221F26] p-4">
      <motion.div 
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-6 flex items-center justify-center">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute h-full w-full animate-pulse rounded-full bg-[#9b87f5]/30"></div>
            <div className="absolute h-14 w-14 rounded-full bg-gradient-to-r from-[#9b87f5] to-amber-500 shadow-lg"></div>
            <div className="absolute h-12 w-12 rounded-full bg-[#221F26]"></div>
            <div className="absolute h-10 w-10 rounded-full bg-gradient-to-r from-[#9b87f5] to-amber-400 shadow-inner"></div>
            <span className="relative text-lg font-bold text-white">BC</span>
          </div>
          <h1 className="ml-3 text-3xl font-bold text-gradient">BradHub</h1>
        </motion.div>

        <Card className="border-[#9b87f5] bg-[#221F26] text-white shadow-xl shadow-[#9b87f5]/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-[#9b87f5]">
              {isLogin ? "Connexion" : "Inscription"} à BradHub
            </CardTitle>
            <CardDescription className="text-gray-300">
              {isLogin
                ? "Accédez à votre compte"
                : "Rejoignez la communauté BradHub"}
            </CardDescription>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <CardContent className="space-y-4">
                {!isLogin && (
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-300">
                          Nom d'utilisateur
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Votre pseudo"
                            className="border-[#9b87f5] bg-[#1A1F2C] text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="votre@email.com"
                          className="border-[#9b87f5] bg-[#1A1F2C] text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">
                        Mot de passe
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="••••••••"
                          className="border-[#9b87f5] bg-[#1A1F2C] text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full gap-2 bg-gradient-to-r from-[#9b87f5] to-amber-500 text-white transition-all hover:from-[#8A76E5] hover:to-amber-600"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {isLogin ? "Se connecter" : "S'inscrire"}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-[#9b87f5] hover:bg-[#1A1F2C] hover:text-white"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin
                    ? "Pas encore de compte ? S'inscrire"
                    : "Déjà un compte ? Se connecter"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <motion.div variants={itemVariants} className="mt-8">
          <div className="flex flex-col items-center space-y-3">
            <p className="text-sm text-gray-400">Suivez BradCon sur les réseaux sociaux</p>
            <div className="flex flex-wrap justify-center gap-2">
              {socialLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`rounded px-3 py-2 text-xs font-semibold text-white transition hover:scale-105 ${link.color}`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Auth;
