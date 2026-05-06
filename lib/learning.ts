export interface LessonModule {
  id: string;
  title: string;
  level: 'Beginner' | 'Core' | 'Interview';
  summary: string;
  mentalModel: string;
  template: string[];
  pitfalls: string[];
  drill: string;
}

export interface ArenaChallenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium';
  pattern: string;
  prompt: string;
  examples: string[];
  approach: string[];
  starter: string;
  solution: string;
}

export const LESSONS: LessonModule[] = [
  {
    id: 'arrays-two-pointers',
    title: 'Arrays + Two Pointers',
    level: 'Beginner',
    summary: 'Turn nested loops into one linear scan by keeping two useful positions in the array.',
    mentalModel: 'If the array is sorted or you are comparing both ends, every pointer move should permanently eliminate impossible answers.',
    template: ['left = 0, right = n - 1', 'while left < right:', '  inspect nums[left] + nums[right]', '  move the side that cannot help anymore'],
    pitfalls: ['Moving both pointers when only one side was proven wrong.', 'Forgetting to skip non-data characters in string problems.', 'Using two pointers on unsorted data when order is required.'],
    drill: 'Solve Valid Palindrome, Two Sum II, then re-explain why each pointer move is safe.',
  },
  {
    id: 'sliding-window',
    title: 'Sliding Window',
    level: 'Core',
    summary: 'Maintain a live subarray/string and expand or shrink it instead of recomputing from scratch.',
    mentalModel: 'The right pointer explores new candidates; the left pointer restores the invariant when the window becomes invalid.',
    template: ['left = 0', 'for right in range(n):', '  add nums[right] to window', '  while window invalid: remove nums[left]; left++', '  update best answer'],
    pitfalls: ['Updating the answer before the window is valid.', 'Confusing fixed-size and variable-size windows.', 'Not tracking counts when duplicates matter.'],
    drill: 'For every window problem, write the invariant in one sentence before coding.',
  },
  {
    id: 'binary-search',
    title: 'Binary Search on Answer',
    level: 'Interview',
    summary: 'Search the answer space when you can verify if a candidate value is possible.',
    mentalModel: 'You are not searching an array; you are searching the first value where a monotonic yes/no predicate flips.',
    template: ['lo = minimum possible answer', 'hi = maximum possible answer', 'while lo < hi:', '  mid = (lo + hi) // 2', '  if feasible(mid): hi = mid else lo = mid + 1'],
    pitfalls: ['Writing a predicate that is not monotonic.', 'Returning mid instead of lo after convergence.', 'Choosing bounds that exclude the true answer.'],
    drill: 'Practice Koko Eating Bananas and Split Array Largest Sum back-to-back.',
  },
  {
    id: 'graphs',
    title: 'Graphs: BFS, DFS, Topo',
    level: 'Interview',
    summary: 'Model relationships as nodes and edges, then choose traversal based on the question.',
    mentalModel: 'BFS gives shortest layers in unweighted graphs; DFS explores components; topological sort orders dependencies.',
    template: ['build adjacency list', 'create visited/state arrays', 'for each unvisited node:', '  traverse with queue or recursion', '  record component/order/answer'],
    pitfalls: ['Forgetting disconnected components.', 'Marking visited too late and duplicating work.', 'Using DFS recursion without cycle states for dependency questions.'],
    drill: 'Draw the graph for Course Schedule before writing a single line of code.',
  },
];

export const CHALLENGES: ArenaChallenge[] = [
  {
    id: 'contains-duplicate',
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    pattern: 'Hash Set',
    prompt: 'Given an integer array, return true if any value appears at least twice.',
    examples: ['[1,2,3,1] → true', '[1,2,3,4] → false'],
    approach: ['Create an empty set.', 'Scan each number once.', 'If the set already has the number, return true.', 'Otherwise add it and finish with false.'],
    starter: 'function containsDuplicate(nums) {\n  // your code here\n}',
    solution: 'function containsDuplicate(nums) {\n  const seen = new Set();\n  for (const n of nums) {\n    if (seen.has(n)) return true;\n    seen.add(n);\n  }\n  return false;\n}',
  },
  {
    id: 'valid-palindrome',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    pattern: 'Two Pointers',
    prompt: 'Return true if a string reads the same forward and backward after ignoring non-alphanumeric characters and case.',
    examples: ['"A man, a plan, a canal: Panama" → true', '"race a car" → false'],
    approach: ['Put one pointer at the start and one at the end.', 'Skip non-alphanumeric characters.', 'Compare lowercase characters.', 'Move inward until pointers cross.'],
    starter: 'function isPalindrome(s) {\n  // your code here\n}',
    solution: 'function isPalindrome(s) {\n  let l = 0, r = s.length - 1;\n  const ok = c => /[a-z0-9]/i.test(c);\n  while (l < r) {\n    while (l < r && !ok(s[l])) l++;\n    while (l < r && !ok(s[r])) r--;\n    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;\n    l++; r--;\n  }\n  return true;\n}',
  },
  {
    id: 'max-profit',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    pattern: 'Greedy Scan',
    prompt: 'Given daily prices, choose one buy day and one future sell day to maximize profit.',
    examples: ['[7,1,5,3,6,4] → 5', '[7,6,4,3,1] → 0'],
    approach: ['Track the cheapest price seen so far.', 'For each day, compute today\'s sell profit.', 'Keep the maximum profit.', 'Update the cheapest price.'],
    starter: 'function maxProfit(prices) {\n  // your code here\n}',
    solution: 'function maxProfit(prices) {\n  let minPrice = Infinity, best = 0;\n  for (const price of prices) {\n    best = Math.max(best, price - minPrice);\n    minPrice = Math.min(minPrice, price);\n  }\n  return best;\n}',
  },
];

export const DOUBT_TOPICS = [
  {
    keys: ['two pointer', 'two pointers', 'left right', 'palindrome'],
    title: 'Two pointers',
    answer: 'Use two pointers when each movement can discard a group of impossible answers. In sorted pair-sum, if sum is too small, moving left rightward is safe because every value before it is even smaller. If sum is too large, move right leftward.',
    next: 'Try explaining the pointer movement as a proof, not a trick.',
  },
  {
    keys: ['sliding', 'window', 'substring', 'subarray'],
    title: 'Sliding window',
    answer: 'Sliding window is for contiguous ranges. Expand with right to include new information, shrink with left until your invariant is valid again, then update the answer.',
    next: 'Write: “My window is valid when ___.” That sentence usually unlocks the code.',
  },
  {
    keys: ['binary search', 'predicate', 'answer space', 'koko'],
    title: 'Binary search on answer',
    answer: 'Use binary search on answer when you can ask: “is candidate X enough?” and the answers look like no, no, no, yes, yes. The feasible function is the main problem.',
    next: 'First pick lo/hi, then test three candidate values manually before coding.',
  },
  {
    keys: ['graph', 'bfs', 'dfs', 'cycle', 'topological'],
    title: 'Graphs',
    answer: 'Start by defining nodes, edges, and what visited means. Use BFS for shortest number of edges, DFS for exploring components, and topological sort for prerequisites/dependency order.',
    next: 'Draw a 5-node example and trace the queue or recursion stack.',
  },
];
