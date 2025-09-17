"use client";
import { Button } from "@sickui/core";
import Link from "next/link";
import HomeLayout from "./navbar/home-layout";

export default function NotFoundPage() {
  return (
    <HomeLayout>
      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="mb-4 text-6xl font-bold">404</h1>
        <p className="mb-6 text-xl">Page not found</p>
        <Link className="" href={"/"}>
          <Button variant="secondary">Go Home</Button>
        </Link>
      </div>
    </HomeLayout>
  );
}
