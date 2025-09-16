"use client";
import { Button } from "@sickui/core";
import Link from "next/link";
import HomeLayout from "./navbar/home-layout";

export default function NotFoundPage() {
  return (
    <HomeLayout>
      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-6">Page not found</p>
        <Link className="" href={"/"}>
          <Button variant="secondary">Go Home</Button>
        </Link>
      </div>
    </HomeLayout>
  );
}
