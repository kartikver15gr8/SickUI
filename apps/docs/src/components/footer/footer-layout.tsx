import Image from "next/image";
import Link from "next/link";
import { features, product, resources } from "../../utils/footer-list-options";
import SVGIcon from "../../lib/svg-icon";
import { RAW_ICONS } from "../../lib/icons";

export default function FooterLayout() {
  return (
    <div className="border-t-[0.5px] border-[#565555] px-4 sm:px-6 md:px-10 lg:px-14 xl:px-28 2xl:px-40">
      <div className="flex h-24 items-center justify-between border-b-[0.5px] border-[#565555] md:h-40">
        <div className="flex items-center gap-x-2 lg:gap-x-4">
          <Image
            className="w-5 rounded sm:w-6 md:w-8 md:rounded-md lg:w-10 lg:rounded-lg xl:w-12 xl:rounded-xl"
            src={"/logo/sickui-logo.png"}
            alt=""
            height={100}
            width={100}
          />
          <p className="text-[16px] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
            SickUI
          </p>
        </div>
        <p className="text-[16px] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
          Accessible UI, your way.
        </p>
      </div>
      {/* main content */}
      <div className="grid grid-cols-2 gap-y-10 py-10 md:grid-cols-4 md:gap-y-0">
        <div className="col-span-1">
          <p className="text-[14px] font-bold lg:text-[16px] lg:text-xl">
            Features
          </p>
          <ul className="mt-8 flex flex-col gap-y-4 text-[14px] lg:text-[16px]">
            {features.map((elem, key) => {
              return (
                <FooterLabel
                  key={key}
                  title={elem.title}
                  redirectHref={elem.redirectHref}
                  target={elem.target}
                />
              );
            })}
          </ul>
        </div>

        <div className="col-span-1">
          <p className="text-[14px] font-bold lg:text-[16px] lg:text-xl">
            Product
          </p>

          <ul className="mt-8 flex flex-col gap-y-4 text-[14px] lg:text-[16px]">
            {product.map((elem, key) => {
              return (
                <FooterLabel
                  key={key}
                  title={elem.title}
                  redirectHref={elem.redirectHref}
                  target={elem.target}
                />
              );
            })}
          </ul>
        </div>
        <div className="col-span-1">
          <p className="text-[14px] font-bold lg:text-[16px] lg:text-xl">
            Resources
          </p>

          <ul className="mt-8 flex flex-col gap-y-4 text-[14px] lg:text-[16px]">
            {resources.map((elem, key) => {
              return (
                <FooterLabel
                  key={key}
                  title={elem.title}
                  redirectHref={elem.redirectHref}
                  target={elem.target}
                />
              );
            })}
          </ul>
        </div>
        <div className="col-span-1">
          <p className="text-[14px] font-bold lg:text-[16px] lg:text-xl">
            CONNECT WITH US
          </p>

          <ul className="mt-8 flex flex-col gap-y-4">
            <a
              href="https://x.com/KartikeyStack"
              target="_blank"
              className="flex items-center text-lg"
            >
              <SVGIcon className="flex w-4" svgString={RAW_ICONS.X} />
            </a>
            <a
              href="https://github.com/kartikver15gr8/sickui"
              target="_blank"
              className="flex items-center"
            >
              <SVGIcon className="flex w-6" svgString={RAW_ICONS.GitHubIcon} />
            </a>
            <a
              href="https://www.linkedin.com/in/kartikeyverma "
              target="_blank"
              className="flex items-center"
            >
              <p className="mr-[2px]">Linked</p>
              <SVGIcon className="flex w-5" svgString={RAW_ICONS.LinkedIn} />
            </a>
          </ul>
        </div>
      </div>
      <div className="flex h-20 items-center justify-between border-t-[0.5px] border-[#565555] text-[12px] font-extralight sm:text-[13px] lg:text-sm">
        <p className="cursor-pointer">
          &copy; 2025 SickUI Inc, All Rights Reserved
        </p>
        <div className="flex items-center gap-x-2 sm:gap-x-4 lg:gap-x-8">
          <Link
            href="/terms"
            className="w-fit cursor-pointer transition-all duration-200 hover:cursor-pointer"
          >
            Terms & Conditions
          </Link>
          <Link
            href="/privacy"
            className="w-fit cursor-pointer transition-all duration-200 hover:cursor-pointer"
          >
            Privacy Policy
          </Link>
          <a
            href=""
            className="w-fit cursor-pointer transition-all duration-200 hover:cursor-pointer"
          >
            About
          </a>
        </div>
      </div>
    </div>
  );
}

const FooterLabel = ({
  title,
  redirectHref,
  target,
}: {
  title: string;
  redirectHref: string;
  target?: string;
}) => {
  return (
    <Link
      href={redirectHref}
      target={target}
      className="cursor-pointer transition-all duration-200"
    >
      {title}
    </Link>
  );
};
