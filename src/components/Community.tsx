
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Clock, ArrowRight } from "lucide-react";

const Community = () => {
  const trendingCourses = [
    {
      title: "Master React Hooks",
      creator: "Sarah Chen",
      students: 1250,
      rating: 4.9,
      duration: "12 hours",
      tags: ["React", "JavaScript", "Frontend"],
      gradient: "from-blue-500/10 to-blue-600/10"
    },
    {
      title: "AI Prompting Masterclass",
      creator: "Marcus Rodriguez",
      students: 890,
      rating: 4.8,
      duration: "8 hours",
      tags: ["AI", "ChatGPT", "Productivity"],
      gradient: "from-purple-500/10 to-purple-600/10"
    },
    {
      title: "Design Systems 101",
      creator: "Alex Kim",
      students: 670,
      rating: 4.9,
      duration: "15 hours",
      tags: ["Design", "Figma", "UX"],
      gradient: "from-green-500/10 to-green-600/10"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Join the <span className="text-primary">learning community</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover courses created by fellow learners, share your expertise, and grow together in the self-taught generation.
          </p>
        </div>

        {/* Trending Courses */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-8 text-center text-foreground">🔥 Trending This Week</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {trendingCourses.map((course, index) => (
              <Card key={index} className={`p-6 border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br ${course.gradient} group cursor-pointer`}>
                <div className="mb-4">
                  <h4 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {course.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">by {course.creator}</p>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">15K+</div>
            <p className="text-muted-foreground">Active Creators</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">50K+</div>
            <p className="text-muted-foreground">Courses Built</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">2M+</div>
            <p className="text-muted-foreground">Learning Hours</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">95%</div>
            <p className="text-muted-foreground">Satisfaction Rate</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="p-8 bg-gradient-to-r from-primary/10 via-background to-primary/10 border-2 border-primary/20">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Ready to build your first course?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              If you're a messy learner with a curious mind — welcome home. Join thousands of self-taught learners who are turning chaos into knowledge.
            </p>
            <Button size="lg" className="group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105">
              Start Your Learning Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Community;
