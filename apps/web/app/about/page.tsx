import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "About" }]} />
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold">About DSA Suite</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          DSA Suite is designed as a unified educational SaaS platform for DSA, Competitive Programming, and GATE CSE.
          It combines editorial quality, learner analytics, and admin-first content operations.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          ["Editorial-first", "Every topic is backed by markdown content that supports code, formulas, tables, and callouts."],
          ["Progress-aware", "Users can bookmark, continue learning, and understand where momentum is building."],
          ["Admin-ready", "Subjects, topics, editorials, and user roles are all manageable from secure admin screens."]
        ].map(([title, body]) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300">{body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
