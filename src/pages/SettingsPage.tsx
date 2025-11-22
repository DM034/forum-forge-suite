import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";

type SocialLinks = {
  website?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
};

const SettingsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();

  const profile = useMemo(() => {
    const p = (user as any)?.profile || (user as any)?.userProfile || {};
    if (typeof p?.socialLinks === "string") {
      try { p.socialLinks = JSON.parse(p.socialLinks); } catch { p.socialLinks = {}; }
    }
    return p;
  }, [user]);

  const [imagePreview, setImagePreview] = useState<string>(profile?.avatarUrl || "");
  const [form, setForm] = useState({
    fullName: (profile?.fullName as string) || (user as any)?.fullName || ((user as any)?.email ? String((user as any).email).split("@")[0] : ""),
    email: (user as any)?.email || "",
    bio: (profile?.bio as string) || "",
    phone: (profile?.phone as string) || "",
    website: ((profile?.socialLinks as SocialLinks)?.website as string) || "",
    facebook: ((profile?.socialLinks as SocialLinks)?.facebook as string) || "",
    twitter: ((profile?.socialLinks as SocialLinks)?.twitter as string) || "",
    instagram: ((profile?.socialLinks as SocialLinks)?.instagram as string) || "",
    linkedin: ((profile?.socialLinks as SocialLinks)?.linkedin as string) || "",
  });

  useEffect(() => {
    setForm(f => ({
      ...f,
      fullName: (profile?.fullName as string) || (user as any)?.fullName || ((user as any)?.email ? String((user as any).email).split("@")[0] : ""),
      email: (user as any)?.email || "",
      bio: (profile?.bio as string) || "",
      phone: (profile?.phone as string) || "",
      website: ((profile?.socialLinks as SocialLinks)?.website as string) || "",
      facebook: ((profile?.socialLinks as SocialLinks)?.facebook as string) || "",
      twitter: ((profile?.socialLinks as SocialLinks)?.twitter as string) || "",
      instagram: ((profile?.socialLinks as SocialLinks)?.instagram as string) || "",
      linkedin: ((profile?.socialLinks as SocialLinks)?.linkedin as string) || "",
    }));
    setImagePreview(profile?.avatarUrl || "");
  }, [profile, user]);

  const getUserInitials = () => {
    const base = form.fullName || ((user as any)?.email ? String((user as any).email).split("@")[0] : "U");
    const parts = String(base).trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return base.substring(0, 2).toUpperCase();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: t("common.error"), description: t("settings.maxSize"), variant: "destructive" });
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const payload = {
      user: {
        email: form.email,
        fullName: form.fullName,
      },
      profile: {
        fullName: form.fullName,
        bio: form.bio,
        avatarUrl: imagePreview || profile?.avatarUrl || "",
        phone: form.phone,
        socialLinks: {
          website: form.website,
          facebook: form.facebook,
          twitter: form.twitter,
          instagram: form.instagram,
          linkedin: form.linkedin,
        },
      },
    };
    try {
      localStorage.setItem("snmvm_profile", JSON.stringify(payload));
      window.dispatchEvent(new CustomEvent("snmvm:profileUpdated", { detail: payload }));
      toast({ title: t("common.saved"), description: t("settings.savedDesc") });
    } catch {
      toast({ title: t("common.error"), description: t("settings.saveError"), variant: "destructive" });
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">{t("settings.title")}</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">{t("settings.accountSettings")}</CardTitle>
              <CardDescription>{t("profile.personalInfo")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>{t("settings.profilePicture")}</Label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={imagePreview} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 w-full">
                    <Label htmlFor="avatar" className="cursor-pointer">
                      <div className="flex items-center justify-center gap-2 px-4 py-2 border border-input rounded-md hover:bg-accent hover:text-accent-foreground transition-colors w-full sm:w-fit">
                        <Upload className="w-4 h-4" />
                        <span className="text-sm">{t("settings.uploadImage")}</span>
                      </div>
                    </Label>
                    <Input id="avatar" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    <p className="text-xs text-muted-foreground mt-2">{t("settings.maxSize")}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("settings.fullName")}</Label>
                  <Input id="name" name="fullName" value={form.fullName} onChange={onChange} placeholder="Nom complet" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("settings.email")}</Label>
                  <Input id="email" name="email" type="email" value={form.email} onChange={onChange} placeholder="email@exemple.com" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">{t("profile.bio")}</Label>
                  <Input id="bio" name="bio" value={form.bio} onChange={onChange} placeholder={t("settings.bioPlaceholder", "Présentez-vous en quelques mots")} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="phone">{t("settings.phone", "Téléphone")}</Label>
                  <Input id="phone" name="phone" value={form.phone} onChange={onChange} placeholder="+261 33 00 000 00" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" name="website" value={form.website} onChange={onChange} placeholder="https://snmvm.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input id="facebook" name="facebook" value={form.facebook} onChange={onChange} placeholder="https://facebook.com/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input id="twitter" name="twitter" value={form.twitter} onChange={onChange} placeholder="https://twitter.com/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input id="instagram" name="instagram" value={form.instagram} onChange={onChange} placeholder="https://instagram.com/..." />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input id="linkedin" name="linkedin" value={form.linkedin} onChange={onChange} placeholder="https://linkedin.com/in/..." />
                </div>
              </div>

              <Button onClick={handleSave} className="w-full sm:w-auto">
                {t("settings.saveChanges")}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">{t("settings.notifications")}</CardTitle>
              <CardDescription>{t("settings.emailNotificationsDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm md:text-base">{t("settings.emailNotifications")}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">{t("settings.emailNotificationsDesc")}</div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm md:text-base">{t("settings.pushNotifications")}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">{t("settings.pushNotificationsDesc")}</div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">{t("settings.privacy")}</CardTitle>
              <CardDescription>{t("settings.profileVisibilityDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm md:text-base">{t("settings.profileVisibility")}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">{t("settings.profileVisibilityDesc")}</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm md:text-base">{t("settings.showEmail")}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">{t("settings.showEmailDesc")}</div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
