// apps/api/prisma/seed.ts
import { PrismaClient, CategoryType, Difficulty, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ── Map our labels to your actual Difficulty enum ─────────────────────────────
// Your schema: BEGINNER | INTERMEDIATE | ADVANCED
const D = {
  EASY: Difficulty.BEGINNER,
  MEDIUM: Difficulty.INTERMEDIATE,
  HARD: Difficulty.ADVANCED,
} as const;

async function main() {
  console.log('🌱 Seeding database...');

  // ── Users ──────────────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash('Admin@1234', 10);
  const userHash = await bcrypt.hash('User@1234', 10);

  await prisma.user.upsert({
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

  // ── Helper ─────────────────────────────────────────────────────────────────
  async function upsertSubjectWithTopics(
    categoryType: CategoryType,
    subjectName: string,
    subjectSlug: string,
    description: string,
    topics: {
      title: string;
      slug: string;
      shortDescription: string;
      difficulty: Difficulty;
      order: number;
    }[],
  ) {
    const subject = await prisma.subject.upsert({
      where: { slug: subjectSlug },
      update: { name: subjectName, description, categoryType },
      create: {
        name: subjectName,
        slug: subjectSlug,
        description,
        categoryType,
      },
    });

    for (const t of topics) {
      await prisma.topic.upsert({
        where: { slug: t.slug },
        update: {
          title: t.title,
          shortDescription: t.shortDescription,
          difficulty: t.difficulty,
          orderIndex: t.order,
        },
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

  // ── DSA — Data Structures ──────────────────────────────────────────────────
  await upsertSubjectWithTopics(
    CategoryType.DSA,
    'Arrays',
    'arrays',
    'The most fundamental data structure in programming.',
    [
      { title: 'Introduction to Arrays', slug: 'arrays-intro', shortDescription: 'Basics of arrays, indexing, and traversal', difficulty: D.EASY, order: 1 },
      { title: 'Array Rotation', slug: 'array-rotation', shortDescription: 'Left/right rotation algorithms', difficulty: D.EASY, order: 2 },
      { title: "Kadane's Algorithm", slug: 'kadanes-algorithm', shortDescription: 'Maximum subarray sum in O(n)', difficulty: D.MEDIUM, order: 3 },
      { title: 'Dutch National Flag', slug: 'dutch-national-flag', shortDescription: '3-way partitioning in one pass', difficulty: D.MEDIUM, order: 4 },
    ],
  );

  await upsertSubjectWithTopics(
    CategoryType.DSA,
    'Strings',
    'strings',
    'String manipulation and pattern matching.',
    [
      { title: 'String Basics', slug: 'strings-basics', shortDescription: 'String operations and immutability', difficulty: D.EASY, order: 1 },
      { title: 'KMP Algorithm', slug: 'kmp-algorithm', shortDescription: 'Knuth-Morris-Pratt pattern matching', difficulty: D.HARD, order: 2 },
      { title: 'Rabin-Karp', slug: 'rabin-karp', shortDescription: 'Rolling hash for pattern search', difficulty: D.HARD, order: 3 },
      { title: 'Anagram Check', slug: 'anagram-check', shortDescription: 'Detecting anagrams efficiently', difficulty: D.EASY, order: 4 },
    ],
  );

  await upsertSubjectWithTopics(
    CategoryType.DSA,
    'Linked List',
    'linked-list',
    'Singly, doubly, and circular linked lists.',
    [
      { title: 'Singly Linked List', slug: 'singly-linked-list', shortDescription: 'Insert, delete, search operations', difficulty: D.EASY, order: 1 },
      { title: 'Doubly Linked List', slug: 'doubly-linked-list', shortDescription: 'Bidirectional traversal', difficulty: D.EASY, order: 2 },
      { title: "Floyd's Cycle Detection", slug: 'cycle-detection', shortDescription: 'Tortoise and hare algorithm', difficulty: D.MEDIUM, order: 3 },
      { title: 'Reverse a Linked List', slug: 'reverse-linked-list', shortDescription: 'Iterative and recursive reversal', difficulty: D.EASY, order: 4 },
      { title: 'Merge Two Sorted Lists', slug: 'merge-sorted-lists', shortDescription: 'Merging strategy with two pointers', difficulty: D.MEDIUM, order: 5 },
    ],
  );

  await upsertSubjectWithTopics(
    CategoryType.DSA,
    'Stack',
    'stack',
    'LIFO data structure with applications.',
    [
      { title: 'Stack Implementation', slug: 'stack-impl', shortDescription: 'Array and linked list implementations', difficulty: D.EASY, order: 1 },
      { title: 'Balanced Parentheses', slug: 'balanced-parens', shortDescription: 'Validate bracket sequences', difficulty: D.EASY, order: 2 },
      { title: 'Next Greater Element', slug: 'next-greater-element', shortDescription: 'Monotonic stack pattern', difficulty: D.MEDIUM, order: 3 },
      { title: 'Min Stack', slug: 'min-stack', shortDescription: 'O(1) minimum with extra stack', difficulty: D.MEDIUM, order: 4 },
    ],
  );

  await upsertSubjectWithTopics(
    CategoryType.DSA,
    'Queue',
    'queue',
    'FIFO data structure and its variants.',
    [
      { title: 'Queue Implementation', slug: 'queue-impl', shortDescription: 'Array and linked list implementations', difficulty: D.EASY, order: 1 },
      { title: 'Circular Queue', slug: 'circular-queue', shortDescription: 'Fixed-size circular buffer', difficulty: D.EASY, order: 2 },
      { title: 'Deque', slug: 'deque', shortDescription: 'Double-ended queue operations', difficulty: D.MEDIUM, order: 3 },
    ],
  );

  await upsertSubjectWithTopics(
    CategoryType.DSA,
    'Tree',
    'tree',
    'Binary trees, traversals, and properties.',
    [
      { title: 'Binary Tree Basics', slug: 'binary-tree-basics', shortDescription: 'Nodes, depth, height, leaves', difficulty: D.EASY, order: 1 },
      { title: 'Tree Traversals', slug: 'tree-traversals', shortDescription: 'Inorder, Preorder, Postorder, BFS', difficulty: D.EASY, order: 2 },
      { title: 'LCA of Binary Tree', slug: 'lca-binary-tree', shortDescription: 'Lowest common ancestor algorithms', difficulty: D.MEDIUM, order: 3 },
      { title: 'Diameter of Tree', slug: 'tree-diameter', shortDescription: 'Longest path between two nodes', difficulty: D.MEDIUM, order: 4 },
    ],
  );

  await upsertSubjectWithTopics(
    CategoryType.DSA,
    'BST',
    'bst',
    'Binary Search Tree operations and balancing.',
    [
      { title: 'BST Operations', slug: 'bst-operations', shortDescription: 'Insert, delete, search in O(h)', difficulty: D.EASY, order: 1 },
      { title: 'AVL Tree', slug: 'avl-tree', shortDescription: 'Self-balancing BST with rotations', difficulty: D.HARD, order: 2 },
      { title: 'BST to Sorted Array', slug: 'bst-to-sorted', shortDescription: 'Inorder traversal gives sorted output', difficulty: D.EASY, order: 3 },
    ],
  );

  await upsertSubjectWithTopics(
    CategoryType.DSA,
    'Heap',
    'heap',
    'Priority queue and heap sort.',
    [
      { title: 'Min Heap and Max Heap', slug: 'heap-basics', shortDescription: 'Heap property and heapify operations', difficulty: D.MEDIUM, order: 1 },
      { title: 'Heap Sort', slug: 'heap-sort', shortDescription: 'In-place O(n log n) sort using heap', difficulty: D.MEDIUM, order: 2 },
      { title: 'K-th Largest Element', slug: 'kth-largest', shortDescription: 'Using min-heap of size K', difficulty: D.MEDIUM, order: 3 },
    ],
  );

  await upsertSubjectWithTopics(
    CategoryType.DSA,
    'Graph',
    'graph',
    'Graph representations and traversal algorithms.',
    [
      { title: 'Graph Representation', slug: 'graph-representation', shortDescription: 'Adjacency matrix vs list', difficulty: D.EASY, order: 1 },
      { title: 'BFS Traversal', slug: 'bfs', shortDescription: 'Breadth-first search with queue', difficulty: D.EASY, order: 2 },
      { title: 'DFS Traversal', slug: 'dfs', shortDescription: 'Depth-first search with recursion/stack', difficulty: D.EASY, order: 3 },
      { title: "Dijkstra's Algorithm", slug: 'dijkstra', shortDescription: 'Shortest path with priority queue', difficulty: D.MEDIUM, order: 4 },
      { title: 'Topological Sort', slug: 'topological-sort', shortDescription: "Ordering in DAGs via Kahn's / DFS", difficulty: D.MEDIUM, order: 5 },
    ],
  );

  await upsertSubjectWithTopics(
    CategoryType.DSA,
    'Dynamic Programming',
    'dynamic-programming',
    'Memoization and tabulation techniques.',
    [
      { title: 'DP Introduction', slug: 'dp-intro', shortDescription: 'Overlapping subproblems and optimal substructure', difficulty: D.MEDIUM, order: 1 },
      { title: '0/1 Knapsack', slug: 'knapsack-01', shortDescription: 'Classic DP with items and capacity', difficulty: D.MEDIUM, order: 2 },
      { title: 'Longest Common Subsequence', slug: 'lcs', shortDescription: 'LCS with 2D DP table', difficulty: D.MEDIUM, order: 3 },
      { title: 'Coin Change', slug: 'coin-change', shortDescription: 'Minimum coins for a target sum', difficulty: D.MEDIUM, order: 4 },
      { title: 'Matrix Chain Multiplication', slug: 'matrix-chain', shortDescription: 'Optimal parenthesization using interval DP', difficulty: D.HARD, order: 5 },
    ],
  );

  // ── DSA — Algorithms ───────────────────────────────────────────────────────
  await upsertSubjectWithTopics(
    CategoryType.DSA,
    'Sorting',
    'sorting',
    'Comparison and non-comparison sorting.',
    [
      { title: 'Bubble Sort', slug: 'bubble-sort', shortDescription: 'Simple O(n²) sorting', difficulty: D.EASY, order: 1 },
      { title: 'Merge Sort', slug: 'merge-sort', shortDescription: 'Divide and conquer O(n log n)', difficulty: D.MEDIUM, order: 2 },
      { title: 'Quick Sort', slug: 'quick-sort', shortDescription: 'Pivot-based partitioning', difficulty: D.MEDIUM, order: 3 },
      { title: 'Counting Sort', slug: 'counting-sort', shortDescription: 'Linear time sorting with integer keys', difficulty: D.EASY, order: 4 },
    ],
  );

  await upsertSubjectWithTopics(
    CategoryType.DSA,
    'Binary Search',
    'binary-search',
    'Logarithmic search on sorted data.',
    [
      { title: 'Binary Search Basics', slug: 'binary-search-basics', shortDescription: 'Classic search in sorted array', difficulty: D.EASY, order: 1 },
      { title: 'Lower & Upper Bound', slug: 'lower-upper-bound', shortDescription: 'Finding boundaries with binary search', difficulty: D.MEDIUM, order: 2 },
      { title: 'Binary Search on Answer', slug: 'binary-search-answer', shortDescription: 'Applying BS to optimization problems', difficulty: D.HARD, order: 3 },
    ],
  );

  await upsertSubjectWithTopics(
    CategoryType.DSA,
    'Greedy',
    'greedy',
    'Greedy choice property and proofs.',
    [
      { title: 'Activity Selection', slug: 'activity-selection', shortDescription: 'Maximize non-overlapping activities', difficulty: D.MEDIUM, order: 1 },
      { title: 'Fractional Knapsack', slug: 'fractional-knapsack', shortDescription: 'Greedy by value/weight ratio', difficulty: D.MEDIUM, order: 2 },
      { title: 'Huffman Encoding', slug: 'huffman-encoding', shortDescription: 'Optimal prefix-free codes', difficulty: D.HARD, order: 3 },
    ],
  );

  await upsertSubjectWithTopics(
    CategoryType.DSA,
    'Two Pointers',
    'two-pointers',
    'Efficient linear-time array techniques.',
    [
      { title: 'Two Sum (Sorted)', slug: 'two-sum-sorted', shortDescription: 'Find pair summing to target', difficulty: D.EASY, order: 1 },
      { title: 'Three Sum', slug: 'three-sum', shortDescription: 'Find triplets summing to zero', difficulty: D.MEDIUM, order: 2 },
      { title: 'Container With Most Water', slug: 'container-water', shortDescription: 'Maximize area with two pointers', difficulty: D.MEDIUM, order: 3 },
    ],
  );

  await upsertSubjectWithTopics(
    CategoryType.DSA,
    'Sliding Window',
    'sliding-window',
    'Window-based subarray and substring problems.',
    [
      { title: 'Maximum Sum Subarray of Size K', slug: 'max-sum-subarray-k', shortDescription: 'Fixed-size sliding window', difficulty: D.EASY, order: 1 },
      { title: 'Longest Substring Without Repeating', slug: 'longest-unique-substr', shortDescription: 'Variable-size window with set', difficulty: D.MEDIUM, order: 2 },
    ],
  );

  console.log('✅ DSA subjects & topics seeded');

  // ── Competitive Programming ────────────────────────────────────────────────
  await upsertSubjectWithTopics(
    CategoryType.CP,
    'Time Complexity',
    'cp-time-complexity',
    'Analyzing algorithmic efficiency.',
    [
      { title: 'Big-O Notation', slug: 'big-o', shortDescription: 'O, Ω, Θ notation explained', difficulty: D.EASY, order: 1 },
      { title: 'Amortized Analysis', slug: 'amortized-analysis', shortDescription: 'Average cost over sequences of ops', difficulty: D.MEDIUM, order: 2 },
    ],
  );

  await upsertSubjectWithTopics(
    CategoryType.CP,
    'Number Theory',
    'number-theory',
    'Mathematical foundations for CP.',
    [
      { title: 'Sieve of Eratosthenes', slug: 'sieve', shortDescription: 'Finding all primes up to N', difficulty: D.EASY, order: 1 },
      { title: 'GCD and LCM', slug: 'gcd-lcm', shortDescription: 'Euclidean algorithm and applications', difficulty: D.EASY, order: 2 },
      { title: 'Modular Arithmetic', slug: 'modular-arithmetic', shortDescription: 'Modular inverse, fast exponentiation', difficulty: D.MEDIUM, order: 3 },
      { title: 'Chinese Remainder Theorem', slug: 'crt', shortDescription: 'Solving systems of congruences', difficulty: D.HARD, order: 4 },
    ],
  );

  await upsertSubjectWithTopics(
    CategoryType.CP,
    'Graph Algorithms',
    'cp-graph-algorithms',
    'Advanced graph problems in competitive programming.',
    [
      { title: 'Floyd-Warshall', slug: 'floyd-warshall', shortDescription: 'All-pairs shortest paths in O(V³)', difficulty: D.MEDIUM, order: 1 },
      { title: 'Bellman-Ford', slug: 'bellman-ford', shortDescription: 'Shortest path with negative edges', difficulty: D.MEDIUM, order: 2 },
      { title: 'Strongly Connected Components', slug: 'scc', shortDescription: "Kosaraju's and Tarjan's algorithms", difficulty: D.HARD, order: 3 },
      { title: 'Minimum Spanning Tree', slug: 'mst', shortDescription: "Kruskal's and Prim's algorithms", difficulty: D.MEDIUM, order: 4 },
    ],
  );

  await upsertSubjectWithTopics(
    CategoryType.CP,
    'Dynamic Programming',
    'cp-dp',
    'Advanced DP patterns for contests.',
    [
      { title: 'Digit DP', slug: 'digit-dp', shortDescription: 'Counting numbers with digit constraints', difficulty: D.HARD, order: 1 },
      { title: 'Bitmask DP', slug: 'bitmask-dp', shortDescription: 'DP on subsets using bitmasks', difficulty: D.HARD, order: 2 },
      { title: 'DP on Trees', slug: 'dp-on-trees', shortDescription: 'Tree DP with rerooting technique', difficulty: D.HARD, order: 3 },
    ],
  );

  await upsertSubjectWithTopics(
    CategoryType.CP,
    'Strings',
    'cp-strings',
    'String algorithms for competitive programming.',
    [
      { title: 'Z-Function', slug: 'z-function', shortDescription: 'Linear time string matching', difficulty: D.HARD, order: 1 },
      { title: 'Suffix Array', slug: 'suffix-array', shortDescription: 'Sorted array of all suffixes', difficulty: D.HARD, order: 2 },
      { title: 'Aho-Corasick', slug: 'aho-corasick', shortDescription: 'Multi-pattern string matching', difficulty: D.HARD, order: 3 },
    ],
  );

  await upsertSubjectWithTopics(
    CategoryType.CP,
    'Binary Search',
    'cp-binary-search',
    'Binary search on answer patterns.',
    [
      { title: 'Parametric Search', slug: 'parametric-search', shortDescription: 'BS on monotonic predicates', difficulty: D.MEDIUM, order: 1 },
      { title: 'Ternary Search', slug: 'ternary-search', shortDescription: 'Finding unimodal function extrema', difficulty: D.MEDIUM, order: 2 },
    ],
  );

  console.log('✅ CP subjects & topics seeded');

  // ── GATE CSE ───────────────────────────────────────────────────────────────
  await upsertSubjectWithTopics(
    CategoryType.GATE,
    'Operating Systems',
    'operating-systems',
    'OS concepts for GATE CSE.',
    [
      { title: 'Process Management', slug: 'os-process-mgmt', shortDescription: 'Process states, PCB, context switching', difficulty: D.MEDIUM, order: 1 },
      { title: 'CPU Scheduling', slug: 'cpu-scheduling', shortDescription: 'FCFS, SJF, Round Robin, Priority', difficulty: D.MEDIUM, order: 2 },
      { title: 'Deadlocks', slug: 'deadlocks', shortDescription: 'Conditions, detection, prevention, avoidance', difficulty: D.MEDIUM, order: 3 },
      { title: 'Memory Management', slug: 'memory-management', shortDescription: 'Paging, segmentation, fragmentation', difficulty: D.MEDIUM, order: 4 },
      { title: 'Virtual Memory', slug: 'virtual-memory', shortDescription: 'Demand paging and page replacement', difficulty: D.HARD, order: 5 },
      { title: 'File Systems', slug: 'file-systems', shortDescription: 'FAT, inode, directory structures', difficulty: D.MEDIUM, order: 6 },
    ],
  );

  await upsertSubjectWithTopics(
    CategoryType.GATE,
    'Databases',
    'databases',
    'DBMS and SQL for GATE CSE.',
    [
      { title: 'ER Model', slug: 'er-model', shortDescription: 'Entity-relationship diagrams and mapping', difficulty: D.EASY, order: 1 },
      { title: 'Relational Algebra', slug: 'relational-algebra', shortDescription: 'Select, project, join operations', difficulty: D.MEDIUM, order: 2 },
      { title: 'Normalization', slug: 'normalization', shortDescription: '1NF through BCNF with examples', difficulty: D.MEDIUM, order: 3 },
      { title: 'Transaction Management', slug: 'transactions', shortDescription: 'ACID, serializability, isolation levels', difficulty: D.HARD, order: 4 },
      { title: 'Indexing and B-Trees', slug: 'indexing', shortDescription: 'Dense/sparse indexes and B+ trees', difficulty: D.HARD, order: 5 },
    ],
  );

  await upsertSubjectWithTopics(
    CategoryType.GATE,
    'Computer Networks',
    'computer-networks',
    'Networking concepts for GATE.',
    [
      { title: 'OSI and TCP/IP Model', slug: 'osi-tcp-ip', shortDescription: 'Layer functions and comparison', difficulty: D.EASY, order: 1 },
      { title: 'Data Link Layer', slug: 'data-link-layer', shortDescription: 'Framing, error control, flow control', difficulty: D.MEDIUM, order: 2 },
      { title: 'IP Addressing', slug: 'ip-addressing', shortDescription: 'IPv4, subnetting, CIDR', difficulty: D.MEDIUM, order: 3 },
      { title: 'Routing Algorithms', slug: 'routing', shortDescription: 'Distance vector and link state routing', difficulty: D.HARD, order: 4 },
      { title: 'TCP vs UDP', slug: 'tcp-vs-udp', shortDescription: 'Connection-oriented vs connectionless transport', difficulty: D.MEDIUM, order: 5 },
    ],
  );

  await upsertSubjectWithTopics(
    CategoryType.GATE,
    'Theory of Computation',
    'theory-of-computation',
    'Automata, formal languages, and computability.',
    [
      { title: 'Finite Automata', slug: 'finite-automata', shortDescription: 'DFA, NFA, and equivalence', difficulty: D.MEDIUM, order: 1 },
      { title: 'Regular Languages', slug: 'regular-languages', shortDescription: 'Regular expressions and closure properties', difficulty: D.MEDIUM, order: 2 },
      { title: 'Context-Free Grammars', slug: 'cfg', shortDescription: 'CFG, parse trees, ambiguity', difficulty: D.MEDIUM, order: 3 },
      { title: 'Pushdown Automata', slug: 'pda', shortDescription: 'PDA and CFL recognition', difficulty: D.HARD, order: 4 },
      { title: 'Turing Machines', slug: 'turing-machines', shortDescription: 'TM definition and computability', difficulty: D.HARD, order: 5 },
    ],
  );

  await upsertSubjectWithTopics(
    CategoryType.GATE,
    'Discrete Mathematics',
    'discrete-mathematics',
    'Mathematical foundations for CS.',
    [
      { title: 'Set Theory', slug: 'set-theory', shortDescription: 'Sets, relations, and functions', difficulty: D.EASY, order: 1 },
      { title: 'Graph Theory', slug: 'graph-theory', shortDescription: 'Trees, planarity, coloring', difficulty: D.MEDIUM, order: 2 },
      { title: 'Combinatorics', slug: 'combinatorics', shortDescription: 'Permutations, combinations, pigeonhole', difficulty: D.MEDIUM, order: 3 },
      { title: 'Propositional Logic', slug: 'propositional-logic', shortDescription: 'Truth tables, inference rules', difficulty: D.EASY, order: 4 },
      { title: 'Recurrence Relations', slug: 'recurrence-relations', shortDescription: 'Solving recurrences with master theorem', difficulty: D.MEDIUM, order: 5 },
    ],
  );

  await upsertSubjectWithTopics(
    CategoryType.GATE,
    'Algorithms',
    'gate-algorithms',
    'Algorithm design and analysis for GATE.',
    [
      { title: 'Asymptotic Notation', slug: 'gate-asymptotic', shortDescription: 'Big-O, Omega, Theta analysis', difficulty: D.EASY, order: 1 },
      { title: 'Divide and Conquer', slug: 'divide-conquer', shortDescription: 'Master theorem and recurrences', difficulty: D.MEDIUM, order: 2 },
      { title: 'Dynamic Programming (GATE)', slug: 'gate-dp', shortDescription: 'Classic DP problems for GATE', difficulty: D.MEDIUM, order: 3 },
      { title: 'NP-Completeness', slug: 'np-completeness', shortDescription: 'P, NP, NP-hard, reductions', difficulty: D.HARD, order: 4 },
    ],
  );

  await upsertSubjectWithTopics(
    CategoryType.GATE,
    'Digital Logic',
    'digital-logic',
    'Boolean algebra and digital circuits.',
    [
      { title: 'Boolean Algebra', slug: 'boolean-algebra', shortDescription: 'Laws, theorems, simplification', difficulty: D.EASY, order: 1 },
      { title: 'Karnaugh Maps', slug: 'karnaugh-maps', shortDescription: 'K-map minimization technique', difficulty: D.MEDIUM, order: 2 },
      { title: 'Combinational Circuits', slug: 'combinational-circuits', shortDescription: 'Adders, MUX, decoders', difficulty: D.MEDIUM, order: 3 },
      { title: 'Sequential Circuits', slug: 'sequential-circuits', shortDescription: 'Flip-flops, registers, counters', difficulty: D.MEDIUM, order: 4 },
    ],
  );

  await upsertSubjectWithTopics(
    CategoryType.GATE,
    'Compiler Design',
    'compiler-design',
    'Phases of compilation for GATE.',
    [
      { title: 'Lexical Analysis', slug: 'lexical-analysis', shortDescription: 'Tokenization and regular expressions', difficulty: D.MEDIUM, order: 1 },
      { title: 'Parsing', slug: 'parsing', shortDescription: 'LL(1), LR(0), SLR, LALR parsers', difficulty: D.HARD, order: 2 },
      { title: 'Syntax-Directed Translation', slug: 'sdt', shortDescription: 'Attribute grammars and SDT schemes', difficulty: D.HARD, order: 3 },
      { title: 'Code Optimization', slug: 'code-optimization', shortDescription: 'Local and global optimizations', difficulty: D.HARD, order: 4 },
    ],
  );

  console.log('✅ GATE subjects & topics seeded');

  // ── Sample Editorials ──────────────────────────────────────────────────────
  // Your Editorial model requires: slug (unique), topicId, title, etc.
  // We use topicId-based slugs to ensure uniqueness.

  const editorialData = [
    {
      topicSlug: 'arrays-intro',
      editorialSlug: 'editorial-arrays-intro',
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
// C++ — static array
int arr[5] = {1, 2, 3, 4, 5};
int n = sizeof(arr) / sizeof(arr[0]); // n = 5

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
// range-based for
for (int x : arr) cout << x << " ";
\`\`\`

## Memory Layout

> [!NOTE]
> Arrays are stored in **contiguous memory**. If the first element is at address 1000 and each int is 4 bytes, then \`arr[3]\` is at 1000 + 3×4 = 1012.

## Common Patterns

### Prefix Sum

Precompute prefix sums for O(1) range queries:

\`\`\`cpp
vector<int> pre(n + 1, 0);
for (int i = 0; i < n; i++)
    pre[i + 1] = pre[i] + arr[i];

// Sum from index l to r (0-indexed):
int rangeSum = pre[r + 1] - pre[l];
\`\`\`

### Two Pointers

\`\`\`cpp
int i = 0, j = n - 1;
while (i < j) {
    // process arr[i] and arr[j]
    i++; j--;
}
\`\`\`
`,
    },
    {
      topicSlug: 'kadanes-algorithm',
      editorialSlug: 'editorial-kadanes-algorithm',
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

    for (int i = 1; i < (int)arr.size(); i++) {
        currentSum = max(arr[i], currentSum + arr[i]);
        maxSum = max(maxSum, currentSum);
    }
    return maxSum;
}
\`\`\`

## Intuition

At each index $i$, we decide:
- **Extend** the running subarray: \`currentSum + arr[i]\`
- **Start fresh** from here: \`arr[i]\`

$$\\text{currentSum}[i] = \\max(\\text{arr}[i],\\ \\text{currentSum}[i-1] + \\text{arr}[i])$$

> [!TIP]
> If \`currentSum\` becomes negative, it's always better to start a new subarray from the next element.

## Trace Through

| i | arr[i] | currentSum | maxSum |
|---|--------|------------|--------|
| 0 | -2 | -2 | -2 |
| 1 | 1 | 1 | 1 |
| 2 | -3 | -2 | 1 |
| 3 | 4 | 4 | 4 |
| 4 | -1 | 3 | 4 |
| 5 | 2 | 5 | 5 |
| 6 | **1** | **6** | **6** |

## Complexity

$$T = O(n), \\quad S = O(1)$$
`,
    },
    {
      topicSlug: 'bfs',
      editorialSlug: 'editorial-bfs',
      title: 'Breadth-First Search (BFS)',
      summary: 'Level-order graph traversal using a queue.',
      tags: ['graphs', 'bfs', 'traversal'],
      estimatedMinutes: 20,
      markdownContent: `# Breadth-First Search (BFS)

BFS explores a graph **level by level**, visiting all neighbors before going deeper.

## Applications

- Shortest path in unweighted graphs
- Level-order tree traversal  
- Connected components
- Bipartite check

## Implementation

\`\`\`cpp
#include <bits/stdc++.h>
using namespace std;

void bfs(int src, vector<vector<int>>& adj, int n) {
    vector<bool> visited(n, false);
    queue<int> q;

    visited[src] = true;
    q.push(src);

    while (!q.empty()) {
        int node = q.front(); q.pop();
        cout << node << " ";

        for (int nb : adj[node]) {
            if (!visited[nb]) {
                visited[nb] = true;
                q.push(nb);
            }
        }
    }
}
\`\`\`

## Shortest Path

\`\`\`cpp
vector<int> bfsDistance(int src, vector<vector<int>>& adj, int n) {
    vector<int> dist(n, -1);
    queue<int> q;
    dist[src] = 0;
    q.push(src);

    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : adj[u]) {
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                q.push(v);
            }
        }
    }
    return dist; // dist[i] = shortest hops from src to i
}
\`\`\`

## Complexity

$$T = O(V + E), \\quad S = O(V)$$

> [!NOTE]
> BFS guarantees the **shortest path by edge count** in unweighted graphs. For weighted graphs, use Dijkstra's.
`,
    },
    {
      topicSlug: 'dp-intro',
      editorialSlug: 'editorial-dp-intro',
      title: 'Introduction to Dynamic Programming',
      summary: 'Understanding the two key properties that make DP applicable.',
      tags: ['dp', 'recursion', 'memoization'],
      estimatedMinutes: 25,
      markdownContent: `# Introduction to Dynamic Programming

Dynamic Programming (DP) breaks problems into **overlapping subproblems** and stores results to avoid recomputation.

## Two Key Properties

1. **Optimal Substructure** — Optimal solution contains optimal solutions to subproblems
2. **Overlapping Subproblems** — Same subproblems are solved multiple times

## Top-Down (Memoization)

\`\`\`cpp
unordered_map<int, long long> memo;

long long fib(int n) {
    if (n <= 1) return n;
    if (memo.count(n)) return memo[n];
    return memo[n] = fib(n - 1) + fib(n - 2);
}
\`\`\`

## Bottom-Up (Tabulation)

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

## Complexity Comparison

| Approach | Time | Space |
|----------|------|-------|
| Brute Force | $O(2^n)$ | $O(n)$ |
| Memoization | $O(n)$ | $O(n)$ |
| Tabulation | $O(n)$ | $O(n)$ |
| Space-optimized | $O(n)$ | $O(1)$ |

> [!TIP]
> If a problem asks for **min/max**, **number of ways**, or **is it possible** — it's likely DP.
`,
    },
    {
      topicSlug: 'big-o',
      editorialSlug: 'editorial-big-o',
      title: 'Big-O Notation and Time Complexity',
      summary: 'Analyzing algorithm efficiency with asymptotic notation.',
      tags: ['complexity', 'big-o', 'analysis'],
      estimatedMinutes: 20,
      markdownContent: `# Big-O Notation

Big-O describes the **upper bound** on growth rate as input size $n$ grows.

## Common Complexities

| Complexity | Name | Example |
|------------|------|---------|
| $O(1)$ | Constant | Array access |
| $O(\\log n)$ | Logarithmic | Binary search |
| $O(n)$ | Linear | Linear scan |
| $O(n \\log n)$ | Linearithmic | Merge sort |
| $O(n^2)$ | Quadratic | Bubble sort |
| $O(2^n)$ | Exponential | Brute force subsets |

## Simplification Rules

**Drop constants:**
$$O(2n) = O(n)$$

**Drop lower-order terms:**
$$O(n^2 + n) = O(n^2)$$

**Loops multiply:**
\`\`\`cpp
for (int i = 0; i < n; i++)      // O(n)
    for (int j = 0; j < n; j++)  //   × O(n)
        doWork();                 // = O(n²)
\`\`\`

**Sequential code adds:**
\`\`\`cpp
sort(arr, arr + n);   // O(n log n)
for (int x : arr) {}  // + O(n)
// Total = O(n log n)
\`\`\`

> [!WARNING]
> Recursion uses **stack space**. A recursion of depth $n$ uses $O(n)$ extra space even with no arrays.
`,
    },
  ];

  for (const ed of editorialData) {
    // Look up the topic by its slug
    const topic = await prisma.topic.findUnique({ where: { slug: ed.topicSlug } });
    if (!topic) {
      console.warn(`⚠️  Topic not found for slug: ${ed.topicSlug} — skipping editorial`);
      continue;
    }

    await prisma.editorial.upsert({
      where: { slug: ed.editorialSlug },
      update: {
        title: ed.title,
        summary: ed.summary,
        markdownContent: ed.markdownContent,
        tags: ed.tags,
        estimatedMinutes: ed.estimatedMinutes,
        published: true,
      },
      create: {
        slug: ed.editorialSlug,
        topicId: topic.id,
        title: ed.title,
        summary: ed.summary,
        markdownContent: ed.markdownContent,
        tags: ed.tags,
        estimatedMinutes: ed.estimatedMinutes,
        published: true,
      },
    });
  }

  console.log('✅ Sample editorials seeded');
  console.log('\n🎉 Seeding complete!');
  console.log('   Admin: admin@dsasuite.com / Admin@1234');
  console.log('   Demo:  demo@dsasuite.com  / User@1234');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
