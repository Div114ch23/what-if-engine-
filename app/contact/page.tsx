import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Github } from "lucide-react";

export const metadata = {
  title: "Contact — What If? Engine",
  description: "Get in touch about What If? Engine.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <Badge>What If? Engine</Badge>
      <h1 className="text-4xl font-bold mt-4 mb-2">Contact</h1>
      <p className="text-muted-foreground mb-10">
        Questions about the project or the Razorpay AI Buildathon submission —
        reach out.
      </p>

      <Card>
        <CardContent className="pt-6 space-y-5">
          
            href="mailto:divyanshc781@gmail.com"
            className="flex items-center gap-3 hover:text-primary transition-colors"
          >
            <Mail className="h-5 w-5" />
            <span>divyanshc781@gmail.com</span>
          </a>
          
            href="tel:+919876543210"
            className="flex items-center gap-3 hover:text-primary transition-colors"
          >
            <Phone className="h-5 w-5" />
            <span>+91 98765 43210</span>
          </a>
          
            href="https://github.com/Div114ch23/what-if-engine-"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 hover:text-primary transition-colors"
          >
            <Github className="h-5 w-5" />
            <span>github.com/Div114ch23/what-if-engine-</span>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
