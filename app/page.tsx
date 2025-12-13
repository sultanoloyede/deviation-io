"use client";

import { useEffect, useState } from "react";
import { PropsTable } from "@/components/props-table";
import { PropsFilter } from "@/components/props-filter";
import { PropsStats } from "@/components/props-stats";
import { fetchProps } from "@/lib/api";
import { NBAProp } from "@/types/props";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [props, setProps] = useState<NBAProp[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    player: "",
    minConfidence: 0.7,
  });

  useEffect(() => {
    async function loadProps() {
      setLoading(true);
      try {
        const response = await fetchProps({
          min_confidence: filters.minConfidence,
          player: filters.player || undefined,
        });
        setProps(response.data);
      } catch (error) {
        console.error("Failed to load props:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProps();
  }, [filters]);

  const stats = {
    totalProps: props.length,
    avgConfidence:
      props.reduce((sum, p) => sum + p.confidence_score, 0) /
      (props.length || 1),
    maxConfidence: Math.max(...props.map((p) => p.confidence_score), 0),
  };

  return (
    <main className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">NBA Props Dashboard</h1>
        <p className="text-muted-foreground">
          High-confidence player prop recommendations for today's games
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <>
          <PropsStats {...stats} />
          <PropsFilter onFilterChange={setFilters} />
          <PropsTable props={props} />
        </>
      )}
    </main>
  );
}
