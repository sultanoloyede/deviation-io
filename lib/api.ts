import { NBAProp, PropsResponse, PerformanceResponse } from "@/types/props";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function fetchProps(params?: {
  limit?: number;
  min_confidence?: number;
  player?: string;
  stat_type?: string | string[];
}): Promise<PropsResponse> {
  const searchParams = new URLSearchParams();

  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.min_confidence)
    searchParams.set("min_confidence", params.min_confidence.toString());
  if (params?.player) searchParams.set("player", params.player);
  if (params?.stat_type) {
    if (Array.isArray(params.stat_type)) {
      // Join multiple stat types with comma
      if (params.stat_type.length > 0) {
        searchParams.set("stat_type", params.stat_type.join(","));
      }
    } else if (params.stat_type !== "all") {
      searchParams.set("stat_type", params.stat_type);
    }
  }

  const url = `${API_BASE_URL}/props?${searchParams.toString()}`;
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Failed to fetch props");
  }

  return response.json();
}

export async function fetchPerformance(
  period: string = "all-time"
): Promise<PerformanceResponse> {
  const url = `${API_BASE_URL}/performance?period=${period}`;
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Failed to fetch performance data");
  }

  return response.json();
}

export async function fetchPropById(id: number): Promise<NBAProp> {
  const response = await fetch(`${API_BASE_URL}/props/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch prop");
  }

  const data = await response.json();
  return data.data;
}
