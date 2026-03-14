import Link from "next/link";
import { ArrowRight, BookOpen, Code2, GraduationCap, LineChart, Search, Sparkles } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@repo/ui";

const features = [
  { icon: BookOpen, title: "Structured DSA Learning", body: "Topic-wise coverage with curated editorials, formulas, and examples." },
  { icon: Code2, title: "Competitive Programming Practice", body: "Pattern-based learning paths for contests and implementation speed." },
  { icon: GraduationCap, title: "Complete GATE CSE Notes", body: "Subject-first preparation with theory notes and revision-friendly content." },
  { icon: Sparkles, title: "Markdown Editorials", body: "Rich markdown rendering with code, math, tables, and callouts." },
  { icon: LineChart, title: "Progress Tracking", body: "Bookmarks, completion state, streaks, and dashboard analytics." },
  { icon: Search, title: "Fast Search", body: "Find topics, tags, and editorials across the full platform." }
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="grid items-center gap-10 py-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Badge className="mb-4">Production-ready learning platform</Badge>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-tight md:text-6xl">
            Master DSA, Competitive Programming, and GATE CSE in one platform
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Learn with editorial-first content, structured roadmaps, personalized progress tracking, and a clean developer-focused experience.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/signup">
              <Button className="px-6 py-3 text-base">
                Get started
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="/dsa">
              <Button variant="outline" className="px-6 py-3 text-base">
                Explore tracks
              </Button>
            </Link>
          </div>
        </div>

        <Card className="overflow-hidden bg-gradient-to-br from-indigo-600 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="text-white">Roadmap snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-indigo-50">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="font-medium">DSA Foundation</p>
              <p className="mt-1">Arrays → Strings → Linked List → Trees → Graphs → DP</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="font-medium">Competitive Programming</p>
              <p className="mt-1">Implementation → Greedy → Binary Search → Graphs → Number Theory</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="font-medium">GATE CSE</p>
              <p className="mt-1">OS → DBMS → CN → TOC → COA → Algorithms</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight">Everything learners need in one workflow</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Modern UX, rich markdown notes, secure authentication, topic-first navigation, and analytics that help learners continue with the right next step.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="mb-3 size-5 text-indigo-600" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300">{feature.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          ["Why choose us", "A cohesive product that merges problem solving, theory notes, editorial depth, and progress analytics."],
          ["Testimonials", "Reserved for future learner stories, batch outcomes, and social proof modules."],
          ["FAQ", "Designed to support markdown-first content, topic search, bookmarks, and secure admin workflows."]
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
      </section>

      <section className="rounded-[2rem] bg-slate-900 px-8 py-12 text-white dark:bg-slate-900">
        <h2 className="text-3xl font-semibold">Ready to build a serious learning habit?</h2>
        <p className="mt-3 max-w-2xl text-slate-300">
          Start with a topic, save what matters, and track your momentum every day.
        </p>
        <div className="mt-6">
          <Link href="/signup">
            <Button>Start learning</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
