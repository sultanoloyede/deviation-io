"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
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
  onFilterChange: (filters: { player: string; minConfidence: string; propType: string; statType: string[]; teams: string[]; potentialRead: boolean }) => void;
  filteredCount: number;
  totalCount: number;
  teams: string[];
}

const STAT_TYPES = [
  { value: "PRA", label: "PRA" },
  { value: "RA", label: "RA" },
  { value: "PA", label: "PA" },
  { value: "PR", label: "PR" },
];

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
}

export function PropsFilter({ onFilterChange, filteredCount, totalCount, teams }: PropsFilterProps) {
  const [player, setPlayer] = useState("");
  const [minConfidence, setMinConfidence] = useState("all");
  const [propType, setPropType] = useState("all");
  const [statType, setStatType] = useState<string[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [potentialRead, setPotentialRead] = useState(false);
  const [isStatDropdownOpen, setIsStatDropdownOpen] = useState(false);
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const [statDropdownPos, setStatDropdownPos] = useState<DropdownPosition | null>(null);
  const [teamDropdownPos, setTeamDropdownPos] = useState<DropdownPosition | null>(null);
  const statBtnRef = useRef<HTMLButtonElement>(null);
  const teamBtnRef = useRef<HTMLButtonElement>(null);
  const statPanelRef = useRef<HTMLDivElement>(null);
  const teamPanelRef = useRef<HTMLDivElement>(null);

  const updateStatPos = useCallback(() => {
    if (statBtnRef.current) {
      const rect = statBtnRef.current.getBoundingClientRect();
      setStatDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
  }, []);

  const updateTeamPos = useCallback(() => {
    if (teamBtnRef.current) {
      const rect = teamBtnRef.current.getBoundingClientRect();
      setTeamDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (isStatDropdownOpen && statBtnRef.current && !statBtnRef.current.contains(target) && statPanelRef.current && !statPanelRef.current.contains(target)) {
        setIsStatDropdownOpen(false);
      }
      if (isTeamDropdownOpen && teamBtnRef.current && !teamBtnRef.current.contains(target) && teamPanelRef.current && !teamPanelRef.current.contains(target)) {
        setIsTeamDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isStatDropdownOpen, isTeamDropdownOpen]);

  // Reposition dropdowns on scroll
  useEffect(() => {
    if (isStatDropdownOpen) updateStatPos();
  }, [isStatDropdownOpen, updateStatPos]);

  useEffect(() => {
    if (isTeamDropdownOpen) updateTeamPos();
  }, [isTeamDropdownOpen, updateTeamPos]);

  const applyWith = (overrides: Partial<{ player: string; minConfidence: string; propType: string; statType: string[]; teams: string[]; potentialRead: boolean }>) => {
    const next = { player, minConfidence, propType, statType, teams: selectedTeams, potentialRead, ...overrides };
    onFilterChange(next);
  };

  const handleStatTypeToggle = (value: string) => {
    const next = statType.includes(value) ? statType.filter((v) => v !== value) : [...statType, value];
    setStatType(next);
    applyWith({ statType: next });
  };

  const handleTeamToggle = (value: string) => {
    const next = selectedTeams.includes(value) ? selectedTeams.filter((v) => v !== value) : [...selectedTeams, value];
    setSelectedTeams(next);
    applyWith({ teams: next });
  };

  const handleReset = () => {
    setPlayer("");
    setMinConfidence("all");
    setPropType("all");
    setStatType([]);
    setSelectedTeams([]);
    setPotentialRead(false);
    onFilterChange({ player: "", minConfidence: "all", propType: "all", statType: [], teams: [], potentialRead: false });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (player !== "") count++;
    if (minConfidence !== "all") count++;
    if (propType !== "all") count++;
    if (statType.length > 0) count++;
    if (selectedTeams.length > 0) count++;
    if (potentialRead) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="sticky top-0 z-10 bg-background py-4 border-b border-border">
      <div className="container mx-auto">
        <div className="flex items-center relative">
          {/* Left: Filter button + horizontally scrollable filter controls */}
          <div
            className="flex items-center gap-3 min-w-0 flex-1 overflow-x-auto pr-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onScroll={() => {
              if (isStatDropdownOpen) updateStatPos();
              if (isTeamDropdownOpen) updateTeamPos();
            }}
          >
            {/* Filter button */}
            {activeFilterCount === 0 ? (
              <div className="h-9 px-4 rounded-md border border-gray-300 bg-white text-black text-sm font-medium flex items-center shrink-0">
                Filter
              </div>
            ) : (
              <div className="flex items-center h-9 rounded-md overflow-hidden shrink-0">
                <div className="flex items-center gap-2 px-3 h-full bg-white text-black">
                  <span className="flex items-center justify-center w-5 h-5 bg-black text-white text-xs rounded-full font-medium">
                    {activeFilterCount}
                  </span>
                  <span className="text-sm font-medium">Filter</span>
                </div>
                <button
                  onClick={handleReset}
                  className="group px-2.5 h-full bg-white hover:bg-[#71EEB8] transition-colors flex items-center justify-center border-l-2 border-black"
                  aria-label="Clear all filters"
                >
                  <span className="flex items-center justify-center w-5 h-5 bg-black rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </span>
                </button>
              </div>
            )}

            <Input
              placeholder="Search player name..."
              value={player}
              onChange={(e) => { setPlayer(e.target.value); applyWith({ player: e.target.value }); }}
              className="w-48 shrink-0"
            />

            <Select
              value={minConfidence}
              onValueChange={(value) => { setMinConfidence(value); applyWith({ minConfidence: value }); }}
            >
              <SelectTrigger className="w-40 shrink-0">
                <SelectValue placeholder="Confidence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Confidence</SelectItem>
                <SelectItem value="0.75">75% or higher</SelectItem>
                <SelectItem value="0.80">80% or higher</SelectItem>
                <SelectItem value="0.85">85% or higher</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={propType}
              onValueChange={(value) => { setPropType(value); applyWith({ propType: value }); }}
            >
              <SelectTrigger className="w-36 shrink-0">
                <SelectValue placeholder="Over/Under" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Over/Under</SelectItem>
                <SelectItem value="over">Overs Only</SelectItem>
                <SelectItem value="under">Unders Only</SelectItem>
              </SelectContent>
            </Select>

            {/* Stat Type multiselect trigger */}
            <button
              ref={statBtnRef}
              type="button"
              onClick={() => { setIsTeamDropdownOpen(false); setIsStatDropdownOpen(!isStatDropdownOpen); }}
              className="border-input flex w-36 shrink-0 items-center justify-between gap-2 rounded-md border bg-transparent dark:bg-input/30 px-3 py-2 text-sm shadow-xs h-9 dark:hover:bg-input/50 hover:bg-accent/50"
            >
              <span className={statType.length === 0 ? "text-muted-foreground" : ""}>
                {statType.length === 0
                  ? "Stat Type"
                  : statType.length === STAT_TYPES.length
                  ? "All Stats"
                  : statType.join(", ")}
              </span>
              <ChevronDownIcon className="size-4 opacity-50 shrink-0" />
            </button>

            {/* Team multiselect trigger */}
            <button
              ref={teamBtnRef}
              type="button"
              onClick={() => { setIsStatDropdownOpen(false); setIsTeamDropdownOpen(!isTeamDropdownOpen); }}
              className="border-input flex w-36 shrink-0 items-center justify-between gap-2 rounded-md border bg-transparent dark:bg-input/30 px-3 py-2 text-sm shadow-xs h-9 dark:hover:bg-input/50 hover:bg-accent/50"
            >
              <span className={selectedTeams.length === 0 ? "text-muted-foreground" : ""}>
                {selectedTeams.length === 0
                  ? "Team"
                  : selectedTeams.length === teams.length
                  ? "All Teams"
                  : selectedTeams.length <= 3
                  ? selectedTeams.join(", ")
                  : `${selectedTeams.length} teams`}
              </span>
              <ChevronDownIcon className="size-4 opacity-50 shrink-0" />
            </button>
          </div>

          {/* Right group: Potential Read toggle + prop count - pinned right, on top */}
          <div className="relative z-20 bg-background flex items-center gap-4 shrink-0 pl-4">
            <div className="flex items-center gap-2">
              <Switch
                id="potential-read"
                checked={potentialRead}
                onCheckedChange={(checked) => { setPotentialRead(checked); applyWith({ potentialRead: checked }); }}
              />
              <label
                htmlFor="potential-read"
                className="text-sm font-medium cursor-pointer whitespace-nowrap"
              >
                Potential Read
              </label>
            </div>

            <span className="text-sm text-gray-500 whitespace-nowrap">
              {filteredCount}/{totalCount} Props
            </span>
          </div>
        </div>
      </div>

      {/* Stat Type dropdown panel - fixed position to escape overflow */}
      {isStatDropdownOpen && statDropdownPos && (
        <div
          ref={statPanelRef}
          className="fixed z-50 min-w-[8rem] rounded-md border bg-popover shadow-md animate-in fade-in-0 zoom-in-95"
          style={{ top: statDropdownPos.top, left: statDropdownPos.left, width: statDropdownPos.width }}
        >
          <div className="p-1">
            {STAT_TYPES.map((stat) => (
              <label key={stat.value} className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground">
                <input type="checkbox" checked={statType.includes(stat.value)} onChange={() => handleStatTypeToggle(stat.value)} className="size-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span>{stat.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Team dropdown panel - fixed position to escape overflow */}
      {isTeamDropdownOpen && teamDropdownPos && (
        <div
          ref={teamPanelRef}
          className="fixed z-50 min-w-[8rem] max-h-60 overflow-y-auto rounded-md border bg-popover shadow-md animate-in fade-in-0 zoom-in-95"
          style={{ top: teamDropdownPos.top, left: teamDropdownPos.left, width: teamDropdownPos.width }}
        >
          <div className="p-1">
            {teams.map((t) => (
              <label key={t} className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground">
                <input type="checkbox" checked={selectedTeams.includes(t)} onChange={() => handleTeamToggle(t)} className="size-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span>{t}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
