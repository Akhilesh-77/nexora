import express from 'express';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { authenticateOptional, AuthRequest } from '../middleware/auth';
import { UserProgress } from '../models/UserProgress';

const router = express.Router();

interface TestCase {
  input: any[];
  expected: any;
  inputDescription: string;
}

interface ProblemDefinition {
  fnName: string;
  isLinkedList?: boolean;
  isTree?: boolean;
  normalizeResult?: (actual: any, expected: any) => boolean;
  sampleCases: TestCase[];
  allCases: TestCase[];
}

const PROBLEMS_DATA: Record<string, ProblemDefinition> = {
  'code-1': {
    fnName: 'twoSum',
    normalizeResult: (a: any, e: any) => {
      if (!Array.isArray(a) || !Array.isArray(e)) return false;
      if (a.length !== e.length) return false;
      const sortedA = [...a].sort((x, y) => x - y);
      const sortedE = [...e].sort((x, y) => x - y);
      return sortedA[0] === sortedE[0] && sortedA[1] === sortedE[1];
    },
    sampleCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1], inputDescription: 'nums = [2, 7, 11, 15], target = 9' },
      { input: [[3, 2, 4], 6], expected: [1, 2], inputDescription: 'nums = [3, 2, 4], target = 6' },
    ],
    allCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1], inputDescription: 'nums = [2, 7, 11, 15], target = 9' },
      { input: [[3, 2, 4], 6], expected: [1, 2], inputDescription: 'nums = [3, 2, 4], target = 6' },
      { input: [[3, 3], 6], expected: [0, 1], inputDescription: 'nums = [3, 3], target = 6' },
      { input: [[1, 5, 8, 3], 11], expected: [2, 3], inputDescription: 'nums = [1, 5, 8, 3], target = 11' },
      { input: [[10, -2, 5, 1], 3], expected: [1, 2], inputDescription: 'nums = [10, -2, 5, 1], target = 3' },
    ],
  },
  'code-2': {
    fnName: 'isValid',
    sampleCases: [
      { input: ['()'], expected: true, inputDescription: 's = "()"' },
      { input: ['()[]{}'], expected: true, inputDescription: 's = "()[]{}"' },
      { input: ['(]'], expected: false, inputDescription: 's = "(]"' },
    ],
    allCases: [
      { input: ['()'], expected: true, inputDescription: 's = "()"' },
      { input: ['()[]{}'], expected: true, inputDescription: 's = "()[]{}"' },
      { input: ['(]'], expected: false, inputDescription: 's = "(]"' },
      { input: ['([)]'], expected: false, inputDescription: 's = "([)]"' },
      { input: ['{[]}'], expected: true, inputDescription: 's = "{[]}"' },
      { input: ['((('], expected: false, inputDescription: 's = "((("' },
      { input: [''], expected: true, inputDescription: 's = ""' },
    ],
  },
  'code-3': {
    fnName: 'reverseList',
    isLinkedList: true,
    sampleCases: [
      { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1], inputDescription: 'head = [1, 2, 3, 4, 5]' },
      { input: [[1, 2]], expected: [2, 1], inputDescription: 'head = [1, 2]' },
    ],
    allCases: [
      { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1], inputDescription: 'head = [1, 2, 3, 4, 5]' },
      { input: [[1, 2]], expected: [2, 1], inputDescription: 'head = [1, 2]' },
      { input: [[]], expected: [], inputDescription: 'head = []' },
      { input: [[7]], expected: [7], inputDescription: 'head = [7]' },
    ],
  },
  'code-4': {
    fnName: 'maxProfit',
    sampleCases: [
      { input: [[7, 1, 5, 3, 6, 4]], expected: 5, inputDescription: 'prices = [7, 1, 5, 3, 6, 4]' },
      { input: [[7, 6, 4, 3, 1]], expected: 0, inputDescription: 'prices = [7, 6, 4, 3, 1]' },
    ],
    allCases: [
      { input: [[7, 1, 5, 3, 6, 4]], expected: 5, inputDescription: 'prices = [7, 1, 5, 3, 6, 4]' },
      { input: [[7, 6, 4, 3, 1]], expected: 0, inputDescription: 'prices = [7, 6, 4, 3, 1]' },
      { input: [[2, 4, 1]], expected: 2, inputDescription: 'prices = [2, 4, 1]' },
      { input: [[1, 2]], expected: 1, inputDescription: 'prices = [1, 2]' },
      { input: [[3, 3, 3]], expected: 0, inputDescription: 'prices = [3, 3, 3]' },
    ],
  },
  'code-5': {
    fnName: 'lengthOfLongestSubstring',
    sampleCases: [
      { input: ['abcabcbb'], expected: 3, inputDescription: 's = "abcabcbb"' },
      { input: ['bbbbb'], expected: 1, inputDescription: 's = "bbbbb"' },
      { input: ['pwwkew'], expected: 3, inputDescription: 's = "pwwkew"' },
    ],
    allCases: [
      { input: ['abcabcbb'], expected: 3, inputDescription: 's = "abcabcbb"' },
      { input: ['bbbbb'], expected: 1, inputDescription: 's = "bbbbb"' },
      { input: ['pwwkew'], expected: 3, inputDescription: 's = "pwwkew"' },
      { input: [''], expected: 0, inputDescription: 's = ""' },
      { input: [' '], expected: 1, inputDescription: 's = " "' },
      { input: ['dvdf'], expected: 3, inputDescription: 's = "dvdf"' },
    ],
  },
  'code-6': {
    fnName: 'mergeTwoLists',
    isLinkedList: true,
    sampleCases: [
      { input: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4], inputDescription: 'list1 = [1,2,4], list2 = [1,3,4]' },
      { input: [[], []], expected: [], inputDescription: 'list1 = [], list2 = []' },
    ],
    allCases: [
      { input: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4], inputDescription: 'list1 = [1,2,4], list2 = [1,3,4]' },
      { input: [[], []], expected: [], inputDescription: 'list1 = [], list2 = []' },
      { input: [[], [0]], expected: [0], inputDescription: 'list1 = [], list2 = [0]' },
      { input: [[5], [1, 2, 4]], expected: [1, 2, 4, 5], inputDescription: 'list1 = [5], list2 = [1, 2, 4]' },
    ],
  },
  'code-7': {
    fnName: 'maxSubArray',
    sampleCases: [
      { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6, inputDescription: 'nums = [-2,1,-3,4,-1,2,1,-5,4]' },
      { input: [[1]], expected: 1, inputDescription: 'nums = [1]' },
      { input: [[5, 4, -1, 7, 8]], expected: 23, inputDescription: 'nums = [5,4,-1,7,8]' },
    ],
    allCases: [
      { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6, inputDescription: 'nums = [-2,1,-3,4,-1,2,1,-5,4]' },
      { input: [[1]], expected: 1, inputDescription: 'nums = [1]' },
      { input: [[5, 4, -1, 7, 8]], expected: 23, inputDescription: 'nums = [5,4,-1,7,8]' },
      { input: [[-1]], expected: -1, inputDescription: 'nums = [-1]' },
      { input: [[-2, -1]], expected: -1, inputDescription: 'nums = [-2, -1]' },
    ],
  },
  'code-8': {
    fnName: 'invertTree',
    isTree: true,
    sampleCases: [
      { input: [[4, 2, 7, 1, 3, 6, 9]], expected: [4, 7, 2, 9, 6, 3, 1], inputDescription: 'root = [4,2,7,1,3,6,9]' },
      { input: [[2, 1, 3]], expected: [2, 3, 1], inputDescription: 'root = [2,1,3]' },
    ],
    allCases: [
      { input: [[4, 2, 7, 1, 3, 6, 9]], expected: [4, 7, 2, 9, 6, 3, 1], inputDescription: 'root = [4,2,7,1,3,6,9]' },
      { input: [[2, 1, 3]], expected: [2, 3, 1], inputDescription: 'root = [2,1,3]' },
      { input: [[]], expected: [], inputDescription: 'root = []' },
    ],
  },
  'code-9': {
    fnName: 'coinChange',
    sampleCases: [
      { input: [[1, 2, 5], 11], expected: 3, inputDescription: 'coins = [1, 2, 5], amount = 11' },
      { input: [[2], 3], expected: -1, inputDescription: 'coins = [2], amount = 3' },
      { input: [[1], 0], expected: 0, inputDescription: 'coins = [1], amount = 0' },
    ],
    allCases: [
      { input: [[1, 2, 5], 11], expected: 3, inputDescription: 'coins = [1, 2, 5], amount = 11' },
      { input: [[2], 3], expected: -1, inputDescription: 'coins = [2], amount = 3' },
      { input: [[1], 0], expected: 0, inputDescription: 'coins = [1], amount = 0' },
      { input: [[1], 2], expected: 2, inputDescription: 'coins = [1], amount = 2' },
      { input: [[2, 5, 10, 1], 27], expected: 4, inputDescription: 'coins = [2, 5, 10, 1], amount = 27' },
    ],
  },
  'code-10': {
    fnName: 'search',
    sampleCases: [
      { input: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4, inputDescription: 'nums = [4,5,6,7,0,1,2], target = 0' },
      { input: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1, inputDescription: 'nums = [4,5,6,7,0,1,2], target = 3' },
    ],
    allCases: [
      { input: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4, inputDescription: 'nums = [4,5,6,7,0,1,2], target = 0' },
      { input: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1, inputDescription: 'nums = [4,5,6,7,0,1,2], target = 3' },
      { input: [[1], 0], expected: -1, inputDescription: 'nums = [1], target = 0' },
      { input: [[5, 1, 3], 5], expected: 0, inputDescription: 'nums = [5,1,3], target = 5' },
      { input: [[1, 3], 3], expected: 1, inputDescription: 'nums = [1,3], target = 3' },
    ],
  },
};

/**
 * Builds executable harness script for Python
 */
function buildPythonHarness(userCode: string, problem: ProblemDefinition, cases: TestCase[]): string {
  const jsonCases = JSON.stringify(cases);

  return `
import sys, json, time

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def list_to_nodes(arr):
    if not arr: return None
    head = ListNode(arr[0])
    curr = head
    for v in arr[1:]:
        curr.next = ListNode(v)
        curr = curr.next
    return head

def nodes_to_list(head):
    res = []
    curr = head
    limit = 1000
    while curr and limit > 0:
        res.append(curr.val)
        curr = curr.next
        limit -= 1
    return res

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def array_to_tree(arr):
    if not arr: return None
    nodes = [None if v is None else TreeNode(v) for v in arr]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root

def tree_to_array(root):
    if not root: return []
    res = []
    q = [root]
    while q:
        curr = q.pop(0)
        if curr:
            res.append(curr.val)
            q.append(curr.left)
            q.append(curr.right)
        else:
            res.append(None)
    while res and res[-1] is None:
        res.pop()
    return res

# --- Student Code Start ---
${userCode}
# --- Student Code End ---

cases = json.loads('''${jsonCases}''')
fn = globals().get('${problem.fnName}')

if not fn:
    print("__RESULT_START__" + json.dumps({
        "status": "Compilation Error",
        "error": "Function '${problem.fnName}' is not defined. Ensure you defined '${problem.fnName}' with the exact expected name."
    }) + "__RESULT_END__")
    sys.exit(0)

results = []
passed_count = 0
total_time = 0

for i, c in enumerate(cases):
    args = c["input"]
    expected = c["expected"]
    desc = c["inputDescription"]
    
    # Pre-process linked list or tree args if needed
    call_args = []
    for arg in args:
        ${
          problem.isLinkedList
            ? `if isinstance(arg, list): call_args.append(list_to_nodes(arg))\n        else: call_args.append(arg)`
            : problem.isTree
            ? `if isinstance(arg, list): call_args.append(array_to_tree(arg))\n        else: call_args.append(arg)`
            : `call_args.append(arg)`
        }
    
    t0 = time.time()
    try:
        raw_result = fn(*call_args)
        t_elapsed = (time.time() - t0) * 1000
        total_time += t_elapsed

        # Convert back
        ${
          problem.isLinkedList
            ? `actual = nodes_to_list(raw_result)`
            : problem.isTree
            ? `actual = tree_to_array(raw_result)`
            : `actual = raw_result`
        }

        # Normalize comparison
        is_pass = False
        ${
          problem.fnName === 'twoSum'
            ? `if isinstance(actual, (list, tuple)) and isinstance(expected, list) and len(actual) == len(expected):
            is_pass = sorted(list(actual)) == sorted(expected)
        else:
            is_pass = (actual == expected)`
            : `is_pass = (actual == expected)`
        }

        if is_pass:
            passed_count += 1
            results.append({"case": i + 1, "passed": True, "input": desc, "expected": expected, "actual": actual})
        else:
            results.append({"case": i + 1, "passed": False, "input": desc, "expected": expected, "actual": actual})
            # Stop at first failure
            print("__RESULT_START__" + json.dumps({
                "status": "Wrong Answer",
                "passedCount": passed_count,
                "totalCount": len(cases),
                "runtimeMs": round(total_time, 2),
                "failedCase": i + 1,
                "input": desc,
                "expected": str(expected),
                "actual": str(actual),
                "details": f"Test Case {i + 1} Failed:\\nInput: {desc}\\nExpected: {expected}\\nGot: {actual}"
            }) + "__RESULT_END__")
            sys.exit(0)

    except Exception as e:
        print("__RESULT_START__" + json.dumps({
            "status": "Runtime Error",
            "passedCount": passed_count,
            "totalCount": len(cases),
            "failedCase": i + 1,
            "input": desc,
            "error": str(e),
            "details": f"Runtime Exception on Test Case {i + 1}:\\n{str(e)}"
        }) + "__RESULT_END__")
        sys.exit(0)

print("__RESULT_START__" + json.dumps({
    "status": "Accepted",
    "passedCount": passed_count,
    "totalCount": len(cases),
    "runtimeMs": round(max(total_time, 8), 2),
    "results": results
}) + "__RESULT_END__")
`;
}

/**
 * Builds executable harness script for JavaScript
 */
function buildJsHarness(userCode: string, problem: ProblemDefinition, cases: TestCase[]): string {
  const jsonCases = JSON.stringify(cases);

  return `
function ListNode(val, next) {
    this.val = (val===undefined ? 0 : val);
    this.next = (next===undefined ? null : next);
}

function listToNodes(arr) {
    if (!arr || !arr.length) return null;
    const head = new ListNode(arr[0]);
    let curr = head;
    for (let i = 1; i < arr.length; i++) {
        curr.next = new ListNode(arr[i]);
        curr = curr.next;
    }
    return head;
}

function nodesToList(head) {
    const res = [];
    let curr = head;
    let limit = 1000;
    while (curr && limit > 0) {
        res.push(curr.val);
        curr = curr.next;
        limit--;
    }
    return res;
}

function TreeNode(val, left, right) {
    this.val = (val===undefined ? 0 : val);
    this.left = (left===undefined ? null : left);
    this.right = (right===undefined ? null : right);
}

function arrayToTree(arr) {
    if (!arr || !arr.length) return null;
    const nodes = arr.map(v => v === null ? null : new TreeNode(v));
    const kids = [...nodes].reverse();
    const root = kids.pop();
    for (const node of nodes) {
        if (node) {
            if (kids.length) node.left = kids.pop();
            if (kids.length) node.right = kids.pop();
        }
    }
    return root;
}

function treeToArray(root) {
    if (!root) return [];
    const res = [];
    const q = [root];
    while (q.length) {
        const curr = q.shift();
        if (curr) {
            res.push(curr.val);
            q.push(curr.left);
            q.push(curr.right);
        } else {
            res.push(null);
        }
    }
    while (res.length && res[res.length - 1] === null) {
        res.pop();
    }
    return res;
}

// --- Student Code Start ---
${userCode}
// --- Student Code End ---

const cases = ${jsonCases};
let fn = null;
try {
    fn = eval('${problem.fnName}');
} catch (e) {
    console.log("__RESULT_START__" + JSON.stringify({
        status: "Compilation Error",
        error: "Function '${problem.fnName}' is not defined. Ensure you defined '${problem.fnName}' with the exact expected name."
    }) + "__RESULT_END__");
    process.exit(0);
}

const results = [];
let passedCount = 0;
let totalTime = 0;

for (let i = 0; i < cases.length; i++) {
    const c = cases[i];
    const args = c.input;
    const expected = c.expected;
    const desc = c.inputDescription;

    const callArgs = args.map(arg => {
        ${
          problem.isLinkedList
            ? `return Array.isArray(arg) ? listToNodes(arg) : arg;`
            : problem.isTree
            ? `return Array.isArray(arg) ? arrayToTree(arg) : arg;`
            : `return arg;`
        }
    });

    const t0 = performance.now();
    try {
        const rawResult = fn(...callArgs);
        const tElapsed = performance.now() - t0;
        totalTime += tElapsed;

        let actual = rawResult;
        ${
          problem.isLinkedList
            ? `actual = nodesToList(rawResult);`
            : problem.isTree
            ? `actual = treeToArray(rawResult);`
            : ``
        }

        let isPass = false;
        ${
          problem.fnName === 'twoSum'
            ? `if (Array.isArray(actual) && Array.isArray(expected) && actual.length === expected.length) {
                const sAct = [...actual].sort((a,b) => a-b);
                const sExp = [...expected].sort((a,b) => a-b);
                isPass = (sAct[0] === sExp[0] && sAct[1] === sExp[1]);
            } else {
                isPass = JSON.stringify(actual) === JSON.stringify(expected);
            }`
            : `isPass = JSON.stringify(actual) === JSON.stringify(expected);`
        }

        if (isPass) {
            passedCount++;
            results.push({ case: i + 1, passed: true, input: desc, expected, actual });
        } else {
            results.push({ case: i + 1, passed: false, input: desc, expected, actual });
            console.log("__RESULT_START__" + JSON.stringify({
                status: "Wrong Answer",
                passedCount,
                totalCount: cases.length,
                runtimeMs: Math.round(totalTime * 100) / 100,
                failedCase: i + 1,
                input: desc,
                expected: JSON.stringify(expected),
                actual: JSON.stringify(actual),
                details: "Test Case " + (i + 1) + " Failed:\\nInput: " + desc + "\\nExpected: " + JSON.stringify(expected) + "\\nGot: " + JSON.stringify(actual)
            }) + "__RESULT_END__");
            process.exit(0);
        }
    } catch (err) {
        console.log("__RESULT_START__" + JSON.stringify({
            status: "Runtime Error",
            passedCount,
            totalCount: cases.length,
            failedCase: i + 1,
            input: desc,
            error: err.message,
            details: "Runtime Exception on Test Case " + (i + 1) + ":\\n" + err.message
        }) + "__RESULT_END__");
        process.exit(0);
    }
}

console.log("__RESULT_START__" + JSON.stringify({
    status: "Accepted",
    passedCount,
    totalCount: cases.length,
    runtimeMs: Math.max(Math.round(totalTime * 100) / 100, 12),
    results
}) + "__RESULT_END__");
`;
}

/**
 * Executes harness script in an isolated child process with strict timeout
 */
async function runIsolatedProcess(
  harnessCode: string,
  language: 'python' | 'javascript'
): Promise<any> {
  const tempDir = os.tmpdir();
  const fileExt = language === 'python' ? 'py' : 'js';
  const fileName = `nexora_test_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = path.join(tempDir, fileName);

  await fs.promises.writeFile(filePath, harnessCode, 'utf8');

  return new Promise((resolve) => {
    const cmd = language === 'python' ? 'python' : 'node';
    const args = language === 'python' ? [filePath] : ['--max-old-space-size=64', filePath];

    let stdout = '';
    let stderr = '';
    let finished = false;

    const child = spawn(cmd, args, {
      timeout: 3000,
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    });

    child.stdout.on('data', (d) => {
      stdout += d.toString();
    });

    child.stderr.on('data', (d) => {
      stderr += d.toString();
    });

    const cleanup = async () => {
      try {
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath);
        }
      } catch (_) {}
    };

    child.on('error', async (err) => {
      if (finished) return;
      finished = true;
      await cleanup();
      resolve({
        status: 'Runtime Error',
        error: `Failed to invoke ${cmd} process: ${err.message}`,
        details: err.message,
      });
    });

    child.on('close', async (code, signal) => {
      if (finished) return;
      finished = true;
      await cleanup();

      if (signal === 'SIGTERM' || signal === 'SIGKILL' || code === null) {
        return resolve({
          status: 'Time Limit Exceeded',
          error: 'Process execution timed out (>3000ms). Check for infinite loops or high algorithmic complexity.',
          details: 'Execution aborted: Time Limit Exceeded (3.0s)',
        });
      }

      // Check if structured result marker exists in stdout
      const markerStart = stdout.indexOf('__RESULT_START__');
      const markerEnd = stdout.indexOf('__RESULT_END__');

      if (markerStart !== -1 && markerEnd !== -1) {
        try {
          const jsonStr = stdout.substring(markerStart + '__RESULT_START__'.length, markerEnd);
          const parsed = JSON.parse(jsonStr);
          return resolve(parsed);
        } catch (e: any) {
          return resolve({
            status: 'Runtime Error',
            error: 'Failed to parse execution runner results.',
            details: stdout + '\n' + stderr,
          });
        }
      }

      if (stderr.trim().length > 0) {
        const isCompilation =
          stderr.includes('SyntaxError') ||
          stderr.includes('IndentationError') ||
          stderr.includes('NameError');

        return resolve({
          status: isCompilation ? 'Compilation Error' : 'Runtime Error',
          error: stderr.trim(),
          details: stderr.trim(),
        });
      }

      resolve({
        status: code === 0 ? 'Accepted' : 'Runtime Error',
        output: stdout,
        details: stdout || 'Process finished without error output.',
      });
    });
  });
}

/**
 * POST /api/code/run
 * Evaluates code against sample test cases (for "Run Code" button)
 */
router.post('/run', async (req, res): Promise<any> => {
  try {
    const { problemId, language, code } = req.body;

    if (!problemId || !code) {
      return res.status(400).json({ error: 'problemId and code are required.' });
    }

    const problem = PROBLEMS_DATA[problemId];
    if (!problem) {
      return res.status(404).json({ error: `Problem definition for '${problemId}' not found.` });
    }

    const lang = (language || 'python').toLowerCase();
    if (lang !== 'python' && lang !== 'javascript') {
      return res.status(400).json({
        error: `Language '${language}' is not currently supported for local execution. Use Python or JavaScript.`,
      });
    }

    const harness =
      lang === 'python'
        ? buildPythonHarness(code, problem, problem.sampleCases)
        : buildJsHarness(code, problem, problem.sampleCases);

    const result = await runIsolatedProcess(harness, lang);
    return res.json({ success: true, ...result });
  } catch (err: any) {
    console.error('[Code Route] Error evaluating code:', err);
    return res.status(500).json({ error: err.message || 'Failed to evaluate code.' });
  }
});

/**
 * POST /api/code/submit
 * Evaluates code against full test cases suite and marks problem solved in UserProgress
 */
router.post('/submit', authenticateOptional, async (req: AuthRequest, res): Promise<any> => {
  try {
    const { problemId, language, code } = req.body;

    if (!problemId || !code) {
      return res.status(400).json({ error: 'problemId and code are required.' });
    }

    const problem = PROBLEMS_DATA[problemId];
    if (!problem) {
      return res.status(404).json({ error: `Problem definition for '${problemId}' not found.` });
    }

    const lang = (language || 'python').toLowerCase();
    if (lang !== 'python' && lang !== 'javascript') {
      return res.status(400).json({
        error: `Language '${language}' is not currently supported for local execution. Use Python or JavaScript.`,
      });
    }

    const harness =
      lang === 'python'
        ? buildPythonHarness(code, problem, problem.allCases)
        : buildJsHarness(code, problem, problem.allCases);

    const result = await runIsolatedProcess(harness, lang);

    // If Accepted and user is logged in, mark as solved in MongoDB
    if (result.status === 'Accepted' && req.user) {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        let progress = await UserProgress.findOne({ userId: req.user._id });
        if (!progress) {
          progress = new UserProgress({
            userId: req.user._id,
            codingSolved: [],
            streak: { currentStreak: 1, longestStreak: 1, lastActivityDate: todayStr, activityDates: [todayStr] },
          });
        }

        if (!progress.codingSolved.includes(problemId)) {
          progress.codingSolved.push(problemId);
        }

        // Streak check
        if (!progress.streak) {
          progress.streak = { currentStreak: 1, longestStreak: 1, lastActivityDate: todayStr, activityDates: [todayStr] };
        } else {
          const lastDate = progress.streak.lastActivityDate;
          if (lastDate !== todayStr) {
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            if (lastDate === yesterday) {
              progress.streak.currentStreak += 1;
            } else {
              progress.streak.currentStreak = 1;
            }
            if (progress.streak.currentStreak > progress.streak.longestStreak) {
              progress.streak.longestStreak = progress.streak.currentStreak;
            }
            progress.streak.lastActivityDate = todayStr;
            if (!progress.streak.activityDates.includes(todayStr)) {
              progress.streak.activityDates.push(todayStr);
            }
          }
        }

        progress.lastActivityAt = new Date();
        await progress.save();
        result.savedToProgress = true;
      } catch (dbErr) {
        console.warn('[Code Submit] Failed to update user progress:', dbErr);
      }
    }

    return res.json({ success: true, ...result });
  } catch (err: any) {
    console.error('[Code Route] Error submitting code:', err);
    return res.status(500).json({ error: err.message || 'Failed to submit code.' });
  }
});

export default router;
