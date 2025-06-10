
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Mail, MessageCircle, Github, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 px-4 bg-gradient-to-t from-secondary/20 to-background border-t border-border">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">LearnCraft</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your knowledge garage for structured self-learning. Turn chaos into mastery.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Templates</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Integrations</a></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Browse Courses</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Creator Program</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Success Stories</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Get in Touch</h4>
            <div className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                hello@learncraft.com
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <MessageCircle className="h-4 w-4 mr-2" />
                Join Discord
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2024 LearnCraft. Made for the self-taught generation.
          </div>
          
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <div className="text-sm text-muted-foreground">
              Privacy · Terms · Cookies
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-12 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-primary/10">
          <p className="text-lg font-medium text-foreground mb-2">
            Ready to transform your learning?
          </p>
          <p className="text-muted-foreground text-sm">
            → Try it early. Build your first course. Share your learning journey.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
