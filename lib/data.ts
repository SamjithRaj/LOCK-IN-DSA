export type Difficulty = 'E' | 'M' | 'H';

export interface Problem {
  id: string;
  name: string;
  leetcodeId: number;
  difficulty: Difficulty;
  pattern: string;
}

export interface Day {
  dayNum: number;
  weekNum: number;
  dayName: string;
  focus: string;
  detail: string;
  isRest: boolean;
  problems: Problem[];
  xp: number;
}

export interface Week {
  num: number;
  topic: string;
  sub: string;
  tip: string;
  days: Day[];
}

export interface Phase {
  num: number;
  title: string;
  duration: string;
  goal: string;
  weeks: Week[];
  color: string;
}

export const PHASES: Phase[] = [
  {
    num: 1,
    title: 'Foundation',
    duration: 'Months 1–2',
    goal: 'Build mental models for every core DSA topic from scratch.',
    color: '#185FA5',
    weeks: [
      {
        num: 1, topic: 'Arrays & Two Pointers',
        sub: 'The most common pattern in FAANG interviews.',
        tip: 'Every problem this week can be solved with a pointer on each end, or two pointers moving at different speeds. Ask: "Can I use two pointers here?" — it eliminates O(n²) instantly.',
        days: [
          { dayNum:1, weekNum:1, dayName:'Mon', focus:'Setup + Array Fundamentals', detail:'Install C++ environment, set up LeetCode account. Study: arrays, vector ops, indexing. Read NeetCode array intro.', isRest:false, xp:50,
            problems:[{id:'p1',name:'217. Contains Duplicate',leetcodeId:217,difficulty:'E',pattern:'Hash Set'},{id:'p2',name:'242. Valid Anagram',leetcodeId:242,difficulty:'E',pattern:'Hash Map'}]},
          { dayNum:2, weekNum:1, dayName:'Tue', focus:'Two Pointer — Opposite Ends', detail:'Pattern: left=0, right=n-1, converge inward. Useful for sorted arrays, palindromes, pair sums.', isRest:false, xp:60,
            problems:[{id:'p3',name:'125. Valid Palindrome',leetcodeId:125,difficulty:'E',pattern:'Two Pointer'},{id:'p4',name:'167. Two Sum II',leetcodeId:167,difficulty:'M',pattern:'Two Pointer'}]},
          { dayNum:3, weekNum:1, dayName:'Wed', focus:'Two Pointer — Fast & Slow', detail:'Pattern: slow moves 1 step, fast moves 2. Detects cycles, finds midpoints.', isRest:false, xp:60,
            problems:[{id:'p5',name:'26. Remove Duplicates',leetcodeId:26,difficulty:'E',pattern:'Two Pointer'},{id:'p6',name:'80. Remove Duplicates II',leetcodeId:80,difficulty:'M',pattern:'Two Pointer'}]},
          { dayNum:4, weekNum:1, dayName:'Thu', focus:'Sliding Window — Fixed Size', detail:'Pattern: add right element, remove left element, maintain window invariant.', isRest:false, xp:60,
            problems:[{id:'p7',name:'643. Max Avg Subarray I',leetcodeId:643,difficulty:'E',pattern:'Sliding Window'},{id:'p8',name:'219. Contains Duplicate II',leetcodeId:219,difficulty:'M',pattern:'Sliding Window'}]},
          { dayNum:5, weekNum:1, dayName:'Fri', focus:'Sliding Window — Variable Size', detail:'Window grows when condition valid, shrinks when violated. Key: what is your "condition"?', isRest:false, xp:70,
            problems:[{id:'p9',name:'3. Longest Substr No Repeat',leetcodeId:3,difficulty:'M',pattern:'Sliding Window'},{id:'p10',name:'424. Longest Repeating Char Replace',leetcodeId:424,difficulty:'M',pattern:'Sliding Window'}]},
          { dayNum:6, weekNum:1, dayName:'Sat', focus:'Review + Harder Variants', detail:'Re-solve Mon–Fri problems from scratch without looking. Time yourself.', isRest:false, xp:100,
            problems:[{id:'p11',name:'15. 3Sum',leetcodeId:15,difficulty:'M',pattern:'Two Pointer'},{id:'p12',name:'11. Container With Most Water',leetcodeId:11,difficulty:'M',pattern:'Two Pointer'},{id:'p13',name:'42. Trapping Rain Water',leetcodeId:42,difficulty:'H',pattern:'Two Pointer'}]},
          { dayNum:7, weekNum:1, dayName:'Sun', focus:'Rest', detail:'Complete rest. No LeetCode. Let consolidation happen.', isRest:true, xp:0, problems:[]},
        ]
      },
      {
        num: 2, topic: 'Prefix Sums & Hash Maps',
        sub: 'Hidden O(n) solutions. Most candidates miss these — they\'re your edge.',
        tip: 'Whenever you see "subarray sum equals k" or "find if X existed before", think prefix sum + hash map. Store what you\'ve seen so far, look up what you need.',
        days: [
          { dayNum:8, weekNum:2, dayName:'Mon', focus:'Hash Maps — Fundamentals', detail:'unordered_map in C++. O(1) average insert/lookup. Pattern: trade space for time.', isRest:false, xp:60,
            problems:[{id:'p14',name:'1. Two Sum',leetcodeId:1,difficulty:'E',pattern:'Hash Map'},{id:'p15',name:'49. Group Anagrams',leetcodeId:49,difficulty:'M',pattern:'Hash Map'}]},
          { dayNum:9, weekNum:2, dayName:'Tue', focus:'Prefix Sum — 1D Arrays', detail:'prefix[i] = sum of arr[0..i]. Subarray sum from l to r = prefix[r] - prefix[l-1].', isRest:false, xp:60,
            problems:[{id:'p16',name:'303. Range Sum Query',leetcodeId:303,difficulty:'E',pattern:'Prefix Sum'},{id:'p17',name:'523. Continuous Subarray Sum',leetcodeId:523,difficulty:'M',pattern:'Prefix Sum'}]},
          { dayNum:10, weekNum:2, dayName:'Wed', focus:'Prefix Sum + Hash Map Combo', detail:'Classic: "subarray sum = k". Store prefix sums seen so far. At each index, look up (current_sum - k).', isRest:false, xp:70,
            problems:[{id:'p18',name:'560. Subarray Sum Equals K',leetcodeId:560,difficulty:'M',pattern:'Prefix Sum + Hash Map'},{id:'p19',name:'930. Binary Subarrays Sum',leetcodeId:930,difficulty:'M',pattern:'Prefix Sum + Hash Map'}]},
          { dayNum:11, weekNum:2, dayName:'Thu', focus:"Kadane's Algorithm", detail:'Max subarray problem. Local max = max(arr[i], local_max + arr[i]). Understand the recurrence.', isRest:false, xp:70,
            problems:[{id:'p20',name:'53. Maximum Subarray',leetcodeId:53,difficulty:'M',pattern:"Kadane's"},{id:'p21',name:'152. Max Product Subarray',leetcodeId:152,difficulty:'M',pattern:"Kadane's"}]},
          { dayNum:12, weekNum:2, dayName:'Fri', focus:'2D Prefix Sums', detail:'prefix[i][j] = sum of rectangle from (0,0) to (i,j). Query any sub-rectangle in O(1).', isRest:false, xp:70,
            problems:[{id:'p22',name:'304. Range Sum Query 2D',leetcodeId:304,difficulty:'M',pattern:'2D Prefix Sum'},{id:'p23',name:'1314. Matrix Block Sum',leetcodeId:1314,difficulty:'M',pattern:'2D Prefix Sum'}]},
          { dayNum:13, weekNum:2, dayName:'Sat', focus:'Review + Harder Variants', detail:'Mix of this week\'s patterns. Identify the pattern before coding — that decision is the skill.', isRest:false, xp:100,
            problems:[{id:'p24',name:'238. Product of Array Except Self',leetcodeId:238,difficulty:'M',pattern:'Prefix Sum'},{id:'p25',name:'128. Longest Consecutive Seq',leetcodeId:128,difficulty:'M',pattern:'Hash Set'},{id:'p26',name:'76. Minimum Window Substr',leetcodeId:76,difficulty:'H',pattern:'Sliding Window'}]},
          { dayNum:14, weekNum:2, dayName:'Sun', focus:'Rest', detail:'Rest. Optionally read NeetCode explanations for problems you struggled with — reading only.', isRest:true, xp:0, problems:[]},
        ]
      },
      {
        num: 3, topic: 'Binary Search',
        sub: 'Not just for sorted arrays — binary search on the answer is a superpower.',
        tip: 'Two forms: (1) search in a sorted array, (2) search on the answer space. Form 2: "what\'s the minimum X such that condition(X) is true?" Always define your invariant before writing lo/hi.',
        days: [
          { dayNum:15, weekNum:3, dayName:'Mon', focus:'Classic Binary Search', detail:'lo=0, hi=n-1, mid=(lo+hi)/2. Three outcomes: found, go left, go right. Understand off-by-one errors.', isRest:false, xp:60,
            problems:[{id:'p27',name:'704. Binary Search',leetcodeId:704,difficulty:'E',pattern:'Binary Search'},{id:'p28',name:'35. Search Insert Position',leetcodeId:35,difficulty:'E',pattern:'Binary Search'}]},
          { dayNum:16, weekNum:3, dayName:'Tue', focus:'Binary Search — Boundaries', detail:'Find leftmost/rightmost occurrence. Template: lo=0, hi=n, converge to boundary.', isRest:false, xp:70,
            problems:[{id:'p29',name:'34. Find First & Last Position',leetcodeId:34,difficulty:'M',pattern:'Binary Search'},{id:'p30',name:'162. Find Peak Element',leetcodeId:162,difficulty:'M',pattern:'Binary Search'}]},
          { dayNum:17, weekNum:3, dayName:'Wed', focus:'Binary Search on Rotated Arrays', detail:'Key insight: one half is always sorted. Check which half, decide which side to go.', isRest:false, xp:70,
            problems:[{id:'p31',name:'153. Find Min in Rotated Array',leetcodeId:153,difficulty:'M',pattern:'Binary Search'},{id:'p32',name:'33. Search in Rotated Array',leetcodeId:33,difficulty:'M',pattern:'Binary Search'}]},
          { dayNum:18, weekNum:3, dayName:'Thu', focus:'Binary Search on Answer', detail:'Pattern: "minimize the maximum". Write a check(X) function, binary search on X.', isRest:false, xp:80,
            problems:[{id:'p33',name:'875. Koko Eating Bananas',leetcodeId:875,difficulty:'M',pattern:'Binary Search on Answer'},{id:'p34',name:'1011. Capacity To Ship Packages',leetcodeId:1011,difficulty:'M',pattern:'Binary Search on Answer'}]},
          { dayNum:19, weekNum:3, dayName:'Fri', focus:'Binary Search — 2D Matrix', detail:'2D matrix search where rows/cols are sorted. Combine binary search with matrix traversal.', isRest:false, xp:70,
            problems:[{id:'p35',name:'74. Search a 2D Matrix',leetcodeId:74,difficulty:'M',pattern:'Binary Search'},{id:'p36',name:'240. Search a 2D Matrix II',leetcodeId:240,difficulty:'M',pattern:'Binary Search'}]},
          { dayNum:20, weekNum:3, dayName:'Sat', focus:'Hard Variants', detail:'Time yourself: 20 min per medium, 35 min per hard. Write out what you know before continuing.', isRest:false, xp:120,
            problems:[{id:'p37',name:'4. Median of Two Sorted Arrays',leetcodeId:4,difficulty:'H',pattern:'Binary Search'},{id:'p38',name:'410. Split Array Largest Sum',leetcodeId:410,difficulty:'H',pattern:'Binary Search on Answer'}]},
          { dayNum:21, weekNum:3, dayName:'Sun', focus:'Rest', detail:'Rest day.', isRest:true, xp:0, problems:[]},
        ]
      },
      {
        num: 4, topic: 'Stacks, Queues & Linked Lists',
        sub: 'Monotonic stack is the most underrated pattern. Master it this week.',
        tip: 'Monotonic stack solves "next greater element", "largest rectangle", and "trapping rain water" in O(n). Maintain a stack always increasing (or decreasing). When a new element breaks the order, pop and process.',
        days: [
          { dayNum:22, weekNum:4, dayName:'Mon', focus:'Stack Fundamentals', detail:'LIFO. C++: use std::stack or vector as stack. Classic: matching brackets, valid expressions.', isRest:false, xp:60,
            problems:[{id:'p39',name:'20. Valid Parentheses',leetcodeId:20,difficulty:'E',pattern:'Stack'},{id:'p40',name:'155. Min Stack',leetcodeId:155,difficulty:'M',pattern:'Stack'}]},
          { dayNum:23, weekNum:4, dayName:'Tue', focus:'Monotonic Stack — Next Greater', detail:'For each element, find the next larger one. Pop everything smaller — they\'ve found their answer. O(n) total.', isRest:false, xp:70,
            problems:[{id:'p41',name:'496. Next Greater Element I',leetcodeId:496,difficulty:'E',pattern:'Monotonic Stack'},{id:'p42',name:'739. Daily Temperatures',leetcodeId:739,difficulty:'M',pattern:'Monotonic Stack'}]},
          { dayNum:24, weekNum:4, dayName:'Wed', focus:'Monotonic Stack — Harder', detail:'Largest rectangle in histogram is the canonical hard problem. Stock span problem.', isRest:false, xp:90,
            problems:[{id:'p43',name:'901. Online Stock Span',leetcodeId:901,difficulty:'M',pattern:'Monotonic Stack'},{id:'p44',name:'84. Largest Rectangle Histogram',leetcodeId:84,difficulty:'H',pattern:'Monotonic Stack'}]},
          { dayNum:25, weekNum:4, dayName:'Thu', focus:'Linked List Fundamentals', detail:'ListNode struct. Traversal, insert, delete. Always draw the pointers before coding.', isRest:false, xp:60,
            problems:[{id:'p45',name:'206. Reverse Linked List',leetcodeId:206,difficulty:'E',pattern:'Linked List'},{id:'p46',name:'21. Merge Two Sorted Lists',leetcodeId:21,difficulty:'E',pattern:'Linked List'}]},
          { dayNum:26, weekNum:4, dayName:'Fri', focus:'Slow/Fast Pointers on Lists', detail:'Fast moves 2x speed of slow. Meets at cycle entry (Floyd\'s). Finds middle.', isRest:false, xp:80,
            problems:[{id:'p47',name:'141. Linked List Cycle',leetcodeId:141,difficulty:'E',pattern:'Fast/Slow Pointer'},{id:'p48',name:'19. Remove Nth From End',leetcodeId:19,difficulty:'M',pattern:'Fast/Slow Pointer'},{id:'p49',name:'143. Reorder List',leetcodeId:143,difficulty:'M',pattern:'Linked List'}]},
          { dayNum:27, weekNum:4, dayName:'Sat', focus:'Review + LRU Cache', detail:'LRU Cache combines doubly linked list + hash map. Appears in Google/Meta interviews frequently.', isRest:false, xp:120,
            problems:[{id:'p50',name:'146. LRU Cache',leetcodeId:146,difficulty:'M',pattern:'Design'},{id:'p51',name:'23. Merge K Sorted Lists',leetcodeId:23,difficulty:'H',pattern:'Heap + Linked List'}]},
          { dayNum:28, weekNum:4, dayName:'Sun', focus:'Rest', detail:'Rest day.', isRest:true, xp:0, problems:[]},
        ]
      },
      {
        num: 5, topic: 'Trees — DFS & BFS',
        sub: 'Trees appear in ~30% of FAANG problems. This week builds the template you\'ll use forever.',
        tip: 'Almost every tree problem is a DFS that returns something. Ask: what does my recursive call return, and how do I combine left + right? Write the return type before writing the function body.',
        days: [
          { dayNum:29, weekNum:5, dayName:'Mon', focus:'Tree Traversals (Iterative)', detail:'Inorder, preorder, postorder. Implement all 3 iteratively using a stack.', isRest:false, xp:70,
            problems:[{id:'p52',name:'144. Binary Tree Preorder',leetcodeId:144,difficulty:'E',pattern:'Tree DFS'},{id:'p53',name:'94. Binary Tree Inorder',leetcodeId:94,difficulty:'E',pattern:'Tree DFS'},{id:'p54',name:'145. Binary Tree Postorder',leetcodeId:145,difficulty:'E',pattern:'Tree DFS'}]},
          { dayNum:30, weekNum:5, dayName:'Tue', focus:'Tree BFS (Level Order)', detail:'Use a queue. Process level by level. Classic: level order traversal, right side view, zigzag.', isRest:false, xp:70,
            problems:[{id:'p55',name:'102. Binary Tree Level Order',leetcodeId:102,difficulty:'M',pattern:'Tree BFS'},{id:'p56',name:'199. Binary Tree Right Side View',leetcodeId:199,difficulty:'M',pattern:'Tree BFS'}]},
          { dayNum:31, weekNum:5, dayName:'Wed', focus:'Tree DFS — Depth/Height', detail:'Height = 1 + max(left, right). Diameter = max path through a node. These build the DFS template.', isRest:false, xp:70,
            problems:[{id:'p57',name:'104. Max Depth of Binary Tree',leetcodeId:104,difficulty:'E',pattern:'Tree DFS'},{id:'p58',name:'110. Balanced Binary Tree',leetcodeId:110,difficulty:'E',pattern:'Tree DFS'},{id:'p59',name:'543. Diameter of Binary Tree',leetcodeId:543,difficulty:'E',pattern:'Tree DFS'}]},
          { dayNum:32, weekNum:5, dayName:'Thu', focus:'BST Properties', detail:'BST invariant: left < node < right. Validate BST using min/max bounds passed down recursively.', isRest:false, xp:70,
            problems:[{id:'p60',name:'700. Search in BST',leetcodeId:700,difficulty:'E',pattern:'BST'},{id:'p61',name:'98. Validate BST',leetcodeId:98,difficulty:'M',pattern:'BST'},{id:'p62',name:'230. Kth Smallest in BST',leetcodeId:230,difficulty:'M',pattern:'BST'}]},
          { dayNum:33, weekNum:5, dayName:'Fri', focus:'Lowest Common Ancestor', detail:'LCA is asked at every company. Two cases: BST (use bounds), general tree (DFS both sides).', isRest:false, xp:80,
            problems:[{id:'p63',name:'235. LCA of BST',leetcodeId:235,difficulty:'M',pattern:'BST'},{id:'p64',name:'236. LCA of Binary Tree',leetcodeId:236,difficulty:'M',pattern:'Tree DFS'}]},
          { dayNum:34, weekNum:5, dayName:'Sat', focus:'Harder Tree Problems', detail:'Path sum problems are classics. Max path sum requires tracking "what can I contribute to parent" vs "best within subtree".', isRest:false, xp:110,
            problems:[{id:'p65',name:'112. Path Sum',leetcodeId:112,difficulty:'E',pattern:'Tree DFS'},{id:'p66',name:'437. Path Sum III',leetcodeId:437,difficulty:'M',pattern:'Tree DFS + Prefix Sum'},{id:'p67',name:'124. Binary Tree Max Path Sum',leetcodeId:124,difficulty:'H',pattern:'Tree DFS'}]},
          { dayNum:35, weekNum:5, dayName:'Sun', focus:'Rest', detail:'Rest day.', isRest:true, xp:0, problems:[]},
        ]
      },
      {
        num: 6, topic: 'Tries & Heaps',
        sub: 'Trie = prefix tree. Heap = fast min/max. Both appear in ~15% of FAANG rounds.',
        tip: 'Implement a Trie from scratch before using it. For heaps in C++: priority_queue is a max-heap by default; use greater<int> for min-heap.',
        days: [
          { dayNum:36, weekNum:6, dayName:'Mon', focus:'Trie — Build From Scratch', detail:'TrieNode: array[26] of children + isEnd bool. Insert: traverse/create nodes. Search: traverse, check isEnd.', isRest:false, xp:80,
            problems:[{id:'p68',name:'208. Implement Trie',leetcodeId:208,difficulty:'M',pattern:'Trie'},{id:'p69',name:'211. Design Add/Search Words',leetcodeId:211,difficulty:'M',pattern:'Trie'}]},
          { dayNum:37, weekNum:6, dayName:'Tue', focus:'Trie — Applications', detail:'Word search on a board using Trie + DFS. Top-5 hardest medium problem.', isRest:false, xp:100,
            problems:[{id:'p70',name:'212. Word Search II',leetcodeId:212,difficulty:'H',pattern:'Trie + Backtracking'},{id:'p71',name:'1268. Search Suggestions System',leetcodeId:1268,difficulty:'M',pattern:'Trie'}]},
          { dayNum:38, weekNum:6, dayName:'Wed', focus:'Heaps — Fundamentals', detail:'Min/max heap. priority_queue in C++. O(log n) insert, O(1) peek. When to use: need repeated access to min/max.', isRest:false, xp:60,
            problems:[{id:'p72',name:'703. Kth Largest in Stream',leetcodeId:703,difficulty:'E',pattern:'Heap'},{id:'p73',name:'1046. Last Stone Weight',leetcodeId:1046,difficulty:'E',pattern:'Heap'}]},
          { dayNum:39, weekNum:6, dayName:'Thu', focus:'Heaps — K Problems', detail:'"Top K" and "Kth largest" are canonical heap problems. Use min-heap of size K: if new > heap top, pop and push.', isRest:false, xp:80,
            problems:[{id:'p74',name:'215. Kth Largest Element',leetcodeId:215,difficulty:'M',pattern:'Heap'},{id:'p75',name:'347. Top K Frequent Elements',leetcodeId:347,difficulty:'M',pattern:'Heap'},{id:'p76',name:'973. K Closest Points',leetcodeId:973,difficulty:'M',pattern:'Heap'}]},
          { dayNum:40, weekNum:6, dayName:'Fri', focus:'Two Heaps Pattern', detail:'Maintain max-heap for lower half, min-heap for upper half. Median is always at the tops.', isRest:false, xp:100,
            problems:[{id:'p77',name:'295. Find Median from Data Stream',leetcodeId:295,difficulty:'H',pattern:'Two Heaps'}]},
          { dayNum:41, weekNum:6, dayName:'Sat', focus:'Review + Harder Heap Problems', detail:'Merge K sorted lists with heap: push first node of each list, pop min, push next from that list.', isRest:false, xp:120,
            problems:[{id:'p78',name:'23. Merge K Sorted Lists (again)',leetcodeId:23,difficulty:'H',pattern:'Heap + Linked List'},{id:'p79',name:'358. Rearrange String K Distance',leetcodeId:358,difficulty:'H',pattern:'Heap + Greedy'}]},
          { dayNum:42, weekNum:6, dayName:'Sun', focus:'Rest', detail:'Rest day.', isRest:true, xp:0, problems:[]},
        ]
      },
      {
        num: 7, topic: 'Graphs — BFS, DFS & Union-Find',
        sub: 'Graphs are trees with cycles. Every technique you learned on trees applies here.',
        tip: 'Graph problems almost always require a visited set. Forgetting visited = infinite loop = TLE. Template: for every node, if not visited, call DFS/BFS. This handles disconnected graphs automatically.',
        days: [
          { dayNum:43, weekNum:7, dayName:'Mon', focus:'Graph Representation + DFS', detail:'Adjacency list (most common). DFS with visited set. Connected components count.', isRest:false, xp:70,
            problems:[{id:'p80',name:'200. Number of Islands',leetcodeId:200,difficulty:'M',pattern:'Graph DFS'},{id:'p81',name:'133. Clone Graph',leetcodeId:133,difficulty:'M',pattern:'Graph DFS/BFS'}]},
          { dayNum:44, weekNum:7, dayName:'Tue', focus:'Graph BFS', detail:'BFS = shortest path in unweighted graph. Queue + visited. Level tracks distance.', isRest:false, xp:80,
            problems:[{id:'p82',name:'994. Rotting Oranges',leetcodeId:994,difficulty:'M',pattern:'Multi-source BFS'},{id:'p83',name:'127. Word Ladder',leetcodeId:127,difficulty:'H',pattern:'BFS'}]},
          { dayNum:45, weekNum:7, dayName:'Wed', focus:'Cycle Detection + Topological Sort', detail:'Topo sort = linearize a DAG. BFS approach (Kahn\'s): in-degree array. DFS approach: use state.', isRest:false, xp:80,
            problems:[{id:'p84',name:'207. Course Schedule',leetcodeId:207,difficulty:'M',pattern:'Topological Sort'},{id:'p85',name:'210. Course Schedule II',leetcodeId:210,difficulty:'M',pattern:'Topological Sort'}]},
          { dayNum:46, weekNum:7, dayName:'Thu', focus:'Union-Find (DSU)', detail:'DSU with path compression + union by rank. O(α) per operation. Use for dynamic connectivity.', isRest:false, xp:80,
            problems:[{id:'p86',name:'323. Number of Connected Components',leetcodeId:323,difficulty:'M',pattern:'Union-Find'},{id:'p87',name:'684. Redundant Connection',leetcodeId:684,difficulty:'M',pattern:'Union-Find'}]},
          { dayNum:47, weekNum:7, dayName:'Fri', focus:"Dijkstra's Algorithm", detail:'Weighted shortest path. Min-heap + dist array. Update dist[neighbor] if shorter path found.', isRest:false, xp:90,
            problems:[{id:'p88',name:'743. Network Delay Time',leetcodeId:743,difficulty:'M',pattern:"Dijkstra's"},{id:'p89',name:'1514. Path with Max Probability',leetcodeId:1514,difficulty:'M',pattern:"Dijkstra's"}]},
          { dayNum:48, weekNum:7, dayName:'Sat', focus:'Harder Graph Problems', detail:'Pacific Atlantic tests multi-source BFS simultaneously. Alien dictionary tests topo sort.', isRest:false, xp:110,
            problems:[{id:'p90',name:'417. Pacific Atlantic Water Flow',leetcodeId:417,difficulty:'M',pattern:'Multi-source DFS/BFS'},{id:'p91',name:'269. Alien Dictionary',leetcodeId:269,difficulty:'H',pattern:'Topological Sort'}]},
          { dayNum:49, weekNum:7, dayName:'Sun', focus:'Rest', detail:'Rest day.', isRest:true, xp:0, problems:[]},
        ]
      },
      {
        num: 8, topic: 'Backtracking & Consolidation',
        sub: 'Backtracking is "DFS with undo". Master the template and you can generate any combination or permutation.',
        tip: 'Backtracking template: make a choice → recurse → undo the choice. The undo step is what people forget. In C++: push to path, call recursion, pop from path. Every combination/permutation/subset problem uses this skeleton.',
        days: [
          { dayNum:50, weekNum:8, dayName:'Mon', focus:'Recursion Fundamentals', detail:'Base case → recursive case. What is the simplest version? What does my function return?', isRest:false, xp:60,
            problems:[{id:'p92',name:'21. Merge Two Sorted Lists',leetcodeId:21,difficulty:'E',pattern:'Recursion'},{id:'p93',name:'50. Pow(x, n)',leetcodeId:50,difficulty:'M',pattern:'Recursion'}]},
          { dayNum:51, weekNum:8, dayName:'Tue', focus:'Backtracking — Subsets & Combinations', detail:'Subsets: at each index, include or exclude. Combinations: pick r items from n.', isRest:false, xp:80,
            problems:[{id:'p94',name:'78. Subsets',leetcodeId:78,difficulty:'M',pattern:'Backtracking'},{id:'p95',name:'77. Combinations',leetcodeId:77,difficulty:'M',pattern:'Backtracking'},{id:'p96',name:'39. Combination Sum',leetcodeId:39,difficulty:'M',pattern:'Backtracking'}]},
          { dayNum:52, weekNum:8, dayName:'Wed', focus:'Backtracking — Permutations', detail:'All orderings. Template: at each position, try each unused element. Use a used[] array.', isRest:false, xp:80,
            problems:[{id:'p97',name:'46. Permutations',leetcodeId:46,difficulty:'M',pattern:'Backtracking'},{id:'p98',name:'47. Permutations II (duplicates)',leetcodeId:47,difficulty:'M',pattern:'Backtracking'}]},
          { dayNum:53, weekNum:8, dayName:'Thu', focus:'Backtracking — Hard Classics', detail:'N-Queens and Sudoku Solver are the two canonical hard backtracking problems.', isRest:false, xp:120,
            problems:[{id:'p99',name:'79. Word Search',leetcodeId:79,difficulty:'M',pattern:'Backtracking + DFS'},{id:'p100',name:'51. N-Queens',leetcodeId:51,difficulty:'H',pattern:'Backtracking'},{id:'p101',name:'37. Sudoku Solver',leetcodeId:37,difficulty:'H',pattern:'Backtracking'}]},
          { dayNum:54, weekNum:8, dayName:'Fri', focus:'Consolidation — Weakest Patterns', detail:'Review all 8 weeks. Pick your 3 weakest topics. Re-solve 1 problem per topic from scratch.', isRest:false, xp:80,
            problems:[{id:'p102',name:'(Re-solve your 3 hardest problems)',leetcodeId:0,difficulty:'M',pattern:'Review'},{id:'p103',name:'(Timed: 20 min each)',leetcodeId:0,difficulty:'M',pattern:'Review'}]},
          { dayNum:55, weekNum:8, dayName:'Sat', focus:'Phase 1 Mock Assessment', detail:'Timed: 90 minutes, 3 medium problems. Simulate real conditions: no hints, no discussion. Then debrief.', isRest:false, xp:200,
            problems:[{id:'p104',name:'(3 random mediums — timed 90 min)',leetcodeId:0,difficulty:'M',pattern:'Mock'},{id:'p105',name:'Debrief: what froze you?',leetcodeId:0,difficulty:'E',pattern:'Mock'}]},
          { dayNum:56, weekNum:8, dayName:'Sun', focus:'Rest + Phase 2 Preview', detail:'Rest. Skim Phase 2 overview: DP patterns coming up. Write down 3 personal weak spots from Phase 1.', isRest:true, xp:0, problems:[]},
        ]
      },
    ]
  }
];

export function getAllDays(): Day[] {
  return PHASES.flatMap(p => p.weeks.flatMap(w => w.days));
}

export function getTotalProblems(): number {
  return getAllDays().reduce((acc, d) => acc + d.problems.filter(p => p.leetcodeId > 0).length, 0);
}

export function getTotalXP(): number {
  return getAllDays().reduce((acc, d) => acc + d.xp, 0);
}
