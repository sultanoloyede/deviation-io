"use client";

import { useEffect, useState, useMemo } from "react";
import { PropsTable } from "@/components/props-table";
import { PropsFilter } from "@/components/props-filter";
import { fetchProps } from "@/lib/api";
import { NBAProp } from "@/types/props";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [props, setProps] = useState<NBAProp[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<{
    player: string;
    minConfidence: string;
    propType: string;
    statType: string[];
    teams: string[];
    potentialRead: boolean;
  }>({
    player: "",
    minConfidence: "all",
    propType: "all",
    statType: [],
    teams: [],
    potentialRead: false,
  });

  useEffect(() => {
    async function loadProps() {
      setLoading(true);
      try {
        const response = await fetchProps({
          min_confidence: filters.minConfidence !== "all" ? parseFloat(filters.minConfidence) : undefined,
          player: filters.player || undefined,
          stat_type: filters.statType.length > 0 ? filters.statType : undefined,
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

  // Extract unique player teams (first team in matchup is always the player's team)
  // Matchup formats: "ATL vs CHA" (home) or "CHA @ ATL" (away)
  const teams = useMemo(() => {
    const teamSet = new Set<string>();
    props.forEach((p) => {
      const playerTeam = p.matchup.split(/\s+(?:vs|@)\s+/i)[0]?.trim();
      if (playerTeam) teamSet.add(playerTeam);
    });
    return Array.from(teamSet).sort();
  }, [props]);

  const filteredProps = props.filter((prop) => {
    // Team filter - first team in matchup is the player's team
    if (filters.teams.length > 0) {
      const playerTeam = prop.matchup.split(/\s+(?:vs|@)\s+/i)[0]?.trim();
      if (!playerTeam || !filters.teams.includes(playerTeam)) {
        return false;
      }
    }

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
      const isUnder = prop.prop.toLowerCase().includes("under");

      if (isUnder) {
        // UNDER criteria - inverse logic (looking for LOW raw percentages)
        const last5Check = (prop.last_5 ?? 100) <= 0.20;
        const last10Check = (prop.last_10 ?? 100) <= 0.20;
        const lineupCheck = (prop.lineup_pct ?? 100) <= 0.30;
        const oppStrengthCheck = (prop.opp_strength ?? 0) >= 0.45;
        const h2hCheck = (prop.h2h ?? 100) <= 0.50;

        if (!(last5Check && last10Check && lineupCheck && oppStrengthCheck && h2hCheck)) {
          return false;
        }
      } else {
        // OVER criteria - original logic (looking for HIGH percentages)
        const last5Check = (prop.last_5 ?? 0) >= 0.80;
        const last10Check = (prop.last_10 ?? 0) >= 0.80;
        const lineupCheck = (prop.lineup_pct ?? 0) >= 0.70;
        const oppStrengthCheck = (prop.opp_strength ?? 1) <= 0.43;
        const h2hCheck = (prop.h2h ?? 0) >= 0.50;

        if (!(last5Check && last10Check && lineupCheck && oppStrengthCheck && h2hCheck)) {
          return false;
        }
      }
    }

    return true;
  });

  return (
    <main>
      <div className="container mx-auto py-10">
        <div>
          <h1 className="text-4xl font-bold mb-2">NBA Props Dashboard</h1>
          <p className="text-muted-foreground">
            High-confidence player prop recommendations for today's games
          </p>
        </div>
      </div>

      {loading && props.length === 0 ? (
        <div className="container mx-auto space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <>
          <PropsFilter
            onFilterChange={setFilters}
            filteredCount={filteredProps.length}
            totalCount={props.length}
            teams={teams}
          />
          <div className="container mx-auto py-8">
            {loading ? (
              <Skeleton className="h-96 w-full" />
            ) : (
              <PropsTable props={filteredProps} />
            )}
          </div>
        </>
      )}
    </main>
  );
}
