'use client';
import { useState } from 'react';

const PATTERNS = [
  {
    name: 'Two Pointers', category: 'Array', week: 1, complexity: 'O(n)', space: 'O(1)',
    when: 'Sorted array, find pair, palindrome check, partition.',
    template: `// Converging two pointers
int left = 0, right = n - 1;
while (left < right) {
    if (condition) return result;
    else if (tooSmall) left++;
    else right--;
}`,
    problems: ['167. Two Sum II', '15. 3Sum', '11. Container With Most Water', '125. Valid Palindrome'],
    color: 'var(--accent)',
  },
  {
    name: 'Sliding Window', category: 'Array', week: 1, complexity: 'O(n)', space: 'O(k)',
    when: 'Subarray/substring with condition, fixed or variable window.',
    template: `// Variable sliding window
int left = 0; int result = 0;
unordered_map<char,int> freq;
for (int right = 0; right < n; right++) {
    freq[s[right]]++;
    while (invalid condition) {
        freq[s[left]]--;
        left++;
    }
    result = max(result, right - left + 1);
}`,
    problems: ['3. Longest Substr No Repeat', '424. Longest Repeating Char Replace', '76. Minimum Window Substr'],
    color: 'var(--blue)',
  },
  {
    name: 'Prefix Sum', category: 'Array', week: 2, complexity: 'O(n)', space: 'O(n)',
    when: 'Range sum queries, subarray sum equals k, 2D rectangle sums.',
    template: `// 1D prefix sum
vector<int> prefix(n+1, 0);
for (int i = 0; i < n; i++)
    prefix[i+1] = prefix[i] + arr[i];
// sum from l to r (0-indexed):
int rangeSum = prefix[r+1] - prefix[l];

// Subarray sum = k
unordered_map<int,int> seen{{0,1}};
int sum = 0, count = 0;
for (int x : arr) {
    sum += x;
    count += seen[sum - k];
    seen[sum]++;
}`,
    problems: ['303. Range Sum Query', '560. Subarray Sum Equals K', '238. Product Except Self'],
    color: 'var(--green)',
  },
  {
    name: 'Binary Search', category: 'Search', week: 3, complexity: 'O(log n)', space: 'O(1)',
    when: 'Sorted array, monotonic function, "minimize the maximum" problems.',
    template: `// Classic
int lo = 0, hi = n - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (arr[mid] == target) return mid;
    else if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
}

// Binary search on answer
bool check(int mid) { /* can we do it? */ }
int lo = min_val, hi = max_val;
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (check(mid)) hi = mid;
    else lo = mid + 1;
}`,
    problems: ['704. Binary Search', '33. Search in Rotated Array', '875. Koko Eating Bananas', '410. Split Array'],
    color: 'var(--amber)',
  },
  {
    name: 'Monotonic Stack', category: 'Stack', week: 4, complexity: 'O(n)', space: 'O(n)',
    when: 'Next greater/smaller element, largest rectangle, temperatures.',
    template: `// Next greater element (increasing stack)
stack<int> st; // stores indices
vector<int> res(n, -1);
for (int i = 0; i < n; i++) {
    while (!st.empty() && arr[st.top()] < arr[i]) {
        res[st.top()] = arr[i];
        st.pop();
    }
    st.push(i);
}`,
    problems: ['739. Daily Temperatures', '84. Largest Rectangle Histogram', '901. Online Stock Span'],
    color: 'var(--red)',
  },
  {
    name: 'Tree DFS', category: 'Tree', week: 5, complexity: 'O(n)', space: 'O(h)',
    when: 'Any recursive tree problem: height, path sum, validate, LCA.',
    template: `// DFS template — returns something
int dfs(TreeNode* node) {
    if (!node) return base_case;
    int left = dfs(node->left);
    int right = dfs(node->right);
    // combine left + right with current node
    return combine(left, right, node->val);
}`,
    problems: ['543. Diameter', '124. Max Path Sum', '98. Validate BST', '236. LCA'],
    color: 'var(--accent2)',
  },
  {
    name: 'Tree BFS', category: 'Tree', week: 5, complexity: 'O(n)', space: 'O(n)',
    when: 'Level order traversal, shortest path in tree, right side view.',
    template: `// Level order BFS
queue<TreeNode*> q;
q.push(root);
while (!q.empty()) {
    int sz = q.size(); // process one level
    for (int i = 0; i < sz; i++) {
        auto node = q.front(); q.pop();
        // process node
        if (node->left) q.push(node->left);
        if (node->right) q.push(node->right);
    }
}`,
    problems: ['102. Level Order Traversal', '199. Right Side View'],
    color: 'var(--green)',
  },
  {
    name: 'Trie', category: 'Tree', week: 6, complexity: 'O(m) per op', space: 'O(n·m)',
    when: 'Prefix search, word dictionary, autocomplete, word search on board.',
    template: `struct TrieNode {
    TrieNode* children[26] = {};
    bool isEnd = false;
};
struct Trie {
    TrieNode* root = new TrieNode();
    void insert(string word) {
        auto node = root;
        for (char c : word) {
            if (!node->children[c-'a'])
                node->children[c-'a'] = new TrieNode();
            node = node->children[c-'a'];
        }
        node->isEnd = true;
    }
    bool search(string word) {
        auto node = root;
        for (char c : word) {
            if (!node->children[c-'a']) return false;
            node = node->children[c-'a'];
        }
        return node->isEnd;
    }
};`,
    problems: ['208. Implement Trie', '211. Design Add/Search', '212. Word Search II'],
    color: 'var(--blue)',
  },
  {
    name: 'Heap / Priority Queue', category: 'Heap', week: 6, complexity: 'O(n log k)', space: 'O(k)',
    when: 'Top K elements, K closest, running median, merge K sorted.',
    template: `// Min heap (default max in C++)
priority_queue<int, vector<int>, greater<int>> minHeap;

// Top K largest — maintain min heap of size K
for (int x : nums) {
    minHeap.push(x);
    if ((int)minHeap.size() > k)
        minHeap.pop(); // removes smallest
}
// heap now contains K largest`,
    problems: ['215. Kth Largest', '347. Top K Frequent', '295. Find Median', '23. Merge K Lists'],
    color: 'var(--amber)',
  },
  {
    name: 'Graph DFS/BFS', category: 'Graph', week: 7, complexity: 'O(V+E)', space: 'O(V)',
    when: 'Connected components, shortest path, cycle detection, reachability.',
    template: `// DFS with visited set
unordered_set<int> visited;
void dfs(int node, vector<vector<int>>& adj) {
    visited.insert(node);
    for (int nb : adj[node]) {
        if (!visited.count(nb))
            dfs(nb, adj);
    }
}

// BFS shortest path
queue<int> q; visited.insert(start); q.push(start);
int dist = 0;
while (!q.empty()) {
    int sz = q.size();
    while (sz--) {
        int node = q.front(); q.pop();
        if (node == target) return dist;
        for (int nb : adj[node])
            if (!visited.count(nb)) { visited.insert(nb); q.push(nb); }
    }
    dist++;
}`,
    problems: ['200. Number of Islands', '994. Rotting Oranges', '127. Word Ladder'],
    color: 'var(--accent)',
  },
  {
    name: 'Union-Find (DSU)', category: 'Graph', week: 7, complexity: 'O(α(n))', space: 'O(n)',
    when: 'Dynamic connectivity, detecting cycles, grouping components.',
    template: `struct DSU {
    vector<int> parent, rank;
    DSU(int n) : parent(n), rank(n,0) {
        iota(parent.begin(), parent.end(), 0);
    }
    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]); // path compress
        return parent[x];
    }
    bool unite(int x, int y) {
        x = find(x); y = find(y);
        if (x == y) return false;
        if (rank[x] < rank[y]) swap(x,y);
        parent[y] = x;
        if (rank[x] == rank[y]) rank[x]++;
        return true;
    }
};`,
    problems: ['323. Connected Components', '684. Redundant Connection'],
    color: 'var(--green)',
  },
  {
    name: 'Backtracking', category: 'Recursion', week: 8, complexity: 'O(n!)', space: 'O(n)',
    when: 'All combinations, permutations, subsets, constraint satisfaction.',
    template: `// Backtracking template
vector<vector<int>> result;
void backtrack(vector<int>& path, int start, /*constraints*/) {
    if (base_condition) {
        result.push_back(path);
        return;
    }
    for (int i = start; i < n; i++) {
        if (skip_condition) continue;
        path.push_back(nums[i]);     // choose
        backtrack(path, i+1, ...);   // explore
        path.pop_back();             // unchoose (CRITICAL)
    }
}`,
    problems: ['78. Subsets', '46. Permutations', '39. Combination Sum', '51. N-Queens'],
    color: 'var(--red)',
  },
];

export default function Patterns() {
  const [selected, setSelected] = useState<typeof PATTERNS[0] | null>(null);
  const [catFilter, setCatFilter] = useState('all');
  const cats = ['all', ...Array.from(new Set(PATTERNS.map(p => p.category)))];

  const filtered = catFilter === 'all' ? PATTERNS : PATTERNS.filter(p => p.category === catFilter);

  return (
    <div style={{ padding: 32, maxWidth: 1100, margin: '0 auto' }} className="animate-fadeIn">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, marginBottom: 6 }}>Pattern Library</h1>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>12 core patterns with C++ templates. Click any pattern for full detail.</p>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {cats.map(c => (
          <button key={c} onClick={() => setCatFilter(c)} style={{
            padding: '6px 14px', borderRadius: 20, border: `1px solid ${catFilter === c ? 'var(--accent)' : 'var(--border)'}`,
            background: catFilter === c ? 'var(--accent-dim)' : 'var(--bg2)', color: catFilter === c ? 'var(--accent2)' : 'var(--text2)',
            fontSize: 12, fontFamily: 'var(--font-mono)', textTransform: 'capitalize',
          }}>{c}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : 'repeat(3,1fr)', gap: 16 }}>
        {/* Card grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, gridColumn: selected ? '1' : undefined }}>
          {filtered.map(p => (
            <button key={p.name} onClick={() => setSelected(selected?.name === p.name ? null : p)}
              style={{
                textAlign: 'left', background: selected?.name === p.name ? 'var(--bg3)' : 'var(--bg2)',
                border: `1px solid ${selected?.name === p.name ? p.color : 'var(--border)'}`,
                borderRadius: 12, padding: '14px 18px', cursor: 'pointer', transition: 'all 0.15s',
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-display)', color: p.color }}>{p.name}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 10, background: 'var(--bg3)', color: 'var(--text3)', border: '1px solid var(--border)' }}>W{p.week}</span>
                  <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 10, background: 'var(--bg3)', color: 'var(--text3)', border: '1px solid var(--border)' }}>{p.category}</span>
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8 }}>{p.when}</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 10, color: 'var(--accent2)' }}>Time: {p.complexity}</span>
                <span style={{ fontSize: 10, color: 'var(--text3)' }}>Space: {p.space}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ background: 'var(--bg2)', border: `1px solid ${selected.color}`, borderRadius: 12, padding: '20px', position: 'sticky', top: 20, height: 'fit-content', maxHeight: '90vh', overflowY: 'auto' }} className="animate-fadeIn">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 20, color: selected.color, marginBottom: 4 }}>{selected.name}</h2>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>Week {selected.week} · {selected.category}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'var(--bg3)', border: 'none', color: 'var(--text3)', borderRadius: 6, padding: '4px 10px', fontSize: 13 }}>✕</button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>When to use</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', padding: '10px 12px', background: 'var(--bg3)', borderRadius: 8, borderLeft: `3px solid ${selected.color}` }}>{selected.when}</div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>C++ Template</div>
              <pre style={{ fontSize: 11, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '14px', overflowX: 'auto', lineHeight: 1.7, color: 'var(--text2)', fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap' }}>{selected.template}</pre>
            </div>

            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Key problems</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {selected.problems.map(prob => (
                  <a key={prob}
                    href={`https://leetcode.com/problems/${prob.toLowerCase().replace(/\d+\.\s*/,'').replace(/[^a-z0-9]+/g,'-').replace(/-$/,'')}/`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg3)', borderRadius: 8, fontSize: 12, color: 'var(--text)', border: '1px solid var(--border)', transition: 'border-color 0.15s' }}>
                    {prob}
                    <span style={{ fontSize: 10, color: 'var(--text3)' }}>↗</span>
                  </a>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, marginTop: 16, padding: '10px 0', borderTop: '1px solid var(--border)' }}>
              <div><span style={{ fontSize: 11, color: 'var(--text3)' }}>Time: </span><span style={{ fontSize: 12, color: 'var(--accent2)' }}>{selected.complexity}</span></div>
              <div><span style={{ fontSize: 11, color: 'var(--text3)' }}>Space: </span><span style={{ fontSize: 12, color: 'var(--accent2)' }}>{selected.space}</span></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
