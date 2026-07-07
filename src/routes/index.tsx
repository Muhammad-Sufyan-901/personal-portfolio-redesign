import { createFileRoute } from "@tanstack/react-router";

function BlankPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-neutral-950 text-neutral-100">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">Muhammad Sufyan</h1>
      <p className="font-mono text-sm text-neutral-500">Portfolio — rebuilding</p>
    </main>
  );
}

export const Route = createFileRoute("/")({
  component: BlankPage,
});
