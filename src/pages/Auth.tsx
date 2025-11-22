import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import SEOHead from "@/components/SEOHead";
import { useAuth } from "@/contexts/AuthContext";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

const signupSchema = z.object({
  fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

const Auth = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, login, signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const defaultEmail = import.meta.env.VITE_DEFAULT_EMAIL || "admin@snmvm.com";
  const defaultPassword = import.meta.env.VITE_DEFAULT_PASSWORD || "Admin123!";
  const autoLoginKey = "snmvm_auto_login";
  const [autoLogin, setAutoLogin] = useState<boolean>(() => localStorage.getItem(autoLoginKey) === "1");

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: defaultEmail, password: defaultPassword },
  });

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (user) navigate("/community");
  }, [user, navigate]);

  useEffect(() => {
    if (!user && autoLogin) {
      setIsLoading(true);
      login(defaultEmail, defaultPassword)
        .then(() => navigate("/community"))
        .finally(() => setIsLoading(false));
    }
  }, [autoLogin, user, login, navigate, defaultEmail, defaultPassword]);

  const handleLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      navigate("/community");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      await signup(data.email, data.password, data.fullName);
      navigate("/community");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setIsLoading(true);
    try {
      await login(defaultEmail, defaultPassword);
      navigate("/community");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAutoLogin = (checked: boolean) => {
    setAutoLogin(checked);
    if (checked) localStorage.setItem(autoLoginKey, "1");
    else localStorage.removeItem(autoLoginKey);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SEOHead />
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-xl bg-primary items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{t("auth.welcome", "Bienvenue sur le forum")}</h1>
          <p className="text-muted-foreground">{t("auth.subtitle", "Échangez, entraidez-vous et restez informé.")}</p>
        </div>

        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button
            type="button"
            onClick={handleQuickLogin}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isLoading}
          >
            Connexion rapide
          </Button>
          <button
            type="button"
            onClick={() => toggleAutoLogin(!autoLogin)}
            className={`w-full inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-colors ${
              autoLogin ? "bg-[hsl(var(--muted))] border-[hsl(var(--ring))]" : "bg-transparent border-[hsl(var(--border))]"
            }`}
            disabled={isLoading}
          >
            {autoLogin ? "Connexion auto activée" : "Activer connexion auto"}
          </button>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t("auth.login", "Se connecter")}</TabsTrigger>
            <TabsTrigger value="signup">{t("auth.signup", "Créer un compte")}</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">{t("auth.email", "Email")}</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder={defaultEmail}
                  {...loginForm.register("email")}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">{t("auth.password", "Mot de passe")}</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder={defaultPassword}
                  {...loginForm.register("password")}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? t("auth.loading", "Connexion…") : t("auth.signInButton", "Se connecter")}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">{t("auth.fullName", "Nom complet")}</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Daniel Smith"
                  {...signupForm.register("fullName")}
                />
                {signupForm.formState.errors.fullName && (
                  <p className="text-sm text-destructive">
                    {signupForm.formState.errors.fullName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">{t("auth.email", "Email")}</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="votre@email.com"
                  {...signupForm.register("email")}
                />
                {signupForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {signupForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">{t("auth.password", "Mot de passe")}</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  {...signupForm.register("password")}
                />
                {signupForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {signupForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                disabled={isLoading}
              >
                {isLoading ? t("auth.creating", "Création…") : t("auth.signUpButton", "Créer un compte")}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Identifiants par défaut: {defaultEmail} / {defaultPassword}
        </p>
      </div>
    </div>
  );
};

export default Auth;
