import { PrismaClient, Role, CategoryType, Difficulty } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

const editorial = (title: string, topicId: string, slug: string, summary: string, markdownContent: string, tags: string[], estimatedMinutes = 20) => ({
  title,
  topicId,
  slug,
  summary,
  markdownContent,
  tags,
  estimatedMinutes,
  published: true
});

async function main() {
  await prisma.submission.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.recentlyViewed.deleteMany();
  await prisma.editorial.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.otp.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Admin@12345", 12);

  const admin = await prisma.user.create({
    data: {
      name: "Platform Admin",
      email: "admin@dsasuite.dev",
      phone: "9999999999",
      passwordHash,
      role: Role.ADMIN,
      emailVerified: true,
      phoneVerified: true
    }
  });

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Aarav Sharma",
        email: "aarav@example.com",
        phone: "9000000001",
        passwordHash: await bcrypt.hash("User@12345", 12),
        emailVerified: true,
        phoneVerified: false
      }
    }),
    prisma.user.create({
      data: {
        name: "Diya Verma",
        email: "diya@example.com",
        phone: "9000000002",
        passwordHash: await bcrypt.hash("User@12345", 12),
        emailVerified: true,
        phoneVerified: true
      }
    }),
    prisma.user.create({
      data: {
        name: "Kabir Singh",
        email: "kabir@example.com",
        phone: "9000000003",
        passwordHash: await bcrypt.hash("User@12345", 12),
        emailVerified: false,
        phoneVerified: false
      }
    })
  ]);

  const arrays = await prisma.subject.create({
    data: {
      name: "Arrays",
      slug: "arrays",
      description: "Linear storage patterns, traversal, prefix sums, and subarray techniques.",
      categoryType: CategoryType.DSA
    }
  });

  const graphs = await prisma.subject.create({
    data: {
      name: "Graph Algorithms",
      slug: "graph-algorithms",
      description: "BFS, DFS, shortest path, DSU, topological sort, and graph modeling.",
      categoryType: CategoryType.DSA
    }
  });

  const cpMath = await prisma.subject.create({
    data: {
      name: "Math for CP",
      slug: "math-for-cp",
      description: "Number theory, modular arithmetic, combinatorics, and problem modeling.",
      categoryType: CategoryType.CP
    }
  });

  const cpDp = await prisma.subject.create({
    data: {
      name: "Dynamic Programming",
      slug: "cp-dynamic-programming",
      description: "State design, transitions, optimizations, and contest patterns.",
      categoryType: CategoryType.CP
    }
  });

  const os = await prisma.subject.create({
    data: {
      name: "Operating Systems",
      slug: "operating-systems",
      description: "Processes, scheduling, memory, synchronization, and file systems.",
      categoryType: CategoryType.GATE
    }
  });

  const cpuScheduling = await prisma.subject.create({
    data: {
      name: "CPU Scheduling",
      slug: "cpu-scheduling",
      description: "FCFS, SJF, RR, priority scheduling, and response metrics.",
      categoryType: CategoryType.GATE,
      parentId: os.id
    }
  });

  const memoryManagement = await prisma.subject.create({
    data: {
      name: "Memory Management",
      slug: "memory-management",
      description: "Paging, segmentation, virtual memory, and replacement policies.",
      categoryType: CategoryType.GATE,
      parentId: os.id
    }
  });

  const topics = await Promise.all([
    prisma.topic.create({
      data: {
        subjectId: arrays.id,
        title: "Prefix Sum Essentials",
        slug: "prefix-sum-essentials",
        shortDescription: "Build range query intuition with 1D and 2D prefix sums.",
        difficulty: Difficulty.BEGINNER,
        orderIndex: 1
      }
    }),
    prisma.topic.create({
      data: {
        subjectId: graphs.id,
        title: "Breadth First Search",
        slug: "breadth-first-search",
        shortDescription: "Level-order exploration for shortest path in unweighted graphs.",
        difficulty: Difficulty.BEGINNER,
        orderIndex: 1
      }
    }),
    prisma.topic.create({
      data: {
        subjectId: cpMath.id,
        title: "Modular Arithmetic for Contests",
        slug: "modular-arithmetic-for-contests",
        shortDescription: "Fast exponentiation, modular inverse, and common CP traps.",
        difficulty: Difficulty.INTERMEDIATE,
        orderIndex: 1
      }
    }),
    prisma.topic.create({
      data: {
        subjectId: cpDp.id,
        title: "1D DP Patterns",
        slug: "one-dimensional-dp-patterns",
        shortDescription: "Recognize recurrence relations and optimize transitions.",
        difficulty: Difficulty.INTERMEDIATE,
        orderIndex: 1
      }
    }),
    prisma.topic.create({
      data: {
        subjectId: cpuScheduling.id,
        title: "Round Robin Scheduling",
        slug: "round-robin-scheduling",
        shortDescription: "Time quantum trade-offs, fairness, and turnaround calculations.",
        difficulty: Difficulty.INTERMEDIATE,
        orderIndex: 1
      }
    }),
    prisma.topic.create({
      data: {
        subjectId: memoryManagement.id,
        title: "Virtual Memory Basics",
        slug: "virtual-memory-basics",
        shortDescription: "Demand paging, page faults, and address translation.",
        difficulty: Difficulty.BEGINNER,
        orderIndex: 1
      }
    })
  ]);

  const [prefixSum, bfs, modArith, dp1d, rr, vm] = topics;

  await prisma.editorial.createMany({
    data: [
      editorial(
        "Prefix Sum Essentials",
        prefixSum.id,
        "prefix-sum-essentials-editorial",
        "Learn how to precompute partial sums for fast range queries.",
        `# Prefix Sum Essentials

## Why this matters

Prefix sums help you answer range sum queries in **O(1)** after **O(n)** preprocessing.

> This is one of the first tools every DSA learner should master.

## Core idea

If \`prefix[i]\` stores the sum of the first \`i\` elements, then:

$$sum(l, r) = prefix[r + 1] - prefix[l]$$

## Example

\`\`\`cpp
vector<int> prefix(n + 1, 0);
for (int i = 0; i < n; i++) {
  prefix[i + 1] = prefix[i] + arr[i];
}
\`\`\`

## Practice checklist

- Build 1D prefix sums
- Extend to 2D grids
- Use parity / frequency prefix arrays`,
        ["arrays", "prefix-sum", "range-query"],
        18
      ),
      editorial(
        "Breadth First Search",
        bfs.id,
        "breadth-first-search-editorial",
        "Master queue-based graph traversal for shortest paths in unweighted graphs.",
        `# Breadth First Search

## Intuition

BFS explores nodes level by level. The first time you reach a node, you have found the shortest distance from the source in an unweighted graph.

## Template

\`\`\`python
from collections import deque

def bfs(adj, src):
    dist = [-1] * len(adj)
    q = deque([src])
    dist[src] = 0

    while q:
        node = q.popleft()
        for nxt in adj[node]:
            if dist[nxt] == -1:
                dist[nxt] = dist[node] + 1
                q.append(nxt)
    return dist
\`\`\`

## When to use

- shortest path in unweighted graph
- multi-source spread simulations
- level-order traversal in trees`,
        ["graphs", "bfs", "shortest-path"],
        22
      ),
      editorial(
        "Modular Arithmetic for Contests",
        modArith.id,
        "modular-arithmetic-for-contests-editorial",
        "A practical CP guide to modulo operations, fast power, and inverses.",
        `# Modular Arithmetic for Contests

Use modulo when values grow too quickly.

## Rules

- \`(a + b) % m = ((a % m) + (b % m)) % m\`
- \`(a * b) % m = ((a % m) * (b % m)) % m\`

## Fast power

\`\`\`java
static long modPow(long a, long e, long mod) {
    long ans = 1 % mod;
    a %= mod;
    while (e > 0) {
        if ((e & 1) == 1) ans = (ans * a) % mod;
        a = (a * a) % mod;
        e >>= 1;
    }
    return ans;
}
\`\`\`

## Common modulus

\`1_000_000_007\` is popular because it is prime.`,
        ["cp", "math", "modulo"],
        24
      ),
      editorial(
        "1D DP Patterns",
        dp1d.id,
        "one-dimensional-dp-patterns-editorial",
        "How to spot and solve common single-dimensional DP problems.",
        `# 1D DP Patterns

## Spot the pattern

Whenever the best answer at index \`i\` depends on smaller indices, a DP state like \`dp[i]\` may work.

## Example

For climbing stairs:

$$dp[i] = dp[i - 1] + dp[i - 2]$$

## Optimization

Keep only the last few states if the transition uses constant history.`,
        ["cp", "dp", "state-transition"],
        20
      ),
      editorial(
        "Round Robin Scheduling",
        rr.id,
        "round-robin-scheduling-editorial",
        "GATE-style notes for time quantum scheduling and response metrics.",
        `# Round Robin Scheduling

Round Robin gives every process a fixed **time quantum**.

## Key properties

- preemptive
- fair for interactive systems
- context switching overhead rises when quantum is too small

## Metrics

Remember turnaround time, waiting time, and response time definitions carefully for exam numericals.`,
        ["gate", "os", "cpu-scheduling"],
        16
      ),
      editorial(
        "Virtual Memory Basics",
        vm.id,
        "virtual-memory-basics-editorial",
        "Demand paging and logical-to-physical translation fundamentals.",
        `# Virtual Memory Basics

Virtual memory lets processes use a large logical address space independent of physical RAM.

## Important terms

- page
- frame
- page fault
- TLB
- locality of reference

## GATE tip

Questions often mix address translation with page replacement assumptions.`,
        ["gate", "os", "virtual-memory"],
        17
      )
    ]
  });

  await prisma.userProgress.createMany({
    data: [
      { userId: users[0].id, topicId: prefixSum.id, completed: true, progressPercent: 100 },
      { userId: users[0].id, topicId: bfs.id, completed: false, progressPercent: 45 },
      { userId: users[1].id, topicId: modArith.id, completed: true, progressPercent: 100 },
      { userId: users[1].id, topicId: rr.id, completed: false, progressPercent: 60 }
    ]
  });

  await prisma.recentlyViewed.createMany({
    data: [
      { userId: users[0].id, topicId: prefixSum.id },
      { userId: users[0].id, topicId: bfs.id },
      { userId: users[1].id, topicId: modArith.id }
    ]
  });

  const prefixEditorial = await prisma.editorial.findUniqueOrThrow({ where: { slug: "prefix-sum-essentials-editorial" } });
  const bfsEditorial = await prisma.editorial.findUniqueOrThrow({ where: { slug: "breadth-first-search-editorial" } });

  await prisma.bookmark.createMany({
    data: [
      { userId: users[0].id, type: "TOPIC", topicId: prefixSum.id },
      { userId: users[0].id, type: "EDITORIAL", editorialId: bfsEditorial.id },
      { userId: users[1].id, type: "EDITORIAL", editorialId: prefixEditorial.id }
    ]
  });

  await prisma.problem.create({
    data: {
      title: "Maximum Subarray",
      slug: "maximum-subarray",
      statementMarkdown: "# Maximum Subarray\\nFind the maximum sum over all contiguous subarrays.",
      inputFormat: "An integer n followed by n space separated integers.",
      outputFormat: "Print the maximum subarray sum.",
      constraintsMarkdown: "-1e9 <= a[i] <= 1e9",
      sampleCases: [
        { input: "5\\n-2 1 -3 4 -1\\n", output: "4" }
      ],
      difficulty: Difficulty.BEGINNER
    }
  });

  console.log({ admin: admin.email, sampleUsers: users.map((user) => user.email) });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
