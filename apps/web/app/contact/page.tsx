import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Contact" }]} />
      <div>
        <h1 className="text-4xl font-semibold">Contact</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">Use this page as the future home for support, sales, and instructor contact channels.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          ["Support", "support@dsasuite.dev"],
          ["Sales", "sales@dsasuite.dev"],
          ["Partnerships", "partnerships@dsasuite.dev"]
        ].map(([title, value]) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>{value}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
