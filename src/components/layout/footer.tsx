import { Group, Stack, Text, Anchor, TextInput, Button } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Instagram } from "lucide-react";

interface FooterProps {
  variant: "full" | "minimal";
}

export function Footer({ variant }: FooterProps) {
  const currentYear = new Date().getFullYear();

  if (variant === "minimal") {
    return (
      <footer className="bg-institutional-green py-6 mt-auto">
        <div className="container mx-auto px-4">
          <Text size="sm" className="text-white/70 text-center">
            © {currentYear} LAUMGA. All rights reserved.
          </Text>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-institutional-green text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About Column */}
          <Stack gap="md">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-vibrant-lime-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <Text size="lg" fw={700} className="text-white">
                LAUMGA
              </Text>
            </div>
            <Text size="sm" className="text-white/70">
              Uniting alumni of LAUTECH in brotherhood, service, and excellence
              since 1997.
            </Text>
            <Group gap="md">
              <Anchor
                href="https://facebook.com/laumga"
                target="_blank"
                className="text-white/70 hover:text-vibrant-lime-400 transition-colors"
              >
                <Facebook size={20} />
              </Anchor>
              <Anchor
                href="https://twitter.com/laumga"
                target="_blank"
                className="text-white/70 hover:text-vibrant-lime-400 transition-colors"
              >
                <Twitter size={20} />
              </Anchor>
              <Anchor
                href="https://instagram.com/laumga"
                target="_blank"
                className="text-white/70 hover:text-vibrant-lime-400 transition-colors"
              >
                <Instagram size={20} />
              </Anchor>
            </Group>
          </Stack>

          {/* Quick Links Column */}
          <Stack gap="md">
            <Text size="sm" fw={600} className="text-white mb-2">
              Quick Links
            </Text>
            {[
              { label: "About Us", href: "/about-us" },
              { label: "Membership", href: "/membership" },
              { label: "Events", href: "/events" },
              { label: "Contact", href: "/contact" },
            ].map((link) => (
              <Anchor
                key={link.href}
                component={Link}
                to={link.href}
                size="sm"
                underline="never"
                className="text-white/70 hover:text-vibrant-lime-400 transition-colors"
              >
                {link.label}
              </Anchor>
            ))}
          </Stack>

          {/* Contact Column */}
          <Stack gap="md">
            <Text size="sm" fw={600} className="text-white mb-2">
              Contact Info
            </Text>
            <div>
              <Text size="sm" className="text-white/70 mb-1">
                Email
              </Text>
              <Anchor
                href="mailto:info@laumga.org"
                size="sm"
                className="text-vibrant-lime-400 hover:text-vibrant-lime-300"
              >
                info@laumga.org
              </Anchor>
            </div>
            <div>
              <Text size="sm" className="text-white/70 mb-1">
                Phone
              </Text>
              <Anchor
                href="tel:+2348031234567"
                size="sm"
                className="text-vibrant-lime-400 hover:text-vibrant-lime-300"
              >
                +234 803 123 4567
              </Anchor>
            </div>
          </Stack>

          {/* Newsletter Column */}
          <Stack gap="md">
            <Text size="sm" fw={600} className="text-white mb-2">
              Newsletter
            </Text>
            <Text size="sm" className="text-white/70">
              Stay updated on our latest news and events.
            </Text>
            <form onSubmit={(e) => e.preventDefault()}>
              <Stack gap="sm">
                <TextInput
                  placeholder="Your email"
                  classNames={{
                    input:
                      "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-vibrant-lime-400",
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  className="bg-vibrant-lime-500 hover:bg-vibrant-lime-600 text-white"
                >
                  Subscribe
                </Button>
              </Stack>
            </form>
          </Stack>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6">
          <Text size="sm" className="text-white/50 text-center">
            © {currentYear} LAUMGA. All rights reserved.
          </Text>
        </div>
      </div>
    </footer>
  );
}
