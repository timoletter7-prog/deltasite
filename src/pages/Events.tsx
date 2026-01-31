import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Trophy, Zap, Star, Sword, Shield, Crown, Heart, Target, Gamepad2, Flame, Gem, Award, Skull } from "lucide-react";
import { supabase, fetchEvents, getEventParticipants } from "@/lib/supabase";
import EventParticipationDialog from "@/components/EventParticipationDialog";

const fallbackEvents = [
  {
    name: "Weekly PvP Tournament",
    description: "Deel mee aan ons wekelijkse PvP toernooi en win geweldige prijzen! Toernooi vindt plaats elke zaterdagavond.",
    date: "Elke zaterdag",
    time: "20:00 - 22:00",
    players: 64,
    prize: "-giftcard -prefix [winnaar]👑",
    icon: Trophy,
    comingSoon: false,
  },
  {
    name: "Build Contest",
    description: "Laat je creativiteit zien in onze maandelijkse build contest. Thema wordt elke maand bekend gemaakt.",
    date: "Laatste vrijdag van de maand",
    time: "18:00 - 21:00",
    players: 0,
    prize: "VIP Rank (1 maand)",
    icon: Star,
    comingSoon: true,
  },
  {
    name: "Survival Race",
    description: "Race tegen de klok in onze survival race! Verzamel items zo snel mogelijk en word de snelste speler.",
    date: "Elke dinsdag",
    time: "19:00 - 20:00",
    players: 32,
    prize: "Custom Cape",
    icon: Zap,
    comingSoon: false,
  },
  {
    name: "Community Meetup",
    description: "Kom gezellig bij elkaar in onze community meetup. Praat met andere spelers en deel je ervaringen.",
    date: "Eerste zondag van de maand",
    time: "15:00 - 17:00",
    players: 0,
    prize: "Community Badge",
    icon: Users,
    comingSoon: true,
  },
];

const Events = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [participantCounts, setParticipantCounts] = useState<{ [key: string]: number }>({});
  const [onlineCount, setOnlineCount] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<{ id: number; name: string } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [countdowns, setCountdowns] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        const eventsData = await fetchEvents();
        if (eventsData.length > 0) {
          // Transform database events to match the expected format
          const transformedEvents = eventsData.map((event: any) => {
            const eventDate = new Date(event.event_date);
            const now = new Date();
            const isComingSoon = !event.is_active; // Use is_active field instead of date comparison

            // Map icon strings to components
            const iconMap: { [key: string]: any } = {
              'Trophy': Trophy,
              'Star': Star,
              'Zap': Zap,
              'Users': Users,
              'Sword': Sword,
              'Shield': Shield,
              'Crown': Crown,
              'Heart': Heart,
              'Target': Target,
              'Gamepad2': Gamepad2,
              'Flame': Flame,
              'Gem': Gem,
              'Award': Award,
              'Skull': Skull
            };

            return {
              id: event.id,
              name: event.name,
              description: event.informatie,
              date: eventDate.toLocaleDateString('nl-NL'),
              time: eventDate.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
              players: event.max_participants,
              prize: event.prize,
              icon: iconMap[event.icon] || Trophy,
              comingSoon: isComingSoon,
              eventDate: eventDate,
              imageUrl: event.image_url,
              participant_count: event.participant_count || 0
            };
          });
          setEvents(transformedEvents);

          // Participant counts are already included in the events data from fetchEvents()
          // No need to set separate participantCounts state
        } else {
          // Use fallback events if no database events
          setEvents(fallbackEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents(fallbackEvents);
      }
    };

    const fetchOnlineCount = async () => {
      try {
        const { data, error } = await supabase
          .from('online_players')
          .select('count')
          .order('timestamp', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching online count:', error);
          return;
        }

        if (data) {
          setOnlineCount(data.count);
        }
      } catch (error) {
        console.error('Error fetching online count:', error);
      }
    };

    fetchEventsData();
    fetchOnlineCount();

    // Fetch online count every 30 seconds
    const interval = setInterval(fetchOnlineCount, 30000);

    return () => clearInterval(interval);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const updateCountdowns = () => {
      const newCountdowns: { [key: string]: string } = {};
      events.forEach((event) => {
        if (event.comingSoon && event.eventDate) {
          const now = new Date().getTime();
          const eventTime = new Date(event.eventDate).getTime();
          const timeLeft = eventTime - now;

          if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            newCountdowns[event.id || event.name] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
          } else {
            newCountdowns[event.id || event.name] = "Event Started!";
          }
        }
      });
      setCountdowns(newCountdowns);
    };

    updateCountdowns();
    const countdownInterval = setInterval(updateCountdowns, 1000);

    return () => clearInterval(countdownInterval);
  }, [events]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
            <span className="text-foreground">DELTA MC </span>
            <span className="text-gradient-primary">EVENTS</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
            Neem deel aan onze spannende events en win geweldige prijzen! Er is altijd wat te doen op Delta MC.
          </p>
        </div>
      </section>

      {/* Events List */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {events.map((event, index) => {
              const Icon = event.icon;
              return (
                <div
                  key={event.id || event.name}
                  className={`grid lg:grid-cols-2 gap-8 items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  } ${event.comingSoon ? "opacity-70" : ""}`}
                >
                  {/* Content */}
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        event.comingSoon
                          ? "bg-secondary"
                          : "bg-gradient-primary glow-primary"
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          event.comingSoon
                            ? "text-muted-foreground"
                            : "text-primary-foreground"
                        }`} />
                      </div>
                      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                        {event.name}
                      </h2>
                      {event.comingSoon && (
                        <span className="bg-secondary px-3 py-1 rounded-full text-xs font-display text-muted-foreground uppercase tracking-wider">
                          Coming Soon
                        </span>
                      )}
                    </div>

                    <p className="text-lg text-muted-foreground mb-6 font-body">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span className="font-display text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="font-display text-sm">{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        <span className="font-display text-sm">
                          {event.participant_count || 0}/{event.players || '∞'} plekken bezet
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-primary" />
                        <span className="font-display text-sm">{event.prize}</span>
                      </div>
                    </div>

                    {event.comingSoon ? (
                      <Button variant="outline" size="lg" disabled>
                        <Clock className="w-5 h-5" />
                        <span>Binnenkort Beschikbaar</span>
                      </Button>
                    ) : (
                      <Button
                        variant="hero"
                        size="lg"
                        className="group"
                        onClick={() => {
                          setSelectedEvent({ id: event.id, name: event.name });
                          setIsDialogOpen(true);
                        }}
                      >
                        <span>Deelnemen</span>
                        <Zap className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </Button>
                    )}
                  </div>

                  {/* Event Image */}
                  <div className={`relative ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                    <div className="relative overflow-hidden rounded-2xl shadow-elevated bg-gradient-card transform hover:scale-105 transition-all duration-500 hover:shadow-2xl">
                      <div className="aspect-video flex items-center justify-center">
                        {event.imageUrl ? (
                          <>
                            <img
                              src={event.imageUrl.startsWith('http') ? event.imageUrl : `https://wkbmjhoxfaomukzvhmbf.supabase.co/storage/v1/object/public/event-images/${event.imageUrl}`}
                              alt={event.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to placeholder if image fails to load
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.querySelector('.fallback')!.classList.remove('hidden');
                              }}
                            />
                            <div className="fallback hidden text-center">
                              <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                <Icon className="w-12 h-12 text-primary" />
                              </div>
                              <p className="text-primary font-display text-xl font-bold">
                                {event.name}
                              </p>
                              <p className="text-muted-foreground font-body text-sm">
                                Spectaculaire Event
                              </p>
                            </div>
                          </>
                        ) : (
                          <div className="text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                              <Icon className="w-12 h-12 text-primary" />
                            </div>
                            <p className="text-primary font-display text-xl font-bold">
                              {event.name}
                            </p>
                            <p className="text-muted-foreground font-body text-sm">
                              Spectaculaire Event
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                      {/* Creative Overlay Effects */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />

                      {/* Coming Soon Overlay */}
                      {event.comingSoon && (
                        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center">
                          <div className="text-center animate-bounce">
                            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                              <Clock className="w-10 h-10 text-primary-foreground" />
                            </div>
                            <span className="font-display text-2xl font-bold text-foreground bg-background/80 px-4 py-2 rounded-full">
                              Coming Soon
                            </span>
                            {countdowns[event.id || event.name] && (
                              <p className="text-primary font-mono text-sm mt-2 bg-background/80 px-3 py-1 rounded-full">
                                {countdowns[event.id || event.name]}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Player Count Badge */}
                      {!event.comingSoon && (
                        <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-primary/20">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <Users className="w-4 h-4 text-primary" />
                          <span className="font-display text-sm font-bold">{onlineCount} online</span>
                        </div>
                      )}


                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />

      <EventParticipationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        eventId={selectedEvent?.id || 0}
        eventName={selectedEvent?.name || ""}
      />
    </div>
  );
};

export default Events;
