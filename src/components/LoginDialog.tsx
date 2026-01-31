import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface LoginDialogProps {
  children: React.ReactNode;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [minecraftUsername, setMinecraftUsername] = useState('');
  const { login, isLoading } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!minecraftUsername.trim()) return;

    try {
      await login(minecraftUsername.trim());
      setIsOpen(false);
      setMinecraftUsername('');
    } catch (error) {
      console.error('Login failed:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!minecraftUsername.trim()) return;

    try {
      await login(minecraftUsername.trim()); // This will create the account if it doesn't exist
      setIsOpen(false);
      setMinecraftUsername('');
    } catch (error) {
      console.error('Account creation failed:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Inloggen</TabsTrigger>
            <TabsTrigger value="create">Aanmaken</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="minecraft-username">Minecraft Gebruikersnaam</Label>
                <Input
                  id="minecraft-username"
                  type="text"
                  placeholder="Voer je Minecraft naam in..."
                  value={minecraftUsername}
                  onChange={(e) => setMinecraftUsername(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || !minecraftUsername.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Inloggen...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Inloggen
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="create" className="space-y-4">
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="minecraft-username-create">Minecraft Gebruikersnaam</Label>
                <Input
                  id="minecraft-username-create"
                  type="text"
                  placeholder="Kies je Minecraft naam..."
                  value={minecraftUsername}
                  onChange={(e) => setMinecraftUsername(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || !minecraftUsername.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Account aanmaken...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Account aanmaken
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
