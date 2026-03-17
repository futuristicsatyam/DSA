// apps/api/prisma/seed.ts
import { PrismaClient, CategoryType, Difficulty, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Users ────────────────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash('Admin@1234', 10);
  const userHash = await bcrypt.hash('User@1234', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@dsasuite.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@dsasuite.com',
      phone: '+919000000001',
      passwordHash: adminHash,
      emailVerified: true,
      phoneVerified: true,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'demo@dsasuite.com' },
    update: {},
    create: {
      name: 'Demo Learner',
      email: 'demo@dsasuite.com',
      phone: '+919000000002',
      passwordHash: userHash,
      emailVerified: true,
      phoneVerified: true,
      role: Role.USER,
    },
  });

  console.log('✅ Users seeded');

  // ── Helper ────────────────────────────────────────────────────────────────────
  async function upsertSubjectWithTopics(
    categoryType: CategoryType,
    subjectName: string,
    subjectSlug: string,
    description: string,
    topics: { title: string; slug: string; shortDescription: string; difficulty: Difficulty; order: number }[],
  ) {
    const subject = await prisma.subject.upsert({
      where: { slug: subjectSlug },
      update: { name: subjectName, description, categoryType },
      create: { name: subjectName, slug: subjectSlug, description, categoryType },
    });

    for (const t of topics) {
      await prisma.topic.upsert({
        where: { slug: t.slug },
        update: { title: t.title, shortDescription: t.shortDescription, difficulty: t.difficulty, orderIndex: t.order },
        create: {
          subjectId: subject.id,
          title: t.title,
          slug: t.slug,
          shortDescription: t.shortDescription,
          difficulty: t.difficulty,
          orderIndex: t.order,
        },
      });
    }
    return subject;
  }

  // ── DSA — Data Structures ─────────────────────────────────────────────────────
  await upsertSubjectWithTopics(CategoryType.DSA, 'Arrays', 'arrays', 'The most fundamental data structure in programming.', [
    { title: 'Introduction to Arrays', slug: 'arrays-intro', shortDescription: 'Basics of arrays, indexing, and traversal', difficulty: Difficulty.EASY, order: 1 },
    { title: 'Array Rotation', slug: 'array-rotation', shortDescription: 'Left/right rotation algorithms', difficulty: Difficulty.EASY, order: 2 },
    { title: 'Kadane\'s Algorithm', slug: 'kadanes-algorithm', shortDescription: 'Maximum subarray sum in O(n)', difficulty: Difficulty.MEDIUM, order: 3 },
    { title: 'Dutch National Flag', slug: 'dutch-national-flag', shortDescription: '3-way partitioning in one pass', difficulty: Difficulty.MEDIUM, order: 4 },
  ]);

  await upsertSubjectWithTopics(CategoryType.DSA, 'Strings', 'strings', 'String manipulation and pattern matching.', [
    { title: 'String Basics', slug: 'strings-basics', shortDescription: 'String operations and immutability', difficulty: Difficulty.EASY, order: 1 },
    { title: 'KMP Algorithm', slug: 'kmp-algorithm', shortDescription: 'Knuth-Morris-Pratt pattern matching', difficulty: Difficulty.HARD, order: 2 },
    { title: 'Rabin-Karp', slug: 'rabin-karp', shortDescription: 'Rolling hash for pattern search', difficulty: Difficulty.HARD, order: 3 },
    { title: 'Anagram Check', slug: 'anagram-check', shortDescription: 'Detecting anagrams efficiently', difficulty: Difficulty.EASY, order: 4 },
  ]);

  await upsertSubjectWithTopics(CategoryType.DSA, 'Linked List', 'linked-list', 'Singly, doubly, and circular linked lists.', [
    { title: 'Singly Linked List', slug: 'singly-linked-list', shortDescription: 'Insert, delete, search operations', difficulty: Difficulty.EASY, order: 1 },
    { title: 'Doubly Linked List', slug: 'doubly-linked-list', shortDescription: 'Bidirectional traversal', difficulty: Difficulty.EASY, order: 2 },
    { title: 'Floyd\'s Cycle Detection', slug: 'cycle-detection', shortDescription: 'Tortoise and hare algorithm', difficulty: Difficulty.MEDIUM, order: 3 },
    { title: 'Reverse a Linked List', slug: 'reverse-linked-list', shortDescription: 'Iterative and recursive reversal', difficulty: Difficulty.EASY, order: 4 },
    { title: 'Merge Two Sorted Lists', slug: 'merge-sorted-lists', shortDescription: 'Merging strategy with two pointers', difficulty: Difficulty.MEDIUM, order: 5 },
  ]);

  await upsertSubjectWithTopics(CategoryType.DSA, 'Stack', 'stack', 'LIFO data structure with applications.', [
    { title: 'Stack Implementation', slug: 'stack-impl', shortDescription: 'Array and linked list implementations', difficulty: Difficulty.EASY, order: 1 },
    { title: 'Balanced Parentheses', slug: 'balanced-parens', shortDescription: 'Validate bracket sequences', difficulty: Difficulty.EASY, order: 2 },
    { title: 'Next Greater Element', slug: 'next-greater-element', shortDescription: 'Monotonic stack pattern', difficulty: Difficulty.MEDIUM, order: 3 },
    { title: 'Min Stack', slug: 'min-stack', shortDescription: 'O(1) minimum with extra stack', difficulty: Difficulty.MEDIUM, order: 4 },
  ]);

  await upsertSubjectWithTopics(CategoryType.DSA, 'Tree', 'tree', 'Binary trees, traversals, and properties.', [
    { title: 'Binary Tree Basics', slug: 'binary-tree-basics', shortDescription: 'Nodes, depth, height, leaves', difficulty: Difficulty.EASY, order: 1 },
    { title: 'Tree Traversals', slug: 'tree-traversals', shortDescription: 'Inorder, Preorder, Postorder, BFS', difficulty: Difficulty.EASY, order: 2 },
    { title: 'LCA of Binary Tree', slug: 'lca-binary-tree', shortDescription: 'Lowest common ancestor algorithms', difficulty: Difficulty.MEDIUM, order: 3 },
    { title: 'Diameter of Tree', slug: 'tree-diameter', shortDescription: 'Longest path between two nodes', difficulty: Difficulty.MEDIUM, order: 4 },
  ]);

  await upsertSubjectWithTopics(CategoryType.DSA, 'Graph', 'graph', 'Graph representations and traversal algorithms.', [
    { title: 'Graph Representation', slug: 'graph-representation', shortDescription: 'Adjacency matrix vs list', difficulty: Difficulty.EASY, order: 1 },
    { title: 'BFS Traversal', slug: 'bfs', shortDescription: 'Breadth-first search with queue', difficulty: Difficulty.EASY, order: 2 },
    { title: 'DFS Traversal', slug: 'dfs', shortDescription: 'Depth-first search with recursion/stack', difficulty: Difficulty.EASY, order: 3 },
    { title: 'Dijkstra\'s Algorithm', slug: 'dijkstra', shortDescription: 'Shortest path with priority queue', difficulty: Difficulty.MEDIUM, order: 4 },
    { title: 'Topological Sort', slug: 'topological-sort', shortDescription: 'Ordering in DAGs via Kahn\'s / DFS', difficulty: Difficulty.MEDIUM, order: 5 },
  ]);

  await upsertSubjectWithTopics(CategoryType.DSA, 'Dynamic Programming', 'dynamic-programming', 'Memoization and tabulation techniques.', [
    { title: 'DP Introduction', slug: 'dp-intro', shortDescription: 'Overlapping subproblems and optimal substructure', difficulty: Difficulty.MEDIUM, order: 1 },
    { title: '0/1 Knapsack', slug: 'knapsack-01', shortDescription: 'Classic DP with items and capacity', difficulty: Difficulty.MEDIUM, order: 2 },
    { title: 'Longest Common Subsequence', slug: 'lcs', shortDescription: 'LCS with 2D DP table', difficulty: Difficulty.MEDIUM, order: 3 },
    { title: 'Coin Change', slug: 'coin-change', shortDescription: 'Minimum coins for a target sum', difficulty: Difficulty.MEDIUM, order: 4 },
    { title: 'Matrix Chain Multiplication', slug: 'matrix-chain', shortDescription: 'Optimal parenthesization using interval DP', difficulty: Difficulty.HARD, order: 5 },
  ]);

  // ── DSA — Algorithms ──────────────────────────────────────────────────────────
  await upsertSubjectWithTopics(CategoryType.DSA, 'Sorting', 'sorting', 'Comparison and non-comparison sorting.', [
    { title: 'Bubble Sort', slug: 'bubble-sort', shortDescription: 'Simple O(n²) sorting', difficulty: Difficulty.EASY, order: 1 },
    { title: 'Merge Sort', slug: 'merge-sort', shortDescription: 'Divide and conquer O(n log n)', difficulty: Difficulty.MEDIUM, order: 2 },
    { title: 'Quick Sort', slug: 'quick-sort', shortDescription: 'Pivot-based partitioning', difficulty: Difficulty.MEDIUM, order: 3 },
    { title: 'Counting Sort', slug: 'counting-sort', shortDescription: 'Linear time sorting with integer keys', difficulty: Difficulty.EASY, order: 4 },
  ]);

  await upsertSubjectWithTopics(CategoryType.DSA, 'Binary Search', 'binary-search', 'Logarithmic search on sorted data.', [
    { title: 'Binary Search Basics', slug: 'binary-search-basics', shortDescription: 'Classic search in sorted array', difficulty: Difficulty.EASY, order: 1 },
    { title: 'Lower & Upper Bound', slug: 'lower-upper-bound', shortDescription: 'Finding boundaries with binary search', difficulty: Difficulty.MEDIUM, order: 2 },
    { title: 'Binary Search on Answer', slug: 'binary-search-answer', shortDescription: 'Applying BS to optimization problems', difficulty: Difficulty.HARD, order: 3 },
  ]);

  await upsertSubjectWithTopics(CategoryType.DSA, 'Greedy', 'greedy', 'Greedy choice property and proofs.', [
    { title: 'Activity Selection', slug: 'activity-selection', shortDescription: 'Maximize non-overlapping activities', difficulty: Difficulty.MEDIUM, order: 1 },
    { title: 'Fractional Knapsack', slug: 'fractional-knapsack', shortDescription: 'Greedy by value/weight ratio', difficulty: Difficulty.MEDIUM, order: 2 },
    { title: 'Huffman Encoding', slug: 'huffman-encoding', shortDescription: 'Optimal prefix-free codes', difficulty: Difficulty.HARD, order: 3 },
  ]);

  console.log('✅ DSA subjects & topics seeded');

  // ── Competitive Programming ───────────────────────────────────────────────────
  await upsertSubjectWithTopics(CategoryType.CP, 'Time Complexity', 'cp-time-complexity', 'Analyzing algorithmic efficiency.', [
    { title: 'Big-O Notation', slug: 'big-o', shortDescription: 'O, Ω, Θ notation explained', difficulty: Difficulty.EASY, order: 1 },
    { title: 'Amortized Analysis', slug: 'amortized-analysis', shortDescription: 'Average cost over sequences of ops', difficulty: Difficulty.MEDIUM, order: 2 },
  ]);

  await upsertSubjectWithTopics(CategoryType.CP, 'Number Theory', 'number-theory', 'Mathematical foundations for CP.', [
    { title: 'Sieve of Eratosthenes', slug: 'sieve', shortDescription: 'Finding all primes up to N', difficulty: Difficulty.EASY, order: 1 },
    { title: 'GCD and LCM', slug: 'gcd-lcm', shortDescription: 'Euclidean algorithm and applications', difficulty: Difficulty.EASY, order: 2 },
    { title: 'Modular Arithmetic', slug: 'modular-arithmetic', shortDescription: 'Modular inverse, fast exponentiation', difficulty: Difficulty.MEDIUM, order: 3 },
    { title: 'Chinese Remainder Theorem', slug: 'crt', shortDescription: 'Solving systems of congruences', difficulty: Difficulty.HARD, order: 4 },
  ]);

  await upsertSubjectWithTopics(CategoryType.CP, 'Graph Algorithms', 'cp-graph-algorithms', 'Advanced graph problems in competitive programming.', [
    { title: 'Floyd-Warshall', slug: 'floyd-warshall', shortDescription: 'All-pairs shortest paths in O(V³)', difficulty: Difficulty.MEDIUM, order: 1 },
    { title: 'Bellman-Ford', slug: 'bellman-ford', shortDescription: 'Shortest path with negative edges', difficulty: Difficulty.MEDIUM, order: 2 },
    { title: 'Strongly Connected Components', slug: 'scc', shortDescription: 'Kosaraju\'s and Tarjan\'s algorithms', difficulty: Difficulty.HARD, order: 3 },
    { title: 'Minimum Spanning Tree', slug: 'mst', shortDescription: 'Kruskal\'s and Prim\'s algorithms', difficulty: Difficulty.MEDIUM, order: 4 },
  ]);

  await upsertSubjectWithTopics(CategoryType.CP, 'Dynamic Programming', 'cp-dp', 'Advanced DP patterns for contests.', [
    { title: 'Digit DP', slug: 'digit-dp', shortDescription: 'Counting numbers with digit constraints', difficulty: Difficulty.HARD, order: 1 },
    { title: 'Bitmask DP', slug: 'bitmask-dp', shortDescription: 'DP on subsets using bitmasks', difficulty: Difficulty.HARD, order: 2 },
    { title: 'DP on Trees', slug: 'dp-on-trees', shortDescription: 'Tree DP with rerooting technique', difficulty: Difficulty.HARD, order: 3 },
  ]);

  await upsertSubjectWithTopics(CategoryType.CP, 'Strings', 'cp-strings', 'String algorithms for competitive programming.', [
    { title: 'Z-Function', slug: 'z-function', shortDescription: 'Linear time string matching', difficulty: Difficulty.HARD, order: 1 },
    { title: 'Suffix Array', slug: 'suffix-array', shortDescription: 'Sorted array of all suffixes', difficulty: Difficulty.HARD, order: 2 },
    { title: 'Aho-Corasick', slug: 'aho-corasick', shortDescription: 'Multi-pattern string matching', difficulty: Difficulty.HARD, order: 3 },
  ]);

  console.log('✅ CP subjects & topics seeded');

  // ── GATE CSE ──────────────────────────────────────────────────────────────────
  await upsertSubjectWithTopics(CategoryType.GATE, 'Operating Systems', 'operating-systems', 'OS concepts for GATE CSE.', [
    { title: 'Process Management', slug: 'os-process-mgmt', shortDescription: 'Process states, PCB, context switching', difficulty: Difficulty.MEDIUM, order: 1 },
    { title: 'CPU Scheduling', slug: 'cpu-scheduling', shortDescription: 'FCFS, SJF, Round Robin, Priority', difficulty: Difficulty.MEDIUM, order: 2 },
    { title: 'Deadlocks', slug: 'deadlocks', shortDescription: 'Conditions, detection, prevention, avoidance', difficulty: Difficulty.MEDIUM, order: 3 },
    { title: 'Memory Management', slug: 'memory-management', shortDescription: 'Paging, segmentation, fragmentation', difficulty: Difficulty.MEDIUM, order: 4 },
    { title: 'Virtual Memory', slug: 'virtual-memory', shortDescription: 'Demand paging and page replacement', difficulty: Difficulty.HARD, order: 5 },
    { title: 'File Systems', slug: 'file-systems', shortDescription: 'FAT, inode, directory structures', difficulty: Difficulty.MEDIUM, order: 6 },
  ]);

  await upsertSubjectWithTopics(CategoryType.GATE, 'Databases', 'databases', 'DBMS and SQL for GATE CSE.', [
    { title: 'ER Model', slug: 'er-model', shortDescription: 'Entity-relationship diagrams and mapping', difficulty: Difficulty.EASY, order: 1 },
    { title: 'Relational Algebra', slug: 'relational-algebra', shortDescription: 'Select, project, join operations', difficulty: Difficulty.MEDIUM, order: 2 },
    { title: 'Normalization', slug: 'normalization', shortDescription: '1NF through BCNF with examples', difficulty: Difficulty.MEDIUM, order: 3 },
    { title: 'Transaction Management', slug: 'transactions', shortDescription: 'ACID, serializability, isolation levels', difficulty: Difficulty.HARD, order: 4 },
    { title: 'Indexing and B-Trees', slug: 'indexing', shortDescription: 'Dense/sparse indexes and B+ trees', difficulty: Difficulty.HARD, order: 5 },
  ]);

  await upsertSubjectWithTopics(CategoryType.GATE, 'Computer Networks', 'computer-networks', 'Networking concepts for GATE.', [
    { title: 'OSI and TCP/IP Model', slug: 'osi-tcp-ip', shortDescription: 'Layer functions and comparison', difficulty: Difficulty.EASY, order: 1 },
    { title: 'Data Link Layer', slug: 'data-link-layer', shortDescription: 'Framing, error control, flow control', difficulty: Difficulty.MEDIUM, order: 2 },
    { title: 'IP Addressing', slug: 'ip-addressing', shortDescription: 'IPv4, subnetting, CIDR', difficulty: Difficulty.MEDIUM, order: 3 },
    { title: 'Routing Algorithms', slug: 'routing', shortDescription: 'Distance vector and link state routing', difficulty: Difficulty.HARD, order: 4 },
    { title: 'TCP vs UDP', slug: 'tcp-vs-udp', shortDescription: 'Connection-oriented vs connectionless transport', difficulty: Difficulty.MEDIUM, order: 5 },
  ]);

  await upsertSubjectWithTopics(CategoryType.GATE, 'Theory of Computation', 'theory-of-computation', 'Automata, formal languages, and computability.', [
    { title: 'Finite Automata', slug: 'finite-automata', shortDescription: 'DFA, NFA, and equivalence', difficulty: Difficulty.MEDIUM, order: 1 },
    { title: 'Regular Languages', slug: 'regular-languages', shortDescription: 'Regular expressions and closure properties', difficulty: Difficulty.MEDIUM, order: 2 },
    { title: 'Context-Free Grammars', slug: 'cfg', shortDescription: 'CFG, parse trees, ambiguity', difficulty: Difficulty.MEDIUM, order: 3 },
    { title: 'Pushdown Automata', slug: 'pda', shortDescription: 'PDA and CFL recognition', difficulty: Difficulty.HARD, order: 4 },
    { title: 'Turing Machines', slug: 'turing-machines', shortDescription: 'TM definition and computability', difficulty: Difficulty.HARD, order: 5 },
  ]);

  await upsertSubjectWithTopics(CategoryType.GATE, 'Discrete Mathematics', 'discrete-mathematics', 'Mathematical foundations for CS.', [
    { title: 'Set Theory', slug: 'set-theory', shortDescription: 'Sets, relations, and functions', difficulty: Difficulty.EASY, order: 1 },
    { title: 'Graph Theory', slug: 'graph-theory', shortDescription: 'Trees, planarity, coloring', difficulty: Difficulty.MEDIUM, order: 2 },
    { title: 'Combinatorics', slug: 'combinatorics', shortDescription: 'Permutations, combinations, pigeonhole', difficulty: Difficulty.MEDIUM, order: 3 },
    { title: 'Propositional Logic', slug: 'propositional-logic', shortDescription: 'Truth tables, inference rules', difficulty: Difficulty.EASY, order: 4 },
    { title: 'Recurrence Relations', slug: 'recurrence-relations', shortDescription: 'Solving recurrences with master theorem', difficulty: Difficulty.MEDIUM, order: 5 },
  ]);

  console.log('✅ GATE subjects & topics seeded');

  // ── Sample Editorials ─────────────────────────────────────────────────────────
  const arraysIntroTopic = await prisma.topic.findUnique({ where: { slug: 'arrays-intro' } });
  const kadaneTopic = await prisma.topic.findUnique({ where: { slug: 'kadanes-algorithm' } });
  const bfsTopic = await prisma.topic.findUnique({ where: { slug: 'bfs' } });
  const dpIntroTopic = await prisma.topic.findUnique({ where: { slug: 'dp-intro' } });
  const bigOTopic = await prisma.topic.findUnique({ where: { slug: 'big-o' } });

  const editorials = [
    {
      topicId: arraysIntroTopic!.id,
      title: 'Introduction to Arrays',
      summary: 'Learn about the most fundamental data structure in competitive programming.',
      tags: ['arrays', 'basics', 'dsa'],
      estimatedMinutes: 10,
      markdownContent: `# Introduction to Arrays

Arrays are the simplest and most widely used data structure. An array stores elements in **contiguous memory locations**, allowing O(1) random access.

## Key Properties

| Property | Value |
|----------|-------|
| Access | O(1) |
| Search | O(n) |
| Insertion (end) | O(1) amortized |
| Insertion (middle) | O(n) |
| Deletion | O(n) |

## Declaration

\`\`\`cpp
// C++
int arr[5] = {1, 2, 3, 4, 5};
int n = sizeof(arr) / sizeof(arr[0]); // size = 5

// Dynamic array (vector)
vector<int> v = {1, 2, 3, 4, 5};
v.push_back(6); // O(1) amortized
\`\`\`

\`\`\`python
# Python
arr = [1, 2, 3, 4, 5]
arr.append(6)  # O(1)
\`\`\`

## Traversal

\`\`\`cpp
for (int i = 0; i < n; i++) {
    cout << arr[i] << " ";
}
// or with range-based for
for (int x : arr) cout << x << " ";
\`\`\`

## Memory Layout

> [!NOTE]
> Arrays are stored in **contiguous memory**. If the first element is at address 1000 and each int is 4 bytes, then arr[3] is at 1000 + 3×4 = 1012.

## Common Patterns

### Two Pointers
Use two pointers i (left) and j (right) moving inward:

\`\`\`cpp
int i = 0, j = n - 1;
while (i < j) {
    // process arr[i] and arr[j]
    i++; j--;
}
\`\`\`

### Prefix Sum
Precompute prefix sums for range query in O(1):

\`\`\`cpp
vector<int> pre(n + 1, 0);
for (int i = 0; i < n; i++)
    pre[i + 1] = pre[i] + arr[i];

// Sum from index l to r (0-indexed):
int rangeSum = pre[r + 1] - pre[l];
\`\`\`

## Practice Problems

- Find maximum element — Codeforces 1A
- Subarray with given sum — GFG
- Trapping Rain Water — LeetCode 42
`,
    },
    {
      topicId: kadaneTopic!.id,
      title: "Kadane's Algorithm",
      summary: 'Maximum subarray sum problem solved in O(n) time.',
      tags: ['arrays', 'dp', 'greedy'],
      estimatedMinutes: 15,
      markdownContent: `# Kadane's Algorithm

Kadane's Algorithm solves the **Maximum Subarray Sum** problem in $O(n)$ time and $O(1)$ space.

## Problem Statement

Given an array of integers (which may include negatives), find the **contiguous subarray** with the largest sum.

**Example:**
$$\\text{arr} = [-2, 1, -3, 4, -1, 2, 1, -5, 4]$$
$$\\text{Answer} = 6 \\quad (\\text{subarray: } [4, -1, 2, 1])$$

## Algorithm

\`\`\`cpp
int maxSubarraySum(vector<int>& arr) {
    int maxSum = arr[0];
    int currentSum = arr[0];

    for (int i = 1; i < arr.size(); i++) {
        // Either extend current subarray or start fresh
        currentSum = max(arr[i], currentSum + arr[i]);
        maxSum = max(maxSum, currentSum);
    }
    return maxSum;
}
\`\`\`

## Intuition

At each index $i$, we decide:
- **Include** the current element in the running sum
- **Start fresh** from the current element

$$\\text{currentSum}[i] = \\max(\\text{arr}[i],\\ \\text{currentSum}[i-1] + \\text{arr}[i])$$

> [!TIP]
> If currentSum becomes negative, it's always better to start a new subarray from the next element.

## Trace Through Example

| i | arr[i] | currentSum | maxSum |
|---|--------|------------|--------|
| 0 | -2 | -2 | -2 |
| 1 | 1 | 1 | 1 |
| 2 | -3 | -2 | 1 |
| 3 | 4 | 4 | 4 |
| 4 | -1 | 3 | 4 |
| 5 | 2 | 5 | 5 |
| 6 | 1 | **6** | **6** |

## Extension: Return the Subarray

\`\`\`cpp
pair<int,int> maxSubarrayIndices(vector<int>& arr) {
    int maxSum = arr[0], curSum = arr[0];
    int start = 0, end = 0, tempStart = 0;

    for (int i = 1; i < arr.size(); i++) {
        if (arr[i] > curSum + arr[i]) {
            curSum = arr[i];
            tempStart = i;
        } else {
            curSum += arr[i];
        }
        if (curSum > maxSum) {
            maxSum = curSum;
            start = tempStart;
            end = i;
        }
    }
    return {start, end};
}
\`\`\`

## Complexity

$$\\text{Time: } O(n) \\qquad \\text{Space: } O(1)$$
`,
    },
    {
      topicId: bfsTopic!.id,
      title: 'Breadth-First Search (BFS)',
      summary: 'Level-order graph traversal using a queue.',
      tags: ['graphs', 'bfs', 'traversal'],
      estimatedMinutes: 20,
      markdownContent: `# Breadth-First Search (BFS)

BFS explores a graph **level by level**, visiting all neighbors of a node before moving to the next level.

## Applications

- Shortest path in **unweighted** graphs
- Level-order tree traversal
- Finding connected components
- Bipartite graph check

## Algorithm

\`\`\`cpp
#include <bits/stdc++.h>
using namespace std;

void bfs(int src, vector<vector<int>>& adj, int n) {
    vector<bool> visited(n, false);
    queue<int> q;

    visited[src] = true;
    q.push(src);

    while (!q.empty()) {
        int node = q.front();
        q.pop();
        cout << node << " ";

        for (int neighbor : adj[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}
\`\`\`

## Shortest Path (BFS)

\`\`\`cpp
vector<int> shortestPath(int src, int dest, vector<vector<int>>& adj, int n) {
    vector<int> dist(n, -1), parent(n, -1);
    queue<int> q;
    dist[src] = 0;
    q.push(src);

    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : adj[u]) {
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                parent[v] = u;
                q.push(v);
            }
        }
    }

    // Reconstruct path
    vector<int> path;
    for (int v = dest; v != -1; v = parent[v])
        path.push_back(v);
    reverse(path.begin(), path.end());
    return path;
}
\`\`\`

## Complexity

$$T = O(V + E), \\quad S = O(V)$$

> [!NOTE]
> BFS guarantees the **shortest path** in terms of number of edges in unweighted graphs. For weighted graphs, use Dijkstra's instead.
`,
    },
    {
      topicId: dpIntroTopic!.id,
      title: 'Introduction to Dynamic Programming',
      summary: 'Understanding the two key properties that make DP applicable.',
      tags: ['dp', 'recursion', 'memoization'],
      estimatedMinutes: 25,
      markdownContent: `# Introduction to Dynamic Programming

Dynamic Programming (DP) is an **optimization technique** that breaks problems into overlapping subproblems and stores results to avoid recomputation.

## Two Key Properties

A problem can be solved with DP if it has:

1. **Optimal Substructure** — The optimal solution contains optimal solutions to subproblems
2. **Overlapping Subproblems** — The same subproblems are solved multiple times

## Approaches

### 1. Top-Down (Memoization)

Start from the original problem, recurse, and store results in a memo table.

\`\`\`cpp
// Fibonacci with memoization
map<int, long long> memo;

long long fib(int n) {
    if (n <= 1) return n;
    if (memo.count(n)) return memo[n];
    return memo[n] = fib(n - 1) + fib(n - 2);
}
\`\`\`

### 2. Bottom-Up (Tabulation)

Build the solution from base cases up to the target.

\`\`\`cpp
long long fib(int n) {
    if (n <= 1) return n;
    vector<long long> dp(n + 1);
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; i++)
        dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}
\`\`\`

## Identifying DP Problems

> [!TIP]
> If a problem asks for **"minimum/maximum"**, **"number of ways"**, or **"is it possible"** — it's likely DP.

Common DP patterns:
- **Linear DP** — dp[i] depends on dp[i-1], dp[i-2], ...
- **Grid DP** — dp[i][j] depends on adjacent cells
- **Interval DP** — dp[l][r] depends on subintervals
- **Knapsack** — dp[i][w] = with/without item i

## Complexity Comparison

| Approach | Time | Space |
|----------|------|-------|
| Brute Force (Fibonacci) | $O(2^n)$ | $O(n)$ stack |
| Memoization | $O(n)$ | $O(n)$ |
| Tabulation | $O(n)$ | $O(n)$ |
| Space-optimized | $O(n)$ | $O(1)$ |
`,
    },
    {
      topicId: bigOTopic!.id,
      title: 'Big-O Notation and Time Complexity',
      summary: 'Analyzing algorithm efficiency with asymptotic notation.',
      tags: ['complexity', 'big-o', 'analysis'],
      estimatedMinutes: 20,
      markdownContent: `# Big-O Notation

Big-O notation describes the **upper bound** of an algorithm's growth rate as input size $n$ grows.

## Formal Definition

$$f(n) = O(g(n)) \\iff \\exists\\, c > 0,\\ n_0 > 0 \\text{ such that } f(n) \\leq c \\cdot g(n)\\ \\forall n \\geq n_0$$

## Common Complexities (Best to Worst)

| Complexity | Name | Example |
|------------|------|---------|
| $O(1)$ | Constant | Array access |
| $O(\\log n)$ | Logarithmic | Binary search |
| $O(n)$ | Linear | Linear scan |
| $O(n \\log n)$ | Linearithmic | Merge sort |
| $O(n^2)$ | Quadratic | Bubble sort |
| $O(2^n)$ | Exponential | Brute force subsets |
| $O(n!)$ | Factorial | Permutations |

## Rules for Calculating Big-O

### 1. Drop constants
$$O(2n) = O(n)$$

### 2. Drop lower-order terms
$$O(n^2 + n) = O(n^2)$$

### 3. Loops multiply
\`\`\`cpp
for (int i = 0; i < n; i++)      // O(n)
    for (int j = 0; j < n; j++)  // × O(n)
        // O(n²) total
\`\`\`

### 4. Consecutive code adds
\`\`\`cpp
sort(arr, arr + n);     // O(n log n)
for (int x : arr) ...;  // + O(n)
// Total: O(n log n)
\`\`\`

## Space Complexity

Space complexity counts **extra memory** used (not counting input).

\`\`\`cpp
// O(1) space — only variables
int sum = 0;
for (int x : arr) sum += x;

// O(n) space — extra array
vector<int> dp(n + 1, 0);
\`\`\`

> [!WARNING]
> Recursion uses **stack space**. A recursion of depth $n$ uses $O(n)$ space even if no arrays are allocated.
`,
    },
  ];

  for (const ed of editorials) {
    await prisma.editorial.upsert({
      where: { topicId: ed.topicId },
      update: { markdownContent: ed.markdownContent, title: ed.title, summary: ed.summary, tags: ed.tags, estimatedMinutes: ed.estimatedMinutes, published: true },
      create: { ...ed, published: true },
    });
  }

  console.log('✅ Sample editorials seeded');
  console.log('\n🎉 Seeding complete!');
  console.log('   Admin: admin@dsasuite.com / Admin@1234');
  console.log('   Demo:  demo@dsasuite.com  / User@1234');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
