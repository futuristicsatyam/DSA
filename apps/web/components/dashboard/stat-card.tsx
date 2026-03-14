import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";

export function StatCard({
  title,
  value,
  hint
}: {
  title: string;
  value: string | number;
  hint: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-slate-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold">{value}</p>
        <p className="mt-2 text-sm text-slate-500">{hint}</p>
      </CardContent>
    </Card>
  );
}
