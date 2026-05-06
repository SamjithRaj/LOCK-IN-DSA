export interface LessonModule {
  id: string;
  title: string;
  week: number;
  level: 'Foundation' | 'Core' | 'Interview' | 'Mastery';
  summary: string;
  samjithWhy: string;
  mentalModel: string;
  whenToUse: string[];
  deepDive: string[];
  template: string[];
  trace: string[];
  pitfalls: string[];
  animation: 'pointers' | 'window' | 'binary' | 'stack' | 'tree' | 'heap' | 'graph' | 'backtrack';
  interviewScript: string;
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
    title: 'Arrays & Two Pointers',
    week: 1,
    level: 'Foundation',
    summary: 'Arrays are the interview playground; two pointers teach you how to delete entire groups of bad answers in one move.',
    samjithWhy: 'This is your LOCK-IN warm-up because FAANG interviews reward proof-driven simplicity. If you can explain why a pointer move is safe, you are already thinking like an interviewer expects.',
    mentalModel: 'Imagine a sorted line of candidates. The left and right pointers are guards squeezing the search space. A move is allowed only when you can prove every skipped candidate can no longer be optimal.',
    whenToUse: ['Input is sorted or can be sorted without losing meaning.', 'You compare pairs, ends of a string, or need in-place compaction.', 'A brute-force nested loop repeatedly checks combinations that have an order relationship.'],
    deepDive: ['Start with the brute force: every pair is O(n²). Then ask what order tells you. In a sorted pair-sum, if nums[left] + nums[right] is too small, pairing nums[left] with anything before right is also too small, so left is useless.', 'For fast/slow pointers, the two positions encode different meanings: slow marks the write location or midpoint, while fast explores the array/list.', 'The key skill is not memorizing code; it is narrating the invariant: “All answers outside [left, right] have been ruled out.”'],
    template: ['left = 0, right = n - 1', 'while left < right:', '  inspect nums[left], nums[right]', '  if current pair is correct: return / record', '  if too small: left += 1', '  else: right -= 1'],
    trace: ['For target 9 in [1,2,4,7,11]: 1+11 is too large, so 11 cannot pair with any larger left value.', 'Move right to 7: 1+7 is too small, so 1 cannot work with any smaller right value.', 'Move left to 2: 2+7 hits 9. Every skipped pair was removed by proof.'],
    pitfalls: ['Moving both pointers without proving both sides are impossible.', 'Using two pointers on unsorted data when value order matters.', 'Forgetting that duplicate skipping should happen after recording a valid answer.'],
    animation: 'pointers',
    interviewScript: '“I will maintain a search interval. Because the data is ordered, each pointer move eliminates a set of pairs, so the scan is linear.”',
    drill: 'Solve Valid Palindrome, Two Sum II, and Remove Duplicates. After each, write the one-sentence elimination proof.',
  },
  {
    id: 'prefix-hashmaps',
    title: 'Prefix Sums & Hash Maps',
    week: 2,
    level: 'Foundation',
    summary: 'Prefix sums turn range questions into subtraction; hash maps turn “have I seen the complement?” into O(1) memory lookups.',
    samjithWhy: 'This is the first real jump from solving to engineering. You stop recalculating and start caching facts, exactly the mindset needed for scalable systems later.',
    mentalModel: 'A prefix sum is a checkpoint. A hash map is your memory palace. Together they answer: “What earlier checkpoint would make the current state valid?”',
    whenToUse: ['The problem asks about subarray sums, counts, frequencies, or complements.', 'A brute force repeatedly recomputes the same range total.', 'You need the earliest/latest index where a state occurred.'],
    deepDive: ['For range sum i..j, prefix[j] - prefix[i-1] gives the answer instantly. That means you can scan once and ask what previous prefix would make the target.', 'Hash maps are not just for lookup; they store meaning. Sometimes key = number, key = prefix sum, key = character count signature, or key = state modulo k.', 'Frequency maps are powerful when duplicates matter. A set only answers existence; a map answers how many ways.'],
    template: ['seen = {0: 1}', 'prefix = 0, answer = 0', 'for x in nums:', '  prefix += x', '  answer += seen.get(prefix - target, 0)', '  seen[prefix] += 1'],
    trace: ['nums=[1,2,3], target=3. Start seen[0]=1.', 'prefix=1: need -2, none. Store 1.', 'prefix=3: need 0, found once → subarray [1,2]. Store 3.', 'prefix=6: need 3, found once → subarray [3].'],
    pitfalls: ['Forgetting seen[0] for subarrays starting at index 0.', 'Using a set when the problem needs counts of multiple previous prefixes.', 'Updating the map before counting, which can accidentally count an empty subarray.'],
    animation: 'window',
    interviewScript: '“I will convert every subarray into a difference of two prefixes and store previous prefixes in a map so each endpoint is processed once.”',
    drill: 'Do Subarray Sum Equals K and Valid Anagram, then label exactly what each map key and value means.',
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    week: 3,
    level: 'Core',
    summary: 'Binary search is not about arrays; it is about a monotonic truth table where the answer boundary can be found by halving.',
    samjithWhy: 'This topic builds calm under pressure. When a problem looks hard, you learn to ask: “Can I check a candidate answer?” That is a senior-level reframing skill.',
    mentalModel: 'Picture a row of switches: false, false, false, true, true. Your job is to find the first true or last false without checking every switch.',
    whenToUse: ['The data is sorted, rotated-sorted, or partitioned by a yes/no condition.', 'The answer is a minimum/maximum value and you can test feasibility.', 'The problem asks for “smallest maximum”, “minimum speed”, or “capacity to finish”.'],
    deepDive: ['Classic binary search finds an item. Boundary binary search finds the first index satisfying a condition. Answer-space binary search finds a number satisfying a feasibility function.', 'The feasibility function must be monotonic. If speed k works for Koko, every speed greater than k also works. That creates the false→true boundary.', 'Most bugs are boundary bugs. Use while lo < hi for first-true searches and return lo after convergence.'],
    template: ['lo = smallest_possible', 'hi = largest_possible', 'while lo < hi:', '  mid = (lo + hi) // 2', '  if feasible(mid): hi = mid', '  else: lo = mid + 1', 'return lo'],
    trace: ['For min eating speed in [3,6,7,11], try speed 6: works? maybe yes, so answer is ≤ 6.', 'Try speed 4: works? yes, so answer is ≤ 4.', 'Try speed 3: fails, so answer is > 3. Boundary is 4.'],
    pitfalls: ['Writing a feasibility check that is not monotonic.', 'Setting hi too low and excluding the true answer.', 'Returning mid even though mid is just the last probe, not necessarily the boundary.'],
    animation: 'binary',
    interviewScript: '“I can binary search the answer because feasibility is monotonic: once a candidate works, all larger candidates also work.”',
    drill: 'Solve Search in Rotated Sorted Array, Koko Eating Bananas, and Split Array Largest Sum; write the monotonic predicate first.',
  },
  {
    id: 'stacks-linked-lists',
    title: 'Stacks, Queues & Linked Lists',
    week: 4,
    level: 'Core',
    summary: 'Stacks remember unresolved work, queues preserve arrival order, and linked lists force pointer discipline.',
    samjithWhy: 'This week makes your code cleaner. Stack and linked-list problems punish vague thinking, so they train the precision you need in interviews and later leadership roles.',
    mentalModel: 'A stack is a pile of unfinished promises. A monotonic stack keeps only candidates that can still answer future questions. A linked list is a chain where losing one pointer can lose the entire road.',
    whenToUse: ['You need the next greater/smaller element or nearest boundary.', 'The problem has nested structure like parentheses or undo behavior.', 'Nodes must be reordered without extra arrays.'],
    deepDive: ['Monotonic stacks work because popped elements have found the first future element that breaks their monotonic order. Each item is pushed and popped once, so O(n).', 'Queues are for BFS and time-order processing: first discovered, first processed.', 'Linked-list problems become easy when you draw before coding: prev, curr, next. Always save next before rewiring curr.next.'],
    template: ['stack = []', 'for i, value in enumerate(nums):', '  while stack and nums[stack[-1]] < value:', '    j = stack.pop()', '    answer[j] = value', '  stack.append(i)'],
    trace: ['Daily Temperatures [73,74,75,71]. Push 73.', '74 is warmer, so pop 73 and answer wait=1. Push 74.', '75 pops 74. 71 is cooler, so it waits unresolved on the stack.'],
    pitfalls: ['Thinking nested while means O(n²); each element pops once, so it is still O(n).', 'For linked lists, overwriting curr.next before saving the next node.', 'Using a stack when the problem requires FIFO order.'],
    animation: 'stack',
    interviewScript: '“The stack stores indices that have not found their next greater answer yet; when the invariant breaks, I resolve them.”',
    drill: 'Implement Min Stack, Daily Temperatures, Reverse Linked List, and LRU Cache with diagrams.',
  },
  {
    id: 'trees',
    title: 'Trees — DFS & BFS',
    week: 5,
    level: 'Interview',
    summary: 'Trees are recursive structure. Most tree solutions ask every node the same question and combine left and right answers.',
    samjithWhy: 'Trees appear constantly in FAANG screens. Mastering them gives you a reusable way to stay composed: define the return value, then let recursion do the repetition.',
    mentalModel: 'Every node is a manager receiving reports from children. DFS asks: “What should I return to my parent?” BFS asks: “What does this level look like?”',
    whenToUse: ['The input is hierarchical or each node has children.', 'The answer depends on subtree height, validity, path, ancestor, or level order.', 'You can solve the same smaller problem on left and right children.'],
    deepDive: ['DFS has three major flavors: preorder for top-down decisions, inorder for BST sorted order, and postorder for bottom-up aggregation.', 'For path and height problems, define the return type first: height, boolean+height, max path contribution, or serialized state.', 'BFS uses a queue and processes level size snapshots. It is the cleanest fit for level order, right side view, and shortest depth.'],
    template: ['function dfs(node):', '  if node is null: return base', '  left = dfs(node.left)', '  right = dfs(node.right)', '  update global answer if needed', '  return value for parent'],
    trace: ['For max depth, null returns 0.', 'Leaf receives left=0 and right=0, returns 1.', 'Parent returns 1 + max(leftDepth, rightDepth). The root return is the answer.'],
    pitfalls: ['Not knowing whether the answer is returned upward or stored globally.', 'Forgetting null base cases.', 'Using inorder on a non-BST and expecting sorted values.'],
    animation: 'tree',
    interviewScript: '“I will use postorder DFS because each node needs completed information from both children before it can return its own value.”',
    drill: 'Solve Max Depth, Validate BST, Diameter, and Lowest Common Ancestor. For each, write the DFS return meaning.',
  },
  {
    id: 'tries-heaps',
    title: 'Tries & Heaps',
    week: 6,
    level: 'Interview',
    summary: 'Tries optimize prefix decisions; heaps optimize repeated access to the current best or worst candidate.',
    samjithWhy: 'These are product-minded structures: autocomplete and priority queues feel like real systems, not just puzzles. They make your app-builder side stronger too.',
    mentalModel: 'A trie is a character decision tree. A heap is a constantly balanced podium where the highest-priority candidate stays on top.',
    whenToUse: ['You need prefix search, word dictionary, autocomplete, or wildcard traversal.', 'You repeatedly need top k, kth largest, merge k sorted streams, or schedule by priority.', 'Sorting everything would do too much work compared with keeping only useful candidates.'],
    deepDive: ['Trie nodes store edges by character and often an isWord flag. Search walks character by character, branching only when the query branches.', 'A heap gives O(log n) insert/pop and O(1) peek. For top k largest, a min-heap of size k discards everything below the current kth threshold.', 'Heaps combine beautifully with graphs for Dijkstra: the heap always expands the currently cheapest known path.'],
    template: ['heap = []', 'for item in stream:', '  push item into heap', '  if heap.size > k: pop worst item', 'return heap top / heap contents'],
    trace: ['Top 3 from [5,1,9,2]. Push until size 3: [1,5,9].', 'See 2: push then pop 1, keeping [2,5,9].', 'The heap contains only candidates that can still be top 3.'],
    pitfalls: ['Using a max-heap when a size-k min-heap is simpler for top-k largest.', 'For trie wildcard search, forgetting that “.” must branch into every child.', 'Assuming heap iteration is sorted; only repeated pop gives sorted order.'],
    animation: 'heap',
    interviewScript: '“I only need the best k candidates, so I will maintain a heap of size k and discard weaker candidates immediately.”',
    drill: 'Build Implement Trie, Word Search II concept notes, Kth Largest, and Merge K Lists.',
  },
  {
    id: 'graphs',
    title: 'Graphs — BFS, DFS & Union-Find',
    week: 7,
    level: 'Mastery',
    summary: 'Graphs model relationships. The hard part is choosing the right traversal and defining visited correctly.',
    samjithWhy: 'Graphs are where you start sounding like a full engineer: dependencies, networks, reachability, shortest paths, and components all map to real systems.',
    mentalModel: 'Nodes are places, edges are roads. BFS explores by distance layers, DFS explores territories, topological sort orders prerequisites, and DSU answers “are these connected?” quickly.',
    whenToUse: ['Objects have relationships: prerequisites, grids, networks, accounts, islands, dependencies.', 'You need shortest path in unweighted edges, connected components, cycle detection, or ordering.', 'Edges are added and you need fast connectivity queries.'],
    deepDive: ['BFS uses a queue and is ideal for shortest number of edges because it visits all nodes at distance d before d+1.', 'DFS is ideal for components, cycle detection, and backtracking-style exploration. For directed cycles, use three states: unvisited, visiting, visited.', 'Union-Find stores each node’s parent. Path compression and union by rank make repeated connectivity checks almost constant time.'],
    template: ['build adjacency list', 'visited = set()', 'queue = [start]', 'while queue:', '  node = queue.pop(0)', '  for nei in graph[node]:', '    if nei not visited: mark and push'],
    trace: ['Course Schedule: each course is a node; prerequisite is a directed edge.', 'Kahn BFS starts with courses having indegree 0.', 'Each completed course reduces neighbors. If processed count < n, a cycle blocked progress.'],
    pitfalls: ['Forgetting disconnected components by starting from only node 0.', 'Marking visited after enqueue instead of before, creating duplicates.', 'Using plain visited for directed cycle detection when you need visiting/visited states.'],
    animation: 'graph',
    interviewScript: '“I will model this as a graph first, then use BFS/DFS based on whether I need shortest layers, components, or dependency ordering.”',
    drill: 'Solve Number of Islands, Course Schedule, Redundant Connection, and Network Delay Time. Draw nodes and edges first.',
  },
  {
    id: 'backtracking',
    title: 'Backtracking & Consolidation',
    week: 8,
    level: 'Mastery',
    summary: 'Backtracking is disciplined trial and undo. It searches a decision tree while keeping state clean.',
    samjithWhy: 'This is your capstone because it trains resilience. You learn to explore, fail fast, undo, and keep going — exactly the LOCK-IN mindset.',
    mentalModel: 'Imagine walking a maze with a notebook. You choose a path, recurse, then erase that choice before trying the next path.',
    whenToUse: ['You must generate all subsets, combinations, permutations, boards, or valid configurations.', 'The solution space is a decision tree with constraints.', 'A greedy single choice is not enough because multiple futures must be explored.'],
    deepDive: ['Backtracking has three ingredients: choices, constraints, and goal. At every call, loop through choices, skip invalid choices, make one choice, recurse, then undo.', 'The undo step is what keeps sibling branches independent. Without it, state leaks across branches and bugs become invisible.', 'Pruning is the optimization layer: stop exploring as soon as remaining choices cannot lead to a valid answer.'],
    template: ['def backtrack(path, start):', '  if goal reached: save copy(path); return', '  for choice in choices:', '    if invalid(choice): continue', '    path.append(choice)', '    backtrack(path, next_start)', '    path.pop()'],
    trace: ['Subsets of [1,2]: start [].', 'Choose 1 → path [1]. Choose 2 → [1,2], save.', 'Undo 2 → [1]. Undo 1 → []. Choose 2 → [2].'],
    pitfalls: ['Saving path by reference instead of saving a copy.', 'Forgetting to undo path/visited after recursion.', 'Using the wrong start index and accidentally generating duplicates.'],
    animation: 'backtrack',
    interviewScript: '“This is a decision tree. I will make a choice, recurse with updated state, then undo so the next branch starts clean.”',
    drill: 'Solve Subsets, Combination Sum, Permutations, Word Search, then write a debrief on your three weakest patterns.',
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

export const DOUBT_TOPICS = LESSONS.map(lesson => ({
  keys: [lesson.id, ...lesson.title.toLowerCase().replace(/[—&]/g, ' ').split(/\s+/).filter(Boolean)],
  title: lesson.title,
  answer: `${lesson.mentalModel} ${lesson.deepDive[0]}`,
  next: lesson.drill,
}));
