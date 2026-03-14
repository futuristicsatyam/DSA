"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import "katex/dist/katex.min.css";
import { Button } from "@repo/ui";
import { slugifyHeading } from "@/lib/markdown";

function CodeBlock({ code, language }: { code: string; language?: string }) {
  return (
    <div className="my-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between bg-slate-100 px-4 py-2 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900">
        <span>{language ?? "code"}</span>
        <Button variant="ghost" className="h-auto p-0 text-xs" onClick={() => navigator.clipboard.writeText(code)}>
          Copy
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm">
        <code className={language ? `language-${language}` : undefined}>{code}</code>
      </pre>
    </div>
  );
}

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <article className="prose prose-slate max-w-none dark:prose-invert prose-pre:bg-transparent prose-code:before:hidden prose-code:after:hidden">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={{
          h1: ({ children }) => <h1 id={slugifyHeading(String(children))}>{children}</h1>,
          h2: ({ children }) => <h2 id={slugifyHeading(String(children))}>{children}</h2>,
          h3: ({ children }) => <h3 id={slugifyHeading(String(children))}>{children}</h3>,
          code(props) {
            const { children, className } = props;
            const match = /language-(\w+)/.exec(className || "");
            const text = String(children).replace(/\n$/, "");

            if (match) {
              return <CodeBlock code={text} language={match[1]} />;
            }

            return <code className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">{children}</code>;
          },
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table>{children}</table>
            </div>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-indigo-500 bg-indigo-50/60 px-4 py-3 dark:bg-indigo-950/30">
              {children}
            </blockquote>
          ),
          img: ({ alt, src }) => <img className="rounded-2xl" alt={alt || "markdown image"} src={src || ""} />
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
