
import { Card } from "@/components/ui/card";
import { RotateCcw, Target, Share2, TrendingUp, Users, Zap } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: RotateCcw,
      title: "Create Self-Learning Courses",
      description: "Turn scattered YouTube videos, articles, tweets, and blogs into structured learning paths. Drag and drop to reorder your content.",
      gradient: "from-blue-500/10 to-blue-600/5"
    },
    {
      icon: Target,
      title: "Track Your Progress",
      description: "Set goals, build streaks, and gain XP. Watch your knowledge evolve through an interactive Skill Graph that shows your learning journey.",
      gradient: "from-green-500/10 to-green-600/5"
    },
    {
      icon: Share2,
      title: "Share & Collaborate",
      description: "Share your courses with friends or the internet — choose editable or view-only. Build a learning community around your expertise.",
      gradient: "from-purple-500/10 to-purple-600/5"
    },
    {
      icon: TrendingUp,
      title: "Community-Driven Learning",
      description: "Browse trending community-built courses, discover new topics, or start with ready-to-learn templates from fellow learners.",
      gradient: "from-orange-500/10 to-orange-600/5"
    },
    {
      icon: Users,
      title: "Notes & Highlights",
      description: "Make notes, highlight key takeaways, and create your own study materials. Never lose an important insight again.",
      gradient: "from-pink-500/10 to-pink-600/5"
    },
    {
      icon: Zap,
      title: "Stay Focused",
      description: "Clean, distraction-free interface designed to keep you in the learning zone. No more tab chaos, just pure focus.",
      gradient: "from-yellow-500/10 to-yellow-600/5"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-secondary/5 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Everything you need to <span className="text-primary">learn smarter</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your chaotic learning into organized knowledge with features designed for the modern self-taught learner.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`p-6 border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br ${feature.gradient} group`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-6">
            This is not another MOOC. This is your <span className="text-primary font-semibold">knowledge garage</span>.
          </p>
          <div className="inline-flex items-center gap-2 bg-accent/50 text-accent-foreground px-6 py-3 rounded-full text-sm font-medium">
            🧠 Stay focused. Stay tidy. Actually learn.
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
