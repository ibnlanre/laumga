import { forwardRef } from "react";
import { clsx } from "clsx";
import { Box, type BoxProps, createPolymorphicComponent } from "@mantine/core";

interface SectionProps extends BoxProps {}

const SectionComponent = forwardRef<HTMLDivElement, SectionProps>(
  ({ className, ...others }, ref) => (
    <Box
      ref={ref}
      className={clsx("container mx-auto px-4 sm:px-6 lg:px-8", className)}
      {...others}
    />
  )
);

export const Section = createPolymorphicComponent<"div", SectionProps>(
  SectionComponent
);
