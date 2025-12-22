# Bundle pour partage (Routing + Layout + Auth + API client + Services + Types)

Ce fichier regroupe en un seul endroit les parties suivantes du projet :
- Routing (routes définies dans `src/App.tsx`)
- Composant Layout principal
- Auth côté React : `AuthContext` + `useAuth` + hook `useAuthApi`
- Page de login / inscription (Auth page)
- Client API (axios) et attachement du token
- Services (`authService`, `profileService`)
- Modèles / types (User / Post / Comment) déduits

Vous pouvez copier-coller ce fichier dans un chat ou l'envoyer en une seule pièce.

---

## 1) Routing (extrait de `src/App.tsx`)

```tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Auth from "./pages/Auth";
import Community from "./pages/Community";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import SettingsPage from "./pages/SettingsPage";
import Inspirations from "./pages/Inspirations";
import NotFound from "./pages/NotFound";
import Resources from "./pages/Resources";
import Rules from "./pages/Rules";
import FAQ from "./pages/FAQ";
import PublishingGuide from "./pages/PublishingGuide";
import Moderation from "./pages/Moderation";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/community" replace />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/profile/me" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/inspirations" element={<ProtectedRoute><Inspirations /></ProtectedRoute>} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/guide" element={<PublishingGuide />} />
            <Route path="/moderation" element={<Moderation />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
```

---

## 2) Layout principal (extrait de `src/components/Layout.tsx`)

```tsx
import { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <Header />
            {children}
          <Footer/>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
```

Notes : le `Layout` enveloppe l'application, inclut le `Header`, `Footer`, et la `Sidebar`.

---

## 3) Auth côté React — `AuthContext` + `useAuth` (extrait de `src/contexts/AuthContext.tsx`)

Comportement principal :
- conserve `user` et `isLoading` dans le state
- stocke `token`, `refreshToken` et `user` dans `localStorage` au login/signup
- fournit `login`, `signup`, `logout`

```tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";
import authService from "@/services/authService";

interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await authService.login({ email, password });
      const { accessToken, refreshToken,user: userData } = res.data.data;
      
      // Save tokens and user in localStorage
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(userData));
    
      setUser(userData);

      toast.success("Connexion réussie");
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || "Erreur lors de la connexion";
      toast.error(msg);
      throw error;
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      const res = await authService.register({
        email,
        password,
        fullName,
      });

      const { user: userData, accessToken, refreshToken } = res.data.data;

      // Save tokens and user in localStorage
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);

      toast.success("Compte créé avec succès");
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        "Erreur lors de la création du compte";
      toast.error(msg);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Déconnexion réussie");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
```

Explication rapide :
- le token est stocké dans `localStorage` sous la clé `token`.
- la logique d'obtention du profil courant (/me) est généralement effectuée via un appel vers un service `userService` ou `authService` si nécessaire — ici le `user` renvoyé par le login est stocké localement.

---

## 4) Hook utilitaire `useAuthApi` (extrait de `src/hooks/useAuth.js`)

```javascript
import { useMutation } from "@tanstack/react-query";
import authService from "@/services/authService";

export function useAuthApi() {
  const login = useMutation({
    mutationFn: ({ email, password }) => authService.login({ email, password }),
  });

  const signup = useMutation({
    mutationFn: ({ email, password, fullName }) =>
      authService.register({ email, password, fullName }),
  });

  return { login, signup };
}
```

---

## 5) Client API (axios) — `src/api/apiClient.js`

Le client axios centralise `baseURL`, `timeout`, et attache automatiquement le `Authorization` header avec le token lu depuis `localStorage` via un interceptor.

```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: "https://forum-backend-ea7r.onrender.com/api",
  timeout: 15000
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;
```

Notes sécurité :
- Le stockage du token dans `localStorage` est simple mais expose au XSS. Si possible, préférez les httpOnly cookies et un flow de refresh côté backend.

---

## 6) Services (extraits)

### `src/services/authService.js`

```javascript
import apiClient from '../api/apiClient';

const authService = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  refresh: (refreshToken) => apiClient.post('/auth/refresh', { refreshToken })
};

export default authService;
```

### `src/services/profileService.js`

```javascript
import apiClient from '../api/apiClient';

const profileService = {
  getById: (id) => apiClient.get(`/profiles/${id}`),
  update: (id, data) =>
    apiClient.put(`/profiles/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
};

export default profileService;
```

Si vous avez un `userService` ou `postService`, le pattern est le même : utiliser `apiClient` et laisser l'interceptor ajouter l'Authorization header.

---

## 7) Page Auth (login / signup) — `src/pages/Auth.tsx` (extrait)

```tsx
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

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  useEffect(() => {
    if (user) navigate("/community");
  }, [user, navigate]);

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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SEOHead />
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-xl bg-blue-600 items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{t("auth.welcome", "SNMVM")}</h1>
          <p className="text-muted-foreground">
            {t("auth.subtitle", "Sendika Nasionalin'ny Mpisehatra Volamena eto Madagasikara")}
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t("auth.login", "Se connecter")}</TabsTrigger>
            <TabsTrigger value="signup">{t("auth.signup", "Créer un compte")}</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4 mt-4">
              {/* champs email / password */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t("auth.loading", "Connexion…") : t("auth.signInButton", "Se connecter")}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4 mt-4">
              {/* champs fullName / email / password */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t("auth.creating", "Création…") : t("auth.signUpButton", "Créer un compte")}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
```

---

## 8) Modèles / Types (déduits)

D'après le code, on utilise au minimum la structure suivante pour `User` :

```ts
interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  // autres champs possibles : avatarUrl?, role?, bio?
}
```

Exemples pour Post / Comment (non fournis explicitement, mais usuels) :

```ts
interface Post {
  id: string;
  title: string;
  body: string;
  authorId: string;
  author?: User;
  createdAt: string;
  updatedAt?: string;
  reactions?: Record<string, number>;
}

interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
}
```

Ajoutez/chassez les champs exacts selon votre backend.

---

## 9) Comment le token est attaché aux requêtes

- `src/api/apiClient.js` instancie `axios` et définit un `request` interceptor :
  - lit `localStorage.getItem('token')`
  - si présent, revient avec `Authorization: Bearer <token>` sur `config.headers`
- Donc après le login (où le token est sauvegardé dans localStorage), les prochaines requêtes utiliseront automatiquement le token.

---

## 10) Récupérer le profil courant (/me)

- Dans ce projet, le backend renvoie le `user` au moment du `login`/`register` (dans `res.data.data.user`). Le `AuthContext` sauvegarde cet objet en local.
- Si vous préférez avoir une route `/auth/me` ou `/users/me`, créez `userService.getMe = () => apiClient.get('/auth/me')` et appelez-la au montage de `AuthProvider` pour rafraîchir le profil (ex: si token déjà dans localStorage au reload).

Exemple d'appel au montage :
```ts
useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    userService.getMe().then(res => setUser(res.data)).catch(()=>{/*force logout si invalide*/});
  }
},[]);
```

---

## 11) Conseils rapides / points d'attention

- Stockage du token : `localStorage` = simple mais vulnérable aux XSS. Si possible, utilisez httpOnly cookies + endpoints de refresh.
- Refresh token : vous avez déjà `authService.refresh`; implémentez un interceptor `response` pour intercepter 401, tenter un refresh et rejouer la requête.
- Sécurisez les opérations sensibles côté serveur (vérifier owner des resources).

---

## 12) Utilisation : comment envoyer ce fichier au chat

- Copiez le contenu de ce fichier (ou envoyez le fichier entier) au destinataire. Il contient tous les éléments demandés en une seule entité.

---

Fin du bundle. Si vous voulez, je peux :
- générer une version `.tsx` prête à coller (par exemple `src/combined_example.tsx`) avec imports adaptés, ou
- ajouter un exemple d'interceptor `refresh token` complet, ou
- créer automatiquement un fichier dans le repo (je l'ai déjà créé ici : `src/combined_for_chat.md`).

Dites-moi ce que vous préférez ensuite.