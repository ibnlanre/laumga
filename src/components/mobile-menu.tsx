import { Drawer, Stack, Anchor, Button } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";

interface MobileMenuProps {
  opened: boolean;
  onClose: () => void;
}

export function MobileMenu({ opened, onClose }: MobileMenuProps) {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="75%"
      padding="xl"
      classNames={{
        header: "border-b border-sage-green",
        body: "pt-8",
      }}
      title={
        <div className="flex items-center gap-3">
          <img
            alt="LAUMGA Association Logo"
            className="size-10"
            src="/laumga-logo.jpeg"
          />
          <span className="font-bold text-xl text-deep-forest">LAUMGA</span>
        </div>
      }
      closeButtonProps={{
        icon: <X className="size-6" />,
      }}
    >
      <Stack gap="lg">
        <Anchor
          component={Link}
          to="/"
          className="text-deep-forest hover:text-vibrant-lime text-lg font-medium py-3 px-4 rounded-lg hover:bg-sage-green/20 transition-all"
          onClick={onClose}
          underline="never"
        >
          Home
        </Anchor>
        <Anchor
          component={Link}
          to="/about-us"
          className="text-deep-forest hover:text-vibrant-lime text-lg font-medium py-3 px-4 rounded-lg hover:bg-sage-green/20 transition-all"
          onClick={onClose}
          underline="never"
        >
          About Us
        </Anchor>
        <Anchor
          component={Link}
          to="/membership"
          className="text-deep-forest hover:text-vibrant-lime text-lg font-medium py-3 px-4 rounded-lg hover:bg-sage-green/20 transition-all"
          onClick={onClose}
          underline="never"
        >
          Membership
        </Anchor>
        <Anchor
          component={Link}
          to="/events"
          className="text-deep-forest hover:text-vibrant-lime text-lg font-medium py-3 px-4 rounded-lg hover:bg-sage-green/20 transition-all"
          onClick={onClose}
          underline="never"
        >
          Events
        </Anchor>
        <Anchor
          component={Link}
          to="/news"
          className="text-deep-forest hover:text-vibrant-lime text-lg font-medium py-3 px-4 rounded-lg hover:bg-sage-green/20 transition-all"
          onClick={onClose}
          underline="never"
        >
          News
        </Anchor>
        <Anchor
          component={Link}
          to="/contact"
          className="text-deep-forest hover:text-vibrant-lime text-lg font-medium py-3 px-4 rounded-lg hover:bg-sage-green/20 transition-all"
          onClick={onClose}
          underline="never"
        >
          Contact
        </Anchor>

        <div className="border-t border-sage-green pt-6 mt-4 space-y-3">
          <Button
            component={Link}
            to="/login"
            variant="outline"
            color="vibrant-lime"
            fullWidth
            size="lg"
            onClick={onClose}
          >
            Login
          </Button>
          <Button
            component={Link}
            to="/register"
            variant="filled"
            color="vibrant-lime"
            fullWidth
            size="lg"
            onClick={onClose}
            className="text-deep-forest"
          >
            Join LAUMGA
          </Button>
        </div>
      </Stack>
    </Drawer>
  );
}
