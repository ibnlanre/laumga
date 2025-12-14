import { Section } from "@/components/section";
import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  ActionIcon,
  AspectRatio,
  Badge,
  Button,
  Checkbox,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import {
  Clock,
  Facebook,
  Mail,
  MapPin,
  Phone,
  Twitter,
  User,
} from "lucide-react";
import { useEffect } from "react";

import { useCreateNotification } from "@/api/notification/hooks";
import { notificationFormSchema } from "@/api/notification/schema";
import type { NotificationForm } from "@/api/notification/types";
import { useAuth } from "@/contexts/use-auth";

export const Route = createFileRoute("/_public/_default/contact-us")({
  component: RouteComponent,
});

const contactChannels = [
  {
    icon: MapPin,
    label: "Our Location",
    detail: "Ogbomoso-Ilorin Rd, Ogbomoso 212102, Oyo",
    href: "https://share.google/fArHNB2N8awpC6Jqp",
    action: "Get directions",
  },
  {
    icon: Phone,
    label: "Phone Number",
    detail: "+234 (0) 802 530 0029",
    href: "tel:+2348025300029",
    action: "Call now",
  },
  {
    icon: Mail,
    label: "Email Address",
    detail: "laumgafoundation@gmail.com",
    href: "mailto:laumgafoundation@gmail.com",
    action: "Send an email",
  },
  {
    icon: User,
    label: "Account Details",
    detail: "9981529858",
    action: "Providus Bank",
  },
  {
    icon: Clock,
    label: "Office Hours",
    detail: "Mon - Fri · 9:00am - 5:00pm (WAT)",
  },
];

const socialLinks = [
  {
    href: "https://web.facebook.com/groups/109196249108535",
    label: "Facebook",
    icon: Facebook,
  },
  { href: "https://x.com/LaumgaF", label: "Twitter", icon: Twitter },
];

const faqItems = [
  {
    value: "dues",
    question: "How do I pay my alumni dues?",
    answer:
      "Log into the Membership portal to settle dues securely via card or bank transfer. A receipt is emailed immediately after payment.",
    category: "Membership",
  },
  {
    value: "benefits",
    question: "What are the benefits of membership?",
    answer:
      "Members receive curated networking events, leadership workshops, our quarterly bulletin, and discounts from partner organizations.",
    category: "Community",
  },
  {
    value: "events",
    question: "How can I get involved in upcoming events?",
    answer:
      "Visit the Events page to RSVP. If you would like to facilitate or volunteer, submit this contact form with the subject “Event Volunteering”.",
    category: "Events",
  },
  {
    value: "support",
    question: "Can non-alumni partner with LAUMGA?",
    answer:
      "Absolutely. Share your proposal via the form and our partnerships team will respond within two business days.",
    category: "Partnerships",
  },
];

function RouteComponent() {
  return (
    <div className="bg-mist-green min-h-screen">
      <HeroSection />
      <Section py="2rem">
        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="2.5rem">
          <ContactOverview />
          <ContactFormCard />
        </SimpleGrid>
      </Section>
      <MapSection />
      <FaqSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-deep-forest text-white">
      <div
        className="absolute inset-0 opacity-20 topographic-pattern"
        aria-hidden
      />
      <Section className="relative flex flex-col items-center gap-6 py-20 text-center">
        <Badge
          radius="xl"
          variant="light"
          size="lg"
          className="bg-vibrant-lime/20 text-vibrant-lime"
        >
          We are here to help
        </Badge>
        <Title order={1} className="font-serif text-4xl md:text-5xl">
          Let’s start a conversation.
        </Title>
        <Text size="lg" className="text-white/80 max-w-2xl">
          Share a question about membership, upcoming events, or how to partner
          with LAUMGA. Our alumni relations team typically responds within one
          business day.
        </Text>
      </Section>
    </section>
  );
}

function ContactOverview() {
  return (
    <Paper
      radius="2rem"
      shadow="xl"
      className="bg-deep-forest text-white relative overflow-hidden"
      p="xl"
    >
      <div className="absolute -right-20 -bottom-20 size-64 rounded-full bg-sage-green/10" />
      <Stack gap="xl" className="relative">
        <Stack gap="xs">
          <Title order={3} className="font-serif text-3xl">
            Contact information
          </Title>
          <Text className="text-white/80">
            Prefer to visit or call? Reach us through any of the channels below
            and we’ll connect you to the right team member.
          </Text>
        </Stack>
        <Stack gap="lg">
          {contactChannels.map((channel) => (
            <Group
              key={channel.label}
              align="flex-start"
              gap="md"
              className="text-left"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10">
                <channel.icon className="size-5 text-vibrant-lime" />
              </div>
              <div>
                <Text fw={600}>{channel.label}</Text>
                {channel.href ? (
                  <Text>
                    <a
                      href={channel.href}
                      className="text-vibrant-lime hover:underline"
                    >
                      {channel.detail}
                    </a>
                  </Text>
                ) : (
                  <Text className="text-white/80">{channel.detail}</Text>
                )}
                {channel.action && (
                  <Text size="sm" className="text-white/60 mt-1">
                    {channel.action}
                  </Text>
                )}
              </div>
            </Group>
          ))}
        </Stack>
        <div>
          <Text fw={600} mb="sm">
            Follow us
          </Text>
          <Group gap="md">
            {socialLinks.map((link) => (
              <ActionIcon
                key={link.label}
                component="a"
                href={link.href}
                target="_blank"
                rel="noreferrer"
                variant="subtle"
                radius="xl"
                className="bg-white/10 text-white hover:bg-white/20"
                aria-label={link.label}
              >
                <link.icon className="size-5" />
              </ActionIcon>
            ))}
          </Group>
        </div>
      </Stack>
    </Paper>
  );
}

function ContactFormCard() {
  return (
    <Paper radius="2rem" shadow="xl" p="xl" className="bg-white">
      <Stack gap="md" mb="lg">
        <Badge
          radius="xl"
          variant="light"
          className="self-start bg-sage-green/60 text-deep-forest"
        >
          Send us a note
        </Badge>
        <Title order={3} className="font-serif text-3xl text-deep-forest">
          Contact form
        </Title>
        <Text className="text-gray-600">
          Complete the form and our alumni relations team will respond with the
          next steps or route your request to the right volunteer lead.
        </Text>
      </Stack>
      <ContactForm />
    </Paper>
  );
}

function ContactForm() {
  const { user } = useAuth();
  const createNotification = useCreateNotification();
  const form = useForm<NotificationForm>({
    initialValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
      newsletterOptIn: false,
    },
    validate: zod4Resolver(notificationFormSchema),
  });

  useEffect(() => {
    if (!user) return;

    form.setValues({
      fullName: user.fullName,
      email: user.email,
    });
  }, [user]);

  function handleSubmit(values: NotificationForm) {
    createNotification.mutate(
      { data: values },
      {
        onSuccess() {
          form.reset();
        },
      }
    );
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-5">
      <TextInput
        withAsterisk
        label="Full Name"
        placeholder="Quadri Irekeola"
        type="text"
        autoComplete="name"
        radius="lg"
        size="md"
        {...form.getInputProps("fullName")}
      />
      <TextInput
        withAsterisk
        label="Email Address"
        placeholder="you@example.com"
        autoComplete="email"
        type="email"
        radius="lg"
        size="md"
        {...form.getInputProps("email")}
      />
      <TextInput
        withAsterisk
        label="Subject"
        placeholder="Tell us how we can help"
        radius="lg"
        size="md"
        {...form.getInputProps("subject")}
      />
      <Textarea
        withAsterisk
        label="Your Message"
        placeholder="Share any context, links, or timelines"
        minRows={4}
        radius="lg"
        size="md"
        autosize
        {...form.getInputProps("message")}
      />
      <Checkbox
        label="Subscribe to our newsletter"
        {...form.getInputProps("newsletterOptIn", { type: "checkbox" })}
      />
      <Button
        type="submit"
        radius="xl"
        size="lg"
        fullWidth
        loading={createNotification.isPending}
        className="bg-vibrant-lime text-deep-forest hover:bg-vibrant-lime/90"
      >
        Send message
      </Button>
    </form>
  );
}

function MapSection() {
  return (
    <Section py="2rem">
      <Paper
        radius="2rem"
        shadow="xl"
        className="overflow-hidden border border-sage-green/50"
      >
        <AspectRatio ratio={16 / 9}>
          <iframe
            src="https://maps.google.com/maps?hl=en&amp;q=google.com/maps/place/Lautech+NEW+Central+MOSQUE/data=!4m2!3m1!1s0x0:0xd8e020f5be55209?sa=X&ved=1t:2428&ictx=111&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
            title="LAUMGA campus map"
            loading="lazy"
            className="h-full w-full"
          />
        </AspectRatio>
      </Paper>
    </Section>
  );
}

function FaqSection() {
  return (
    <Section py="2rem" className="max-w-4xl">
      <Stack gap="lg" align="center" className="text-center mb-10">
        <Badge
          radius="xl"
          variant="light"
          className="bg-vibrant-lime/30 text-deep-forest"
        >
          FAQs
        </Badge>
        <Title order={2} className="font-serif text-4xl text-deep-forest">
          Frequently asked questions
        </Title>
        <Text className="text-gray-600 max-w-2xl">
          Still deciding on membership or planning a visit? Browse quick answers
          below or reach out directly through the form above.
        </Text>
      </Stack>

      <Accordion
        radius="lg"
        variant="contained"
        className="bg-white rounded-3xl"
        p="xs"
      >
        <Stack gap="xs">
          {faqItems.map((item) => (
            <Accordion.Item
              key={item.value}
              value={item.value}
              className="rounded-2xl border border-sage-green/40"
            >
              <Accordion.Control>
                <Group wrap="nowrap" gap="sm">
                  <Badge
                    variant="light"
                    radius="xl"
                    className="bg-sage-green/60 text-deep-forest"
                  >
                    {item.category}
                  </Badge>
                  <Text fw={600}>{item.question}</Text>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Text className="text-gray-700 leading-relaxed">
                  {item.answer}
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Stack>
      </Accordion>
    </Section>
  );
}
