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
import { Card, CardContent } from "@/components/ui/card";

interface PropsFilterProps {
  onFilterChange: (filters: { player: string; minConfidence: number }) => void;
}

export function PropsFilter({ onFilterChange }: PropsFilterProps) {
  const [player, setPlayer] = useState("");
  const [minConfidence, setMinConfidence] = useState(0.7);

  const handleApplyFilters = () => {
    onFilterChange({ player, minConfidence });
  };

  const handleReset = () => {
    setPlayer("");
    setMinConfidence(0.7);
    onFilterChange({ player: "", minConfidence: 0.7 });
  };

  return (
    <Card>
      <CardContent className="pt-6">
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

          <div className="flex gap-2">
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
