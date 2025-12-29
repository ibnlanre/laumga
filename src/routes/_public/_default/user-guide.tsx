import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Card, Stack, Text, Title } from "@mantine/core";
import { ArrowLeft } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Section } from "@/components/section";
import guideText from "~/docs/user-guide.md?raw";

export const Route = createFileRoute("/_public/_default/user-guide")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="bg-mist-green min-h-screen py-12 sm:py-20">
      <Section className="max-w-4xl">
        <Stack gap="xl">
          <div className="flex flex-col items-center text-center space-y-4">
            <Link to="/" className="no-underline">
              <Button
                variant="subtle"
                color="gray"
                size="xs"
                leftSection={<ArrowLeft size={14} />}
                className="hover:bg-transparent hover:text-deep-forest"
              >
                Back to Home
              </Button>
            </Link>

            <Title
              order={1}
              className="text-deep-forest font-serif text-4xl sm:text-5xl"
            >
              User Guide
            </Title>
            <Text c="dimmed" size="lg" className="max-w-2xl">
              Everything you need to know about using the LAUMGA platform, from
              membership to admin tools.
            </Text>
          </div>

          <Card
            withBorder
            radius="lg"
            padding="xl"
            className="bg-white shadow-sm"
          >
            <div className="px-2 sm:px-6 py-4">
              <article
                className="prose prose-stone max-w-none 
                prose-headings:font-serif prose-headings:text-deep-forest 
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-gray-100
                prose-h3:text-xl prose-h3:text-olive prose-h3:mt-8
                prose-p:text-gray-600 prose-p:leading-relaxed prose-p:text-lg
                prose-li:text-gray-600 prose-li:text-lg
                prose-strong:text-deep-forest prose-strong:font-semibold
                prose-a:text-institutional-green prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-md
                prose-hr:border-gray-200 prose-hr:my-12
              "
              >
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: () => null,
                  }}
                >
                  {guideText}
                </Markdown>
              </article>
            </div>
          </Card>
        </Stack>
      </Section>
    </main>
  );
}
