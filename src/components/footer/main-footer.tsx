import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Mail } from "lucide-react";

const MainFooter = () => {
  return (
    <footer className="w-full border-t">
      <div className="container py-8 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg">Takeout Threads</h3>
            <p className="text-sm text-muted-foreground">
              Professional screen printing and custom apparel services. 
              Transform your ideas into high-quality custom merchandise.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/design-lab" className="text-sm text-muted-foreground hover:text-foreground">
                Design Lab
              </Link>
              <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground">
                Products
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                About Us
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact & Social */}
          <div className="space-y-3">
            <h4 className="font-semibold">Connect With Us</h4>
            <div className="flex items-center gap-4">
              {socials.map(({ href, Icon, label }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <a href="mailto:contact@takeoutthreads.com" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4" />
              contact@takeoutthreads.com
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Takeout Threads. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;

const socials = [
  {
    Icon: Facebook,
    href: "https://facebook.com/takeoutthreads",
    label: "Facebook"
  },
  {
    Icon: Instagram,
    href: "https://instagram.com/takeoutthreads",
    label: "Instagram"
  },
  {
    Icon: Mail,
    href: "mailto:contact@takeoutthreads.com",
    label: "Email"
  }
]; 