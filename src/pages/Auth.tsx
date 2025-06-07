
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const formSchema = z.object({
  email: z.string().email("Entrez un email valide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères").optional(),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref');
  
  // Rediriger si l'utilisateur est déjà connecté
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  // Réinitialiser le formulaire lors du changement de mode
  useEffect(() => {
    form.reset({
      email: "",
      password: "",
      username: isLogin ? undefined : "",
    });
  }, [isLogin, form]);

  const socialLinks = [
    { 
      name: "TikTok", 
      url: "https://www.tiktok.com/@bradcon_tv",
      color: "bg-foreground hover:bg-foreground/90 text-background"
    },
    { 
      name: "Twitch", 
      url: "https://www.twitch.tv/bradcon91",
      color: "bg-purple-600 hover:bg-purple-700 text-white"
    },
    { 
      name: "Snapchat", 
      url: "https://www.snapchat.com/add/bradcontv",
      color: "bg-yellow-400 hover:bg-yellow-500 text-foreground"
    },
    { 
      name: "Instagram", 
      url: "https://www.instagram.com/eymeric.alt/",
      color: "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white"
    },
  ];

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Fonction handleSubmit appelée avec:", values);
    setLoading(true);

    try {
      if (isLogin) {
        // Sign in
        console.log("Tentative de connexion avec email:", values.email);
        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        console.log("Résultat connexion:", { data, error });

        if (error) throw error;

        toast.success("Connexion réussie !");
        navigate("/dashboard");
      } else {
        // Sign up
        console.log("Tentative d'inscription avec email:", values.email);
        const signUpData: any = {
          email: values.email,
          password: values.password,
          options: {
            data: {
              username: values.username,
            },
          },
        };

        // Ajouter le code de parrainage si présent
        if (referralCode) {
          signUpData.options.data.referral_code = referralCode;
        }

        const { data, error } = await supabase.auth.signUp(signUpData);

        console.log("Résultat inscription:", { data, error });

        if (error) throw error;

        toast.success(
          "Inscription réussie ! Vérifiez votre email pour confirmer."
        );
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error("Erreur d'authentification:", error);
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-40 h-40 bg-primary/10 rounded-full blur-2xl animate-float" style={{ top: '10%', left: '5%', animationDelay: '0s' }}></div>
        <div className="absolute w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-float" style={{ top: '60%', right: '10%', animationDelay: '3s' }}></div>
        <div className="absolute w-48 h-48 bg-primary/5 rounded-full blur-2xl animate-float" style={{ bottom: '15%', left: '15%', animationDelay: '6s' }}></div>
      </div>

      <motion.div 
        className="w-full max-w-md relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-6 flex items-center justify-center">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Qwestoria</h1>
            <p className="text-muted-foreground">Votre plateforme gaming</p>
          </div>
        </motion.div>

        {referralCode && (
          <motion.div variants={itemVariants} className="mb-4">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-foreground">
                    Vous avez été invité avec le code : <strong>{referralCode}</strong>
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Card className="shadow-lg border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">
              {isLogin ? "Connexion" : "Inscription"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isLogin
                ? "Accédez à votre compte"
                : "Rejoignez la communauté Qwestoria"}
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
                        <FormLabel className="text-sm font-medium text-foreground">
                          Nom d'utilisateur
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Votre pseudo"
                            className="bg-background border-input focus:border-primary"
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
                      <FormLabel className="text-sm font-medium text-foreground">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="votre@email.com"
                          className="bg-background border-input focus:border-primary"
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
                      <FormLabel className="text-sm font-medium text-foreground">
                        Mot de passe
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="••••••••"
                          className="bg-background border-input focus:border-primary"
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
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {isLogin ? "Se connecter" : "S'inscrire"}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-muted-foreground hover:text-foreground"
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
            <p className="text-sm text-muted-foreground">Suivez BradCon sur les réseaux sociaux</p>
            <div className="flex flex-wrap justify-center gap-2">
              {socialLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`rounded px-3 py-2 text-xs font-semibold transition hover:scale-105 ${link.color}`}
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
