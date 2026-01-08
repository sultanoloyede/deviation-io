"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface PropsFilterProps {
  onFilterChange: (filters: { player: string; minConfidence: number; propType: string; statType: string; potentialRead: boolean }) => void;
  filteredCount: number;
  totalCount: number;
}

export function PropsFilter({ onFilterChange, filteredCount, totalCount }: PropsFilterProps) {
  const [player, setPlayer] = useState("");
  const [minConfidence, setMinConfidence] = useState(0.7);
  const [propType, setPropType] = useState("all");
  const [statType, setStatType] = useState("all");
  const [potentialRead, setPotentialRead] = useState(false);

  const handleApplyFilters = () => {
    onFilterChange({ player, minConfidence, propType, statType, potentialRead });
  };

  const handleReset = () => {
    setPlayer("");
    setMinConfidence(0.7);
    setPropType("all");
    setStatType("all");
    setPotentialRead(false);
    onFilterChange({ player: "", minConfidence: 0.7, propType: "all", statType: "all", potentialRead: false });
  };

  return (
    <div className="sticky top-0 z-10 bg-background py-4 border-b border-border">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search player name..."
          value={player}
          onChange={(e) => setPlayer(e.target.value)}
          className="md:w-64"
        />

        <Select
          value={minConfidence.toString()}
          onValueChange={(value) => setMinConfidence(parseFloat(value))}
        >
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Min Confidence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0.70">70% or higher</SelectItem>
            <SelectItem value="0.75">75% or higher</SelectItem>
            <SelectItem value="0.80">80% or higher</SelectItem>
            <SelectItem value="0.85">85% or higher</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={propType}
          onValueChange={(value) => setPropType(value)}
        >
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Over/Under" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Props</SelectItem>
            <SelectItem value="over">Overs Only</SelectItem>
            <SelectItem value="under">Unders Only</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={statType}
          onValueChange={(value) => setStatType(value)}
        >
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Stat Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stats</SelectItem>
            <SelectItem value="PRA">PRA Only</SelectItem>
            <SelectItem value="RA">RA Only</SelectItem>
            <SelectItem value="PA">PA Only</SelectItem>
            <SelectItem value="PR">PR Only</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 md:w-48">
          <Switch
            id="potential-read"
            checked={potentialRead}
            onCheckedChange={setPotentialRead}
          />
          <label
            htmlFor="potential-read"
            className="text-sm font-medium cursor-pointer"
          >
            Potential Read
          </label>
        </div>

        <div className="flex gap-2 items-center">
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <span className="text-sm text-gray-500 ml-2">
            {filteredCount} / {totalCount}
          </span>
        </div>
      </div>
      </div>
    </div>
  );
}
