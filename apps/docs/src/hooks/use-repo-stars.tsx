import { useEffect, useState } from "react";

export function useRepoStars() {
  const [stars, setStars] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStars() {
      try {
        setLoading(true);
        const res = await fetch(`/api/repo`);
        if (!res.ok) throw new Error("Failed to fetch stars");
        const data = await res.json();
        setStars(data.stars);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStars();
  }, []);

  return { stars, loading, error };
}
