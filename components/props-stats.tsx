import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PropsStatsProps {
  totalProps: number;
  avgConfidence: number;
  maxConfidence: number;
}

export function PropsStats({
  totalProps,
  avgConfidence,
  maxConfidence,
}: PropsStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Props</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProps}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(avgConfidence * 100).toFixed(1)}%
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Max Confidence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(maxConfidence * 100).toFixed(1)}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
