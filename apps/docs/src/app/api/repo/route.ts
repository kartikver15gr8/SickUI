import { NextResponse } from "next/server";

export async function GET() {
  try {
    const repoOwner = "kartikver15gr8";
    const repoName = "sickui";

    const response = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
        next: { revalidate: 60 }, // cache for 60s if using App Router
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch stars" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ stars: data.stargazers_count });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
