import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Heart, Bookmark } from "lucide-react";

const Inspirations = () => {
  const inspirations = [
    { id: 1, title: "Modern Kitchen Design", likes: 234, saved: 45 },
    { id: 2, title: "Minimalist Living Room", likes: 189, saved: 32 },
    { id: 3, title: "Cozy Bedroom Setup", likes: 312, saved: 67 },
    { id: 4, title: "Industrial Office Space", likes: 156, saved: 28 },
    { id: 5, title: "Scandinavian Bathroom", likes: 278, saved: 51 },
    { id: 6, title: "Bohemian Patio", likes: 201, saved: 39 },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="pt-20 px-6 pb-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Inspirations</h1>
            <p className="text-muted-foreground mb-8">
              Discover amazing designs and creative ideas from our community
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inspirations.map((item) => (
                <Card key={item.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-primary/5 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl">🎨</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-3">{item.title}</h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{item.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bookmark className="w-4 h-4" />
                        <span>{item.saved}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Inspirations;
