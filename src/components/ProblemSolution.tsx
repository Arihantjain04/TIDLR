
import { Card } from "@/components/ui/card";
import { Globe, X, RotateCcw, Target, BookOpen, Share2, TrendingUp } from "lucide-react";

const ProblemSolution = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/5">
      <div className="max-w-6xl mx-auto">
        {/* Problem Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            The web is full of gold, <span className="text-destructive">but no map</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-2xl font-bold mb-6 text-destructive">The Problem</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                <Globe className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">40 open browser tabs with "I'll watch this later"</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                <X className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">Scattered YouTube playlists you never finish</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                <RotateCcw className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">Starting over and over without real progress</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6 text-primary">The Solution</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <Target className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">Structured courses from your curated content</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <BookOpen className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">Track progress, make notes, and actually finish</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <TrendingUp className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">Build streaks, gain XP, see your knowledge evolve</p>
              </div>
            </div>
          </div>
        </div>

        {/* Visual representation */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-destructive/20 via-transparent to-primary/20 rounded-3xl blur-xl"></div>
          <Card className="relative p-8 bg-card/80 backdrop-blur-sm border-2">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4 text-foreground">Your Knowledge Garage</h3>
              <p className="text-muted-foreground mb-6">A space to build, learn, and grow your way</p>
              <div className="flex justify-center items-center gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-2 mx-auto">
                    <X className="h-6 w-6 text-destructive" />
                  </div>
                  <p className="text-sm text-muted-foreground">Chaos</p>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-destructive/50 to-primary/50"></div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2 mx-auto">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Structure</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
