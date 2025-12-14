import { Group, Stack, Text, Anchor, TextInput, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { Section } from "@/components/section";
import { useAuth } from "@/contexts/use-auth";
import { useSubscribe } from "@/api/newsletter-subscription/hooks";
import { useEffect } from "react";
import type { SubscriptionForm } from "@/api/newsletter-subscription/types";
import { modals } from "@mantine/modals";
import { subscriptionFormSchema } from "@/api/newsletter-subscription/schema";
import { zod4Resolver } from "mantine-form-zod-resolver";

interface FooterProps {
  variant: "full" | "minimal";
}

const quickLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "Membership", href: "/membership" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact-us" },
];

export function Footer({ variant }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const form = useForm<SubscriptionForm>({
    initialValues: { email: "" },
    validate: zod4Resolver(subscriptionFormSchema),
  });

  function handleSubmitWithoutLogin() {
    modals.open({
      radius: "xl",
      padding: "xl",
      title: "Subscribe to our Newsletter",
      classNames: { title: "font-bold text-lg" },
      children: <NewsletterSubscriptionForm initialValues={form.values} />,
      centered: true,
    });
  }

  if (variant === "minimal") {
    return (
      <footer className="bg-deep-forest py-6 mt-auto">
        <Section>
          <Text size="sm" className="text-white/70 font-medium text-center">
            © {currentYear} LAUMGA Foundation. All rights reserved.
          </Text>
        </Section>
      </footer>
    );
  }

  return (
    <footer className="bg-institutional-green text-white mt-auto">
      <Section py="lg">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About Column */}
          <Stack gap="md">
            <div className="flex items-center gap-2 mb-2">
              <img
                src="/laumga-logo.jpeg"
                alt="LAUMGA emblem"
                className="size-10 object-scale-down"
              />
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
                href="https://web.facebook.com/groups/109196249108535"
                target="_blank"
                className="text-white/70 hover:text-vibrant-lime-400 transition-colors"
              >
                <Facebook size={20} />
              </Anchor>
              <Anchor
                href="https://x.com/LaumgaF"
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

            {quickLinks.map((link) => (
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
                href="mailto:laumgafoundation@gmail.com"
                size="sm"
                className="text-vibrant-lime-400 hover:text-vibrant-lime-300"
              >
                laumgafoundation@gmail.com
              </Anchor>
            </div>
            <div>
              <Text size="sm" className="text-white/70 mb-1">
                Phone
              </Text>
              <Anchor
                href="tel:+2348025300029"
                size="sm"
                className="text-vibrant-lime-400 hover:text-vibrant-lime-300"
              >
                +234 802 530 0029
              </Anchor>
            </div>
          </Stack>

          {/* Newsletter Column */}
          <Stack gap="md">
            <Text size="sm" fw={600} className="text-white mb-2">
              Newsletter
            </Text>
            <Text size="sm" className="text-white/70">
              Stay up to date with us.
            </Text>

            <form onSubmit={form.onSubmit(handleSubmitWithoutLogin)}>
              <Stack gap="sm">
                <TextInput
                  withAsterisk
                  placeholder="Your email"
                  {...form.getInputProps("email")}
                  errorProps={{ c: "vibrant-lime" }}
                  type="email"
                  classNames={{
                    input:
                      "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-vibrant-lime-400",
                  }}
                />

                <Button
                  fullWidth
                  type="submit"
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
      </Section>
    </footer>
  );
}

interface NewsletterSubscriptionFormProps {
  initialValues: SubscriptionForm;
}

function NewsletterSubscriptionForm({
  initialValues,
}: NewsletterSubscriptionFormProps) {
  const { user } = useAuth();

  const subscribe = useSubscribe();
  const form = useForm<SubscriptionForm>({
    initialValues,
    validate: zod4Resolver(subscriptionFormSchema),
  });

  useEffect(() => {
    if (user) {
      form.setValues({
        email: user.email,
        fullName: user.fullName,
      });
    }
  }, [user]);

  function handleSubmit(data: typeof form.values) {
    subscribe.mutate(
      { data },
      {
        onSuccess() {
          modals.closeAll();
        },
      }
    );
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="xl">
        <Stack gap="md">
          <Text>
            Almost! We just need a few details to complete your subscription.
          </Text>

          <TextInput
            withAsterisk
            label="Full Name"
            placeholder="Enter your full name"
            {...form.getInputProps("fullName")}
            type="text"
            autoComplete="name"
            required
            radius="xl"
            size="lg"
            labelProps={{
              lh: 2,
              fz: "sm",
            }}
          />
        </Stack>

        <Button
          fullWidth
          type="submit"
          radius="xl"
          disabled={subscribe.isPending}
          loading={subscribe.isPending}
          className="bg-vibrant-lime-500 hover:bg-vibrant-lime-600 text-white"
          size="lg"
        >
          Submit
        </Button>
      </Stack>
    </form>
  );
}
