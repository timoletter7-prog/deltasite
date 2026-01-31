import { useState, useEffect } from "react";
import { Calendar, Trophy, Clock, Users, Zap, Star } from "lucide-react";
import { fetchEvents, getEventParticipants } from "@/lib/supabase";

const fallbackEvents = [
  {
    name: "Weekly PvP Tournament",
    description: "Deel mee aan ons wekelijkse PvP toernooi en win geweldige prijzen! Toernooi vindt plaats elke zaterdagavond.",
    date: "Elke zaterdag",
    time: "20:00 - 22:00",
    players: 64,
    prize: "€50 Steam Gift Card",
    icon: "Trophy",
    comingSoon: true,
    eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  },
  {
    name: "Build Contest",
    description: "Laat je creativiteit zien in onze maandelijkse build contest. Thema wordt elke maand bekend gemaakt.",
    date: "Laatste vrijdag van de maand",
    time: "18:00 - 21:00",
    players: 0,
    prize: "VIP Rank (1 maand)",
    icon: "Star",
    comingSoon: true,
    eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
  },
];

const EventBox = () => {
  const [nextEvent, setNextEvent] = useState<any>(null);
  const [countdown, setCountdown] = useState<string>("");
  const [participantCount, setParticipantCount] = useState<number>(0);

  useEffect(() => {
    const loadNextEvent = async () => {
      try {
        const events = await fetchEvents();
        if (events.length > 0) {
          // Find the next active event (not coming soon)
          const activeEvents = events.filter((event: any) => event.is_active);
          if (activeEvents.length > 0) {
            const next = activeEvents[0];
            setNextEvent(next);

            // Fetch participant count for this event
            try {
              const participants = await getEventParticipants(next.name);
              setParticipantCount(participants.length);
            } catch (error) {
              console.error(`Error fetching participants for ${next.name}:`, error);
              setParticipantCount(0);
            }
          } else {
            // No active events in database, use fallback
            setNextEvent(fallbackEvents[0]);
            setParticipantCount(0);
          }
        } else {
          // No events in database, use fallback
          setNextEvent(fallbackEvents[0]);
          setParticipantCount(0);
        }
      } catch (error) {
        console.error('Error fetching next event:', error);
        // Use fallback on error
        setNextEvent(fallbackEvents[0]);
        setParticipantCount(0);
      }
    };

    loadNextEvent();
  }, []);

  useEffect(() => {
    if (!nextEvent) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const eventTime = new Date(nextEvent.event_date).getTime();
      const eventDuration = (nextEvent.time || 60) * 60 * 1000; // Convert minutes to milliseconds
      const eventEndTime = eventTime + eventDuration;

      if (now >= eventTime && now <= eventEndTime) {
        // Event is currently active
        const timeLeft = eventEndTime - now;
        const minutes = Math.floor(timeLeft / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        if (minutes > 0) {
          setCountdown(`Event bezig - nog ${minutes} min`);
        } else {
          setCountdown(`Event bezig - nog ${seconds} sec`);
        }
      } else if (now < eventTime) {
        // Event hasn't started yet
        const timeLeft = eventTime - now;
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
          setCountdown(`nog ${days} dagen`);
        } else if (hours > 0) {
          setCountdown(`nog ${hours} uur`);
        } else {
          setCountdown(`nog ${minutes} minuten`);
        }
      } else {
        // Event has ended, should be removed from database
        setCountdown("Event afgelopen");
        // Note: In a real application, you would update the database here
        // For now, we'll just show "Event afgelopen"
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 10000); // Update every 10 seconds for active events

    return () => clearInterval(interval);
  }, [nextEvent]);

  if (!nextEvent) {
    return (
      <section className="py-8 relative -mt-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-xl border border-primary/20 p-6 shadow-lg">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-display text-lg md:text-xl font-bold text-foreground">
                      Volgende Event
                    </h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">Geen aankomende events</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Map icon strings to components
  const iconMap: { [key: string]: any } = {
    'Trophy': Trophy,
    'Star': Star,
    'Zap': Zap,
    'Users': Users
  };

  const Icon = iconMap[nextEvent.icon] || Trophy;

  return (
    <section className="py-8 relative -mt-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-xl border border-primary/20 p-6 shadow-lg">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="text-left">
                  <h3 className="font-display text-lg md:text-xl font-bold text-foreground">
                    Volgende Event
                  </h3>
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <Clock className="w-3 h-3" />
                    <span className="text-sm">{countdown}</span>
                  </div>
                </div>
              </div>

              <h2 className="font-display text-xl md:text-2xl font-bold mb-3 text-gradient-primary">
                {nextEvent.name}
              </h2>

              <p className="text-sm text-muted-foreground mb-4 max-w-xl mx-auto">
                {nextEvent.informatie}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border rounded-lg px-3 py-1.5">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="font-display text-sm">{nextEvent.prize}</span>
                </div>
                <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border rounded-lg px-3 py-1.5">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="font-display text-sm">
                    {participantCount}/{nextEvent.max_participants} plekken bezet
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventBox;
