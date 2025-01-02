import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import BentoGridSection from "./_components/bento-grid-section";
import { HeroSection } from "./_components/hero-section";

const HomePage = () => {
  return (
    <div>
      <section className="grid place-content-center place-items-center gap-6 text-center">
        <Badge size="sm" className="animate-fade-in">
          Design Studio <Sparkles className="ml-1 w-4 h-4" />
        </Badge>

        <h1 className="max-w-4xl font-bold">
          Transform Your Vision into Custom Apparel: Professional Screen Printing & Design Services
        </h1>

        <p className="max-w-2xl text-muted-foreground">
          From concept to creation, we make custom apparel simple. Design your own 
          merchandise with our intuitive{" "}
          <span className="inline-flex items-center">
            Design Studio<Sparkles className="w-3.5 h-3.5 ml-0.5" />
          </span>
          , get expert screen printing, 
          and bring your brand to life with premium quality products.
        </p>

        <div className="flex items-center gap-3">
          <Button className="rounded-full">
            <Link href="/design-lab">Start Designing</Link>
          </Button>
          <Button variant="outline" className="rounded-full">
            <Link href="/products">View Products</Link>
          </Button>
        </div>
      </section>

      <HeroSection />

      <section className="space-y-12">
        <h2 className="text-center">Why Choose Us</h2>
        <BentoGridSection />
      </section>

      <section className="space-y-6 text-center">
        <h2>Professional Screen Printing Services</h2>

        <p className="mx-auto max-w-2xl text-muted-foreground">
          Whether you need custom t-shirts for your business, team uniforms, or 
          promotional merchandise, our professional screen printing service delivers 
          exceptional quality and attention to detail on every order.
        </p>

        <Button size="lg" asChild>
          <Link href="/design-lab">
            Create Your Design
          </Link>
        </Button>
      </section>
    </div>
  );
};

export default HomePage;
