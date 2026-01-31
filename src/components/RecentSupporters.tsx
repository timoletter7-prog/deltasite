import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { getRecentSupporters, supabase } from "@/lib/supabase";
import { timeAgo } from "@/lib/utils";

type Supporter = {
  id: number;
  name: string;
  item: string;
  created_at: string;
};

const RecentSupporters = () => {
  const [supporters, setSupporters] = useState<Supporter[]>([]);

  useEffect(() => {
    const fetchSupporters = async () => {
      const data = await getRecentSupporters();
      console.log('Recent supporters data:', data); // Debug log
      setSupporters(data);
    };

    fetchSupporters();

    // Set up realtime subscription
    const channel = supabase
      .channel("recent-supporters")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "recent_supporters" },
        fetchSupporters
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="w-72 bg-card rounded-2xl p-4 shadow-xl border border-border">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 text-sm font-bold text-muted-foreground">
        <Heart className="w-4 h-4 text-red-500" />
        RECENT SUPPORTERS
      </div>

      {/* List */}
      <div className="space-y-2">
        {supporters.map((s) => (
          <div
            key={s.id}
            className="flex items-center gap-3 p-2 rounded-xl bg-secondary/60"
          >
            {/* Avatar */}
            <img
              src={`https://mc-heads.net/avatar/${encodeURIComponent(s.name)}/32`}
              alt={s.name}
              className="w-8 h-8 rounded-md"
              onError={(e) => {
                // Fallback to default avatar if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = `https://mc-heads.net/avatar/Steve/32`;
              }}
            />

            {/* Info */}
            <div className="flex-1 leading-tight">
              <div className="font-bold text-sm text-foreground">
                {s.name.toUpperCase()}
              </div>
              <div className="text-xs text-muted-foreground">
                {s.item}
              </div>
            </div>

            {/* Time */}
            <div className="text-xs text-muted-foreground whitespace-nowrap">
              {timeAgo(s.created_at)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSupporters;
