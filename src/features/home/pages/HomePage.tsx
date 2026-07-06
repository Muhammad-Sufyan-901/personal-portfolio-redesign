import { Box, Container, Heading, Text, ThemeToggle } from "@/components/common";

export default function HomePage() {
  return (
    <Box className="relative min-h-screen bg-background flex flex-col">
      <Box
        as="header"
        className="flex items-center justify-end w-full max-w-6xl mx-auto p-6"
      >
        <ThemeToggle />
      </Box>

      <Container
        as="main"
        maxWidth="6xl"
        className="flex flex-1 flex-col items-center justify-center text-center gap-4"
      >
        <Heading level={1}>Muhammad Sufyan</Heading>
        <Text variant="muted">Portfolio redesign in progress.</Text>
      </Container>
    </Box>
  );
}
