import SVGIcon from "../lib/svg-icon";
import { RAW_ICONS } from "../lib/icons";

export default function GitHubStarBtn() {
  return (
    <a
      href="https://github.com/kartikver15gr8/SickUI"
      target="_blank"
      className="focus-visible:ring-ring ring-offset-background dark:hover:bg-accent hover:text-accent-foreground inline-flex h-9 w-9 items-center justify-center rounded-md px-0 py-2 text-sm font-medium transition-colors hover:bg-[#F0F0F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    >
      <SVGIcon className="flex h-6 w-6" svgString={RAW_ICONS.GitHubIcon} />
    </a>
  );
}
