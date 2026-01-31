import { Link } from "react-router-dom";
import { ArrowRight, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface GamemodeCardProps {
  name: string;
  description: string;
  image: string;
  players: number;
  slug: string;
  comingSoon: boolean;
  delay?: number;
}

const GamemodeCard = ({ name, description, image, players, slug, comingSoon, delay = 0 }: GamemodeCardProps) => {
  const CardContent = () => (
    <div className={`bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 relative z-10 ${!comingSoon ? 'hover:shadow-lg hover:-translate-y-1' : ''}`}>
      <div className="relative">
        <img
          src={image}
          alt={name}
          className={`w-full aspect-[4/3] object-cover ${name === 'Hardcore' ? 'object-top' : 'object-center'} ${!comingSoon ? 'group-hover:scale-105 transition-transform duration-300' : ''}`}
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />

        {/* Coming Soon Overlay */}
        {comingSoon && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-10 h-10 text-muted-foreground" />
              </div>
              <span className="font-display text-2xl font-bold text-foreground">Coming Soon</span>
            </div>
          </div>
        )}

        {/* Player Count */}
        {!comingSoon && (
          <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <Users className="w-4 h-4" />
            {players}
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className={`font-display text-xl font-bold text-foreground mb-2 ${!comingSoon ? 'group-hover:text-primary transition-colors' : ''}`}>
          {name}
        </h3>
        <p className="text-muted-foreground font-body text-sm mb-4 line-clamp-3">
          {description}
        </p>

        <Button
          variant="outline"
          disabled={comingSoon}
          className={`w-full ${!comingSoon ? 'group-hover:bg-primary group-hover:text-primary-foreground transition-colors' : 'cursor-not-allowed opacity-60'} text-black dark:text-white`}
        >
          <span>{comingSoon ? 'Coming Soon' : 'Ontdek Meer'}</span>
          {!comingSoon && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
        </Button>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="group"
    >
      {comingSoon ? (
        <CardContent />
      ) : (
        <Link to={`/gamemodes/${slug}`} className="block">
          <CardContent />
        </Link>
      )}
    </motion.div>
  );
};

export default GamemodeCard;
