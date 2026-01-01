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
    propType: "all",
    statType: "all",
    potentialRead: false,
  });

  useEffect(() => {
    async function loadProps() {
      setLoading(true);
      try {
        const response = await fetchProps({
          min_confidence: filters.minConfidence,
          player: filters.player || undefined,
          stat_type: filters.statType || undefined,
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

  const filteredProps = props.filter((prop) => {
    // Prop type filter
    if (filters.propType !== "all") {
      if (filters.propType === "over" && !prop.prop.toLowerCase().includes("over")) {
        return false;
      }
      if (filters.propType === "under" && !prop.prop.toLowerCase().includes("under")) {
        return false;
      }
    }

    // Potential Read filter
    if (filters.potentialRead) {
      // Last 5 above 80%
      const last5Check = (prop.last_5 ?? 0) >= 0.80;

      // Last 10 above 80%
      const last10Check = (prop.last_10 ?? 0) >= 0.80;

      // Lineup pct above 70%
      const lineupCheck = (prop.lineup_pct ?? 0) >= 0.70;

      // Opp strength less than 0.5
      const oppStrengthCheck = (prop.opp_strength ?? 1) < 0.5;

      // H2H at least 50%
      const h2hCheck = (prop.h2h ?? 0) >= 0.50;

      if (!(last5Check && last10Check && lineupCheck && oppStrengthCheck && h2hCheck)) {
        return false;
      }
    }

    return true;
  });

  const stats = {
    totalProps: filteredProps.length,
    avgConfidence:
      filteredProps.reduce((sum, p) => sum + p.confidence_score, 0) /
      (filteredProps.length || 1),
    maxConfidence: Math.max(...filteredProps.map((p) => p.confidence_score), 0),
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
          <PropsTable props={filteredProps} />
        </>
      )}
    </main>
  );
}
