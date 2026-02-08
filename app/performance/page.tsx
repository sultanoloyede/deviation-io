"use client";

import { useEffect, useState } from "react";
import { fetchPerformance } from "@/lib/api";
import { PerformanceResponse, PerformanceGroup } from "@/types/props";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PERIODS = [
  { key: "all-time", label: "All-Time" },
  { key: "season", label: "Season" },
  { key: "monthly", label: "Monthly" },
  { key: "weekly", label: "Weekly" },
  { key: "daily", label: "Daily" },
];

function HitRateBar({ hitRate }: { hitRate: number }) {
  const color =
    hitRate >= 70
      ? "bg-green-500"
      : hitRate >= 60
      ? "bg-yellow-500"
      : hitRate >= 50
      ? "bg-orange-500"
      : "bg-red-500";

  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(hitRate, 100)}%` }}
        />
      </div>
      <span className="text-sm font-medium">{hitRate}%</span>
    </div>
  );
}

function StatCard({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
}

function GroupCards({ groups, title }: { groups: PerformanceGroup[]; title: string }) {
  if (groups.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">No data available</div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {groups.map((g) => (
          <div
            key={g.label}
            className="rounded-lg border border-border bg-card p-4"
          >
            <p className="text-sm font-medium mb-2">{g.label}</p>
            <HitRateBar hitRate={g.hit_rate} />
            <p className="text-xs text-muted-foreground mt-2">
              {g.hits}/{g.total} hits
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PerformancePage() {
  const [period, setPeriod] = useState("all-time");
  const [data, setData] = useState<PerformanceResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchPerformance(period)
      .then((res) => setData(res))
      .catch((err) => console.error("Failed to load performance data:", err))
      .finally(() => setLoading(false));
  }, [period]);

  const summary = data?.summary;
  const perf = data?.data;

  // Find best stat type and best confidence tier
  const bestStatType =
    perf?.by_stat_type.reduce<PerformanceGroup | null>(
      (best, g) => (!best || g.hit_rate > best.hit_rate ? g : best),
      null
    ) || null;

  const bestConfidence =
    perf?.by_confidence.reduce<PerformanceGroup | null>(
      (best, g) => (!best || g.hit_rate > best.hit_rate ? g : best),
      null
    ) || null;

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Performance</h1>
        <p className="text-muted-foreground">
          Track prediction accuracy over time
        </p>
      </div>

      {/* Floating tabs */}
      <div className="flex justify-center gap-2 mb-8">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              period === p.key
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white border border-gray-700"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : !data || summary?.total === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">
            No verified performance data available yet.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Performance data will appear once predictions are verified against
            actual game results.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Evaluated"
              value={summary?.total.toLocaleString() || "0"}
              subtitle={`${summary?.hits} hits, ${summary?.misses} misses`}
            />
            <StatCard
              label="Overall Hit Rate"
              value={`${summary?.hit_rate || 0}%`}
            />
            <StatCard
              label="Best Stat Type"
              value={bestStatType?.label || "N/A"}
              subtitle={
                bestStatType
                  ? `${bestStatType.hit_rate}% (${bestStatType.hits}/${bestStatType.total})`
                  : undefined
              }
            />
            <StatCard
              label="Best Confidence Tier"
              value={bestConfidence?.label || "N/A"}
              subtitle={
                bestConfidence
                  ? `${bestConfidence.hit_rate}% (${bestConfidence.hits}/${bestConfidence.total})`
                  : undefined
              }
            />
          </div>

          {/* By Team - Table */}
          <div>
            <h3 className="text-lg font-semibold mb-3">By Team</h3>
            {perf && perf.by_team.length > 0 ? (
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Hits</TableHead>
                      <TableHead className="text-right">Misses</TableHead>
                      <TableHead className="text-right">Hit Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {perf.by_team.map((row) => (
                      <TableRow key={row.label}>
                        <TableCell className="font-medium">
                          {row.label}
                        </TableCell>
                        <TableCell className="text-right">
                          {row.total}
                        </TableCell>
                        <TableCell className="text-right">
                          {row.hits}
                        </TableCell>
                        <TableCell className="text-right">
                          {row.misses}
                        </TableCell>
                        <TableCell className="text-right">
                          <HitRateBar hitRate={row.hit_rate} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data available</p>
            )}
          </div>

          {/* By Confidence Tier */}
          <GroupCards
            groups={perf?.by_confidence || []}
            title="By Confidence Tier"
          />

          {/* By Stat Type */}
          <GroupCards
            groups={perf?.by_stat_type || []}
            title="By Stat Type"
          />

          {/* By Over/Under */}
          <GroupCards
            groups={perf?.by_direction || []}
            title="By Over/Under"
          />
        </div>
      )}
    </div>
  );
}
