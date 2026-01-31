import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { joinEvent } from "@/lib/supabase";
import { toast } from "sonner";

interface EventParticipationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: number;
  eventName: string;
}

export default function EventParticipationDialog({ isOpen, onClose, eventId, eventName }: EventParticipationDialogProps) {
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Voer een gebruikersnaam in");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await joinEvent(eventId, username.trim());

      if (result.success) {
        toast.success(result.message);
        setUsername("");
        onClose();
      }
    } catch (error) {
      console.error('Error joining event:', error);
      toast.error(error instanceof Error ? error.message : "Er is een fout opgetreden bij het inschrijven");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] pt-8">
        <DialogHeader className="space-y-3">
          <DialogTitle>Deelnemen aan {eventName}</DialogTitle>
          <DialogDescription>
            Voer je gebruikersnaam in om deel te nemen aan dit event.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="username" className="text-sm font-medium">
              Gebruikersnaam
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Je Minecraft gebruikersnaam"
              required
              className="w-full"
            />
          </div>
          <DialogFooter className="gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuleren
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Bezig..." : "Deelnemen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
