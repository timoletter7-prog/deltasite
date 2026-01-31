import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useUser } from "@/contexts/UserContext";
import { getUserPurchasesByUsername } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, ShoppingBag, Calendar, DollarSign, Package } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useUser();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!user?.minecraft_username) {
        setLoading(false);
        return;
      }

      try {
        const userPurchases = await getUserPurchasesByUsername(user.minecraft_username);
        setPurchases(userPurchases);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-4xl font-bold text-foreground mb-6">
              Niet ingelogd
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Log in om je profiel te bekijken.
            </p>
            <Button asChild>
              <Link to="/">Terug naar Home</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const totalSpent = purchases.reduce((sum, purchase) => sum + (purchase.price || 0), 0);
  const uniqueItems = new Set(purchases.map(p => p.item_name)).size;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Profile Picture - Top Center */}
            <div className="text-center mb-8">
              <div className="relative mx-auto">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/30">
                  <img
                    src={`https://mc-heads.net/avatar/${encodeURIComponent(user.minecraft_username)}/128`}
                    alt={`${user.minecraft_username} skin`}
                    className="w-32 h-32 rounded-full"
                    onError={(e) => {
                      // Fallback to default Steve skin if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = `https://mc-heads.net/avatar/Steve/128`;
                    }}
                  />
                </div>
                {/* Decorative ring */}
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse"></div>
              </div>
            </div>

            {/* Profile Header */}
            <div className="text-center mb-12">
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                <span className="text-foreground">Welkom terug, </span>
                <span className="text-gradient-primary">{user.minecraft_username}</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Lid sinds {new Date(user.created_at).toLocaleDateString('nl-NL')}
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <ShoppingBag className="w-5 h-5" />
                    Aankopen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{purchases.length}</div>
                  <p className="text-blue-700">Totaal aantal aankopen</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Package className="w-5 h-5" />
                    Unieke Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{uniqueItems}</div>
                  <p className="text-green-700">Verschillende items</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <DollarSign className="w-5 h-5" />
                    Totaal Uitgegeven
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">€{totalSpent.toFixed(2)}</div>
                  <p className="text-purple-700">Totaal besteed</p>
                </CardContent>
              </Card>
            </div>

            {/* Purchase History */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6" />
                  Aankoop Geschiedenis
                </CardTitle>
                <CardDescription>
                  Alle items die je hebt gekocht op DeltaMC
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Aankopen laden...</p>
                  </div>
                ) : purchases.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Nog geen aankopen</h3>
                    <p className="text-muted-foreground mb-6">
                      Je hebt nog geen items gekocht. Bezoek de shop om te beginnen!
                    </p>
                    <Button asChild>
                      <Link to="/shop">Naar Shop</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {purchases.map((purchase, index) => (
                      <div key={purchase.id || index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">{purchase.item_name}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(purchase.created_at).toLocaleDateString('nl-NL')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-foreground">
                            €{purchase.price?.toFixed(2) || '0.00'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline">
                <Link to="/shop">Verder Winkelen</Link>
              </Button>
              <Button variant="destructive" onClick={logout}>
                Uitloggen
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Profile;
