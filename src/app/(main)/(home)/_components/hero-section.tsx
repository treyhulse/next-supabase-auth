"use client";

import { useTheme } from "next-themes";
import Image from "next/image";

export const HeroSection = () => {
  const { theme } = useTheme();

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Design Lab Interface</h2>
            <p className="text-lg text-muted-foreground">
              Create and customize your apparel designs with our intuitive Design Lab. 
              Upload media, add layers, and bring your vision to life with our 
              powerful design tools.
            </p>
          </div>

          <div className="relative w-full h-[400px] rounded-lg overflow-hidden border shadow-lg">
            {theme === "dark" ? (
              <Image
                src="/design-lab/DesignLab-Dark.png"
                alt="Design Lab Interface Dark Mode"
                width={800}
                height={400}
                className="w-full h-full object-contain"
                priority
              />
            ) : (
              <Image
                src="/design-lab/DesignLab-Light.png"
                alt="Design Lab Interface Light Mode"
                width={800}
                height={400}
                className="w-full h-full object-contain"
                priority
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
