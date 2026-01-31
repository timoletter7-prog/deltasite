import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Tutorial = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
            <span className="text-foreground">Hoe te </span>
            <span className="text-gradient-primary">SPELEN</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
            Leer hoe je kunt verbinden met onze Minecraft server
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Server IP */}
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Server IP</h2>
              <div className="bg-secondary p-6 rounded-lg">
                <p className="text-2xl font-mono font-bold text-primary">play.deltamc.nl</p>
              </div>
            </div>

            {/* Java Edition */}
            <div className="bg-card p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold mb-6 text-primary">Java Edition</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>1. Open Minecraft Java Edition</p>
                <p>2. Ga naar "Multiplayer" in het hoofdmenu</p>
                <p>3. Klik op "Add Server"</p>
                <p>4. Voer de server naam in (bijv. "Delta MC")</p>
                <p>5. Voer de server IP in: <span className="font-mono font-bold text-primary">play.deltamc.nl</span></p>
                <p>6. Klik op "Done" en selecteer de server om te verbinden</p>
              </div>
            </div>

            {/* Bedrock Edition */}
            <div className="bg-card p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold mb-6 text-primary">Bedrock Edition</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>1. Open Minecraft Bedrock Edition</p>
                <p>2. Ga naar "Servers" tab</p>
                <p>3. Klik op "Add Server"</p>
                <p>4. Voer de server naam in (bijv. "Delta MC")</p>
                <p>5. Voer de server IP in: <span className="font-mono font-bold text-primary">play.deltamc.nl</span></p>
                <p>6. Voer poort in: <span className="font-mono font-bold text-primary">19132</span></p>
                <p>7. Klik op "Save" en selecteer de server om te verbinden</p>
              </div>
            </div>

            {/* Video Placeholder */}
            <div className="bg-card p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold mb-6 text-primary">Video Tutorial</h3>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Video komt hier</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Tutorial;
