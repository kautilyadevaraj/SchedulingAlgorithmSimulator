import Link from "next/link";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default function Footer() {
  return (
    <footer className="w-full py-4 text-center text-base">
      <h1>
        Built by {" "}
        <Link
          href="https://github.com/kautilyadevaraj"
          target="_blank"
          className="underline inline-flex items-center gap-1"
        >
          <span>@kautilyadevaraj</span>
          <GitHubLogoIcon className="h-5 w-5" />
        </Link>
      </h1>
      <h2>
        <Link
          href="https://github.com/kautilyadevaraj/SchedulingAlgorithmSimulator"
          target="_blank"
          className="underline inline-flex items-center gap-1"
        >
          Star this on Github⭐
        </Link>
      </h2>
    </footer>
  );
}
