
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, BookOpen, Users } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/10 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="max-w-4xl mx-auto text-center z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          For the self-taught generation
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-fade-in-up">
          Turn chaos into
          <br />
          <span className="text-primary">structured learning</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
          Ever started learning something only to end up with 40 open tabs, scattered playlists, and no sense of progress? 
          <span className="text-foreground font-medium"> We've all been there.</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up delay-300">
          <Button size="lg" className="group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
            Start Learning Smarter
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="outline" size="lg" className="group px-8 py-6 text-lg font-semibold rounded-xl border-2 hover:bg-primary/5 transition-all duration-300">
            <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-lg mx-auto animate-fade-in-up delay-500">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <BookOpen className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold text-foreground">1000+</span>
            </div>
            <p className="text-sm text-muted-foreground">Courses Created</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold text-foreground">5000+</span>
            </div>
            <p className="text-sm text-muted-foreground">Active Learners</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <span className="text-2xl font-bold text-foreground">98%</span>
            </div>
            <p className="text-sm text-muted-foreground">Completion Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
