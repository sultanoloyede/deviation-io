"use client";

import { useState, useRef, useEffect } from "react";
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
import { ChevronDownIcon } from "lucide-react";

interface PropsFilterProps {
  onFilterChange: (filters: { player: string; minConfidence: number; propType: string; statType: string[]; potentialRead: boolean }) => void;
  filteredCount: number;
  totalCount: number;
}

const STAT_TYPES = [
  { value: "PRA", label: "PRA" },
  { value: "RA", label: "RA" },
  { value: "PA", label: "PA" },
  { value: "PR", label: "PR" },
];

export function PropsFilter({ onFilterChange, filteredCount, totalCount }: PropsFilterProps) {
  const [player, setPlayer] = useState("");
  const [minConfidence, setMinConfidence] = useState(0.7);
  const [propType, setPropType] = useState("all");
  const [statType, setStatType] = useState<string[]>([]);
  const [potentialRead, setPotentialRead] = useState(false);
  const [isStatDropdownOpen, setIsStatDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsStatDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatTypeToggle = (value: string) => {
    setStatType((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleApplyFilters = () => {
    onFilterChange({ player, minConfidence, propType, statType, potentialRead });
  };

  const handleReset = () => {
    setPlayer("");
    setMinConfidence(0.7);
    setPropType("all");
    setStatType([]);
    setPotentialRead(false);
    onFilterChange({ player: "", minConfidence: 0.7, propType: "all", statType: [], potentialRead: false });
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

        <div className="relative md:w-48" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsStatDropdownOpen(!isStatDropdownOpen)}
            className="border-input data-[placeholder]:text-muted-foreground flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none h-9 hover:bg-accent/50"
          >
            <span className={statType.length === 0 ? "text-muted-foreground" : ""}>
              {statType.length === 0
                ? "Stat Type"
                : statType.length === STAT_TYPES.length
                ? "All Stats"
                : `${statType.length} selected`}
            </span>
            <ChevronDownIcon className="size-4 opacity-50" />
          </button>

          {isStatDropdownOpen && (
            <div className="absolute z-50 mt-1 w-full min-w-[8rem] rounded-md border bg-popover shadow-md animate-in fade-in-0 zoom-in-95">
              <div className="p-1">
                {STAT_TYPES.map((stat) => (
                  <label
                    key={stat.value}
                    className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  >
                    <input
                      type="checkbox"
                      checked={statType.includes(stat.value)}
                      onChange={() => handleStatTypeToggle(stat.value)}
                      className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span>{stat.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

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
