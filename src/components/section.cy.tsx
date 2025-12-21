import { Section } from "./section";
import { MantineProvider } from "@mantine/core";

describe("<Section />", () => {
  it("renders children", () => {
    cy.mount(
      <MantineProvider>
        <Section>Hello World</Section>
      </MantineProvider>
    );
    cy.contains("Hello World").should("be.visible");
  });

  it("applies container classes", () => {
    cy.mount(
      <MantineProvider>
        <Section>Content</Section>
      </MantineProvider>
    );
    cy.get(".container").should("exist");
    cy.get(".mx-auto").should("exist");
  });
});
