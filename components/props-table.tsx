"use client";

import { useState, useMemo } from "react";
import { NBAProp } from "@/types/props";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PropsTableProps {
  props: NBAProp[];
}

type SortColumn = 'name' | 'line' | 'confidence' | 'last_5' | 'last_10' | 'h2h' | 'this_season' | 'last_season' | 'opp_pts_rank' | 'opp_reb_rank' | 'opp_ast_rank' | null;
type SortDirection = 'asc' | 'desc';

export function PropsTable({ props }: PropsTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const getConfidenceBadge = (score: number) => {
    if (score >= 0.85) return <Badge className="bg-green-600">Excellent</Badge>;
    if (score >= 0.75) return <Badge className="bg-blue-600">Strong</Badge>;
    if (score >= 0.7) return <Badge className="bg-yellow-600">Good</Badge>;
    return <Badge variant="secondary">Fair</Badge>;
  };

  const getCellClasses = (value: number | null) => {
    if (value === null) return "";
    const percentage = value * 100;

    if (percentage >= 80)
      return "bg-gradient-to-t from-green-500/30 via-green-500/0 to-transparent rounded-md";
    if (percentage >= 70)
      return "bg-gradient-to-t from-yellow-500/30 via-yellow-500/0 to-transparent rounded-md";
    if (percentage >= 60)
      return "bg-gradient-to-t from-orange-500/30 via-orange-500/0 to-transparent rounded-md";
    return "bg-gradient-to-t from-red-500/30 via-red-500/0 to-transparent rounded-md";
  };

  const renderPercentage = (value: number | null) => {
    if (value === null) return "N/A";
    const percentage = value * 100;

    let textColorClass = "";
    if (percentage >= 80) textColorClass = "text-green-600 font-semibold";
    else if (percentage >= 70) textColorClass = "text-yellow-600 font-semibold";
    else if (percentage >= 60) textColorClass = "text-orange-600 font-semibold";
    else textColorClass = "text-red-600 font-semibold";

    return <span className={textColorClass}>{percentage.toFixed(1)}%</span>;
  };

  const getOrdinalSuffix = (num: number) => {
    const lastDigit = num % 10;
    const lastTwoDigits = num % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return "th";
    if (lastDigit === 1) return "st";
    if (lastDigit === 2) return "nd";
    if (lastDigit === 3) return "rd";
    return "th";
  };

  const getRankColor = (rank: number | null) => {
    if (rank === null) return "";
    if (rank >= 1 && rank <= 10) return "text-red-600 font-semibold";
    if (rank >= 11 && rank <= 20) return "text-yellow-600 font-semibold";
    return "text-green-600 font-semibold";
  };

  const renderRank = (rank: number | null) => {
    if (rank === null) return "N/A";
    return (
      <span className={getRankColor(rank)}>
        {rank}
        {getOrdinalSuffix(rank)}
      </span>
    );
  };

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortColumn(null);
        setSortDirection('asc');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedProps = useMemo(() => {
    if (!sortColumn) return props;

    return [...props].sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortColumn) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'line':
          aVal = a.line || 0;
          bVal = b.line || 0;
          break;
        case 'confidence':
          aVal = a.confidence_score;
          bVal = b.confidence_score;
          break;
        case 'last_5':
          aVal = a.last_5 ?? -1;
          bVal = b.last_5 ?? -1;
          break;
        case 'last_10':
          aVal = a.last_10 ?? -1;
          bVal = b.last_10 ?? -1;
          break;
        case 'h2h':
          aVal = a.h2h ?? -1;
          bVal = b.h2h ?? -1;
          break;
        case 'this_season':
          aVal = a.this_season ?? -1;
          bVal = b.this_season ?? -1;
          break;
        case 'last_season':
          aVal = a.last_season ?? -1;
          bVal = b.last_season ?? -1;
          break;
        case 'opp_pts_rank':
          aVal = a.opp_pts_rank ?? 999;
          bVal = b.opp_pts_rank ?? 999;
          break;
        case 'opp_reb_rank':
          aVal = a.opp_reb_rank ?? 999;
          bVal = b.opp_reb_rank ?? 999;
          break;
        case 'opp_ast_rank':
          aVal = a.opp_ast_rank ?? 999;
          bVal = b.opp_ast_rank ?? 999;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [props, sortColumn, sortDirection]);

  const getSortIndicator = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <span className="text-gray-600 ml-1">↑↓</span>;
    }
    return (
      <span className="ml-1">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  const getSemiCircleColor = (column: SortColumn, value: number | null) => {
    if (sortColumn !== column) {
      return "border-transparent group-hover:border-white/5";
    }

    if (value === null) return "border-gray-400";
    const percentage = value * 100;

    if (percentage >= 80) return "border-green-600";
    if (percentage >= 70) return "border-yellow-600";
    if (percentage >= 60) return "border-orange-600";
    return "border-red-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's NBA Props</CardTitle>
      </CardHeader>
      <CardContent className="bg-black/40 rounded-lg">
        <Table>
          <TableCaption>
            High-confidence NBA player prop recommendations
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-400">
                Prop
              </TableHead>
              <TableHead className="text-gray-400 cursor-pointer hover:text-white" onClick={() => handleSort('line')}>
                Line{getSortIndicator('line')}
              </TableHead>
              <TableHead className="text-gray-400 cursor-pointer hover:text-white" onClick={() => handleSort('confidence')}>
                Confidence{getSortIndicator('confidence')}
              </TableHead>
              <TableHead className="text-center text-gray-400 cursor-pointer hover:text-white" onClick={() => handleSort('last_5')}>
                Last 5{getSortIndicator('last_5')}
              </TableHead>
              <TableHead className="text-center text-gray-400 cursor-pointer hover:text-white" onClick={() => handleSort('last_10')}>
                Last 10{getSortIndicator('last_10')}
              </TableHead>
              <TableHead className="text-center text-gray-400 cursor-pointer hover:text-white" onClick={() => handleSort('h2h')}>
                H2H{getSortIndicator('h2h')}
              </TableHead>
              <TableHead className="text-center text-gray-400 cursor-pointer hover:text-white" onClick={() => handleSort('this_season')}>
                2025{getSortIndicator('this_season')}
              </TableHead>
              <TableHead className="text-center text-gray-400 cursor-pointer hover:text-white" onClick={() => handleSort('last_season')}>
                2024{getSortIndicator('last_season')}
              </TableHead>
              <TableHead className="text-center text-gray-400 cursor-pointer hover:text-white" onClick={() => handleSort('opp_pts_rank')}>
                Opp Pts{getSortIndicator('opp_pts_rank')}
              </TableHead>
              <TableHead className="text-center text-gray-400 cursor-pointer hover:text-white" onClick={() => handleSort('opp_reb_rank')}>
                Opp Reb{getSortIndicator('opp_reb_rank')}
              </TableHead>
              <TableHead className="text-center text-gray-400 cursor-pointer hover:text-white" onClick={() => handleSort('opp_ast_rank')}>
                Opp Ast{getSortIndicator('opp_ast_rank')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProps.map((prop) => (
              <TableRow
                key={prop.id}
                className="group rounded-lg hover:bg-white/5"
              >
                <TableCell className="rounded-l-lg">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{prop.name}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">{prop.matchup}</span>
                    </div>
                    <div className="font-bold text-white">{prop.prop}</div>
                  </div>
                </TableCell>
                <TableCell className="text-left">
                  <span className="font-bold text-gray-400 group-hover:text-white">
                    {prop.line}
                  </span>
                </TableCell>
                <TableCell className="text-left">
                  <span className="font-bold text-gray-400 group-hover:text-white">
                    {(prop.confidence_score * 100).toFixed(1)}%
                  </span>
                </TableCell>
                <TableCell
                  className={`text-center relative w-24 h-16 ${getCellClasses(prop.last_5)}`}
                >
                  {renderPercentage(prop.last_5)}
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-3 rounded-t-full border-2 border-b-0 ${getSemiCircleColor('last_5', prop.last_5)}`} />
                </TableCell>
                <TableCell
                  className={`text-center relative w-24 h-16 ${getCellClasses(prop.last_10)}`}
                >
                  {renderPercentage(prop.last_10)}
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-3 rounded-t-full border-2 border-b-0 ${getSemiCircleColor('last_10', prop.last_10)}`} />
                </TableCell>
                <TableCell
                  className={`text-center relative w-24 h-16 ${getCellClasses(prop.h2h)}`}
                >
                  {renderPercentage(prop.h2h)}
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-3 rounded-t-full border-2 border-b-0 ${getSemiCircleColor('h2h', prop.h2h)}`} />
                </TableCell>
                <TableCell
                  className={`text-center relative w-24 h-16 ${getCellClasses(prop.this_season)}`}
                >
                  {renderPercentage(prop.this_season)}
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-3 rounded-t-full border-2 border-b-0 ${getSemiCircleColor('this_season', prop.this_season)}`} />
                </TableCell>
                <TableCell
                  className={`text-center relative w-24 h-16 ${getCellClasses(prop.last_season)}`}
                >
                  {renderPercentage(prop.last_season)}
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-3 rounded-t-full border-2 border-b-0 ${getSemiCircleColor('last_season', prop.last_season)}`} />
                </TableCell>
                <TableCell className="text-center">
                  {renderRank(prop.opp_pts_rank)}
                </TableCell>
                <TableCell className="text-center">
                  {renderRank(prop.opp_reb_rank)}
                </TableCell>
                <TableCell className="text-center rounded-r-lg">
                  {renderRank(prop.opp_ast_rank)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
