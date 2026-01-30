import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Gamepad2, ShoppingCart, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useCart } from "@/contexts/CartContext";
import { useTheme } from "next-themes";
import { useUser } from "@/contexts/UserContext";
import { getSkinUrl } from "@/lib/utils";
import CartDrawer from "@/components/CartDrawer";
import LoginDialog from "@/components/LoginDialog";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useUser();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Gamemodes", path: "/gamemodes" },
    { name: "Events", path: "/events" },
    { name: "Shop", path: "/shop" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/server-icon.jpg"
              alt="Server Icon"
              className="w-12 h-12 rounded-lg"
            />
            <span className="font-display text-2xl font-bold text-gradient-primary">
              DELTA MC
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-wrap items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-display text-sm uppercase tracking-wider transition-colors duration-300 whitespace-nowrap ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Theme Toggle */}
            <div className="flex items-center gap-2 min-w-[96px] flex-shrink-0">
              <Moon className={`w-4 h-4 ${theme === "light" ? "text-muted-foreground" : "text-foreground"}`} />
              <Switch
                checked={theme === "light"}
                onCheckedChange={(checked) => setTheme(checked ? "light" : "dark")}
              />
              <Sun className={`w-4 h-4 ${theme === "light" ? "text-foreground" : "text-muted-foreground"}`} />
            </div>

            {/* User Profile / Login */}
            {user ? (
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  to={`/profile/${user.minecraft_username}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <img
                    src={getSkinUrl(user.minecraft_username)}
                    alt={`${user.minecraft_username} skin`}
                    className="w-6 h-6 rounded"
                  />
                  <span className="hidden xl:inline">{user.minecraft_username}</span>
                </Link>
                <Button variant="outline" size="sm" className="whitespace-nowrap">
                  Uitloggen
                </Button>
              </div>
            ) : (
              <LoginDialog>
                <Button variant="outline" size="sm" className="whitespace-nowrap">
                  Inloggen
                </Button>
              </LoginDialog>
            )}

            <div className="flex items-center gap-2 flex-shrink-0">
              <CartDrawer />
              <Link to="/tutorial">
                <Button variant="hero" size="lg" className="whitespace-nowrap">
                  Speel Nu
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button and Cart */}
          <div className="md:hidden flex items-center gap-2">
            <CartDrawer />
            <button
              className="text-foreground"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 border-t border-border">
                <div className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`font-display text-sm uppercase tracking-wider py-2 transition-colors ${
                        isActive(link.path)
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}

                  {/* Mobile Cart and User Actions */}
                  <div className="flex items-center justify-between py-2">
                    <CartDrawer />
                    {user ? (
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/profile/${user.minecraft_username}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <img
                            src={getSkinUrl(user.minecraft_username)}
                            alt={`${user.minecraft_username} skin`}
                            className="w-6 h-6 rounded"
                          />
                          <span>{user.minecraft_username}</span>
                        </Link>
                        <Button variant="outline" size="sm" onClick={logout}>
                          Uitloggen
                        </Button>
                      </div>
                    ) : (
                      <LoginDialog>
                        <Button variant="outline" size="sm">
                          Inloggen
                        </Button>
                      </LoginDialog>
                    )}
                  </div>

                  <Link to="/tutorial" onClick={() => setIsOpen(false)}>
                    <Button variant="hero" size="lg" className="w-full mt-2">
                      Speel Nu
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
