import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-6 text-center text-sm text-muted-foreground border-t bg-card/50 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <p className="flex items-center justify-center flex-wrap gap-x-1.5">
          Built by{" "}
          <Link
            href="https://github.com/kautilyadevaraj"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline underline-offset-4"
          >
            @kautilyadevaraj
          </Link>{" "}
          <Link
            href="https://github.com/kautilyadevaraj/SchedulingAlgorithmSimulator"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline underline-offset-4"
          >
            Star this on Github⭐
          </Link>
        </p>
      </div>
    </footer>
  );
}
