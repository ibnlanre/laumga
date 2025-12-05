import { Component, type ReactNode } from "react";
import { Button, Text, Container } from "@mantine/core";
import { AlertCircle } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <Container className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <Text size="lg" fw={700} c="deep-forest" mb="xs">
              Something went wrong
            </Text>
            <Text c="dimmed" size="sm" mb="xl">
              {this.state.error?.message || "An unexpected error occurred"}
            </Text>
            <Button
              variant="outline"
              color="deep-forest"
              onClick={this.handleReset}
            >
              Try Again
            </Button>
          </Container>
        )
      );
    }

    return this.props.children;
  }
}
