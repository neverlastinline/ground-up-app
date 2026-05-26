// data.ts — two progress states share one schema:
//   FRESH: brand-new learner, just finished onboarding, Step 1 in progress
//   DEMO:  Priya Mehta, Step 4 Week 7 — the rich state for showing off
//          checkpoint, portfolio, lesson, etc.
// The app selects between them via getProgress(mode). State lives in React
// (see progress.tsx) rather than on window globals.

export type Mode = "fresh" | "demo";
export type StepState = "passed" | "current" | "locked";
export type ResourceType = "tool" | "course" | "repo" | "doc";

export interface Resource {
  name: string;
  repo: string;
  stars: string | null;
  type: ResourceType;
}

export interface CheckpointCriterion {
  id: string;
  text: string;
  done: boolean;
}

export interface StepBase {
  n: number;
  name: string;
  weeks: string;
  weekRange: [number, number];
  summary: string;
  primary: string;
  checkpoint: string;
  resources: Resource[];
}

export interface Step extends StepBase {
  state: StepState;
  checkpointCriteria?: CheckpointCriterion[];
}

export interface PastNote {
  date: string;
  title: string;
  terms: string[];
}

export interface Experiment {
  title: string;
  sub: string;
  body: string;
  cmd: string;
}

export type VaultNode =
  | { kind: "dir"; depth: number; name: string }
  | { kind: "file"; depth: number; name: string };

export interface VaultScaffold {
  root: string;
  tree: VaultNode[];
  command: string;
  files: Record<string, string>;
}

export interface Today {
  step: number;
  week: number | string;
  weekOf: string;
  date: string;
  taskTitle: string;
  source: string;
  url: string;
  duration: string;
  expected: string;
  nextUp: string;
  dayLabel: string;
  dayProgress: [number, number];
  sessionNumber: number;
  tasks: string[];
  experiment: Experiment;
  noteTemplate: string;
  pastNotes: PastNote[];
  vaultScaffold?: VaultScaffold;
  /** Short label for the current lecture slot, e.g. "Lecture 4 of 7".
   *  Only set when the session maps to a numbered lecture series. */
  lectureLabel?: string;
}

export interface Streak {
  days: number;
  notesTotal: number;
  lastNote: string;
}

export interface Project {
  name: string;
  step: number;
  desc: string;
  commits: number;
  pushed: string;
  lang: string;
  status: "shipped" | "in-progress";
}

export interface Skill {
  name: string;
  step: number;
  earned: boolean;
  progress?: number;
}

export interface Persona {
  name: string;
  initials: string;
  age: number | null;
  role: string;
}

export interface ProgressData {
  steps: Step[];
  today: Today;
  streak: Streak;
  heatmap: number[];
  projects: Project[];
  skills: Skill[];
  persona: Persona;
}

/* ────────────── BASE STEP DEFINITIONS ────────────── */
// Static curriculum metadata. State (passed/current/locked) and
// checkpointCriteria get layered on top per mode.

const STEPS_BASE: StepBase[] = [
  {
    n: 1,
    name: "Environment Setup",
    weeks: "Day 1",
    weekRange: [0, 0],
    summary: "Tools installed. Accounts active. Vault ready.",
    primary: "Local installs + free academy accounts",
    checkpoint: "All 4 academy accounts active. Vault initialised.",
    resources: [
      { name: "Python 3.11+",          repo: "python.org",            stars: null, type: "tool" },
      { name: "VS Code",               repo: "code.visualstudio.com", stars: null, type: "tool" },
      { name: "Obsidian",              repo: "obsidian.md",           stars: null, type: "tool" },
      { name: "Ollama",                repo: "ollama.com",            stars: null, type: "tool" },
      { name: "Anthropic Academy",     repo: "anthropic.com/learn",   stars: null, type: "course" },
    ],
  },
  {
    n: 2,
    name: "AI Fundamentals",
    weeks: "Weeks 1–2",
    weekRange: [1, 2],
    summary: "Vocabulary, the 4D model, and your first Jupyter notebooks.",
    primary: "Google AI Cert · Anthropic Fluency · microsoft/generative-ai-for-beginners",
    checkpoint: "Explain LLMs, tokens, and transformers in your own words.",
    resources: [
      { name: "microsoft/generative-ai-for-beginners", repo: "github/microsoft", stars: "78.4k", type: "repo" },
      { name: "Google AI Professional Certificate",    repo: "coursera",         stars: null,    type: "course" },
      { name: "AI Fluency Framework",                  repo: "anthropic.com",    stars: null,    type: "course" },
    ],
  },
  {
    n: 3,
    name: "ML Foundations",
    weeks: "Weeks 3–5",
    weekRange: [3, 5],
    summary: "Regression, classification, clustering. Your first model on GitHub.",
    primary: "microsoft/ML-For-Beginners · IBM ML (audit) · mlabonne/llm-course",
    checkpoint: "You understand gradient descent, loss, overfitting. One project shipped.",
    resources: [
      { name: "microsoft/ML-For-Beginners", repo: "github/microsoft", stars: "73.2k", type: "repo" },
      { name: "IBM Machine Learning",       repo: "coursera",         stars: null,    type: "course" },
      { name: "mlabonne/llm-course",        repo: "github/mlabonne",  stars: "47.1k", type: "repo" },
    ],
  },
  {
    n: 4,
    name: "Deep Learning & Neural Networks",
    weeks: "Weeks 6–8",
    weekRange: [6, 8],
    summary: "Karpathy, from micrograd to a GPT you wrote line by line.",
    primary: "karpathy/nn-zero-to-hero · microsoft/AI-For-Beginners",
    checkpoint: "Neural net built from scratch. Backprop, attention, transformers — yours.",
    resources: [
      { name: "karpathy/nn-zero-to-hero",     repo: "github/karpathy",  stars: "13.8k", type: "repo" },
      { name: "microsoft/AI-For-Beginners",   repo: "github/microsoft", stars: "39.2k", type: "repo" },
      { name: "Building with the Claude API", repo: "anthropic.com",    stars: null,    type: "course" },
      { name: "ollama / llama3.2:3b",         repo: "ollama.com",       stars: null,    type: "tool" },
    ],
  },
  {
    n: 5,
    name: "LLMs & Prompt Engineering",
    weeks: "Weeks 9–10",
    weekRange: [9, 10],
    summary: "Architecture, fine-tuning, RAG over your own Obsidian vault.",
    primary: "mlabonne/llm-course (Scientist) · OpenAI Academy · Anthropic docs",
    checkpoint: "RAG over your vault. A second brain over your second brain.",
    resources: [
      { name: "mlabonne/llm-course",                 repo: "github/mlabonne", stars: "47.1k", type: "repo" },
      { name: "OpenAI Academy — Prompt Engineering", repo: "openai.com",      stars: null,    type: "course" },
      { name: "Anthropic Prompt Engineering Guide",  repo: "anthropic.com",   stars: null,    type: "doc" },
      { name: "ChromaDB",                            repo: "github/chroma",   stars: "16.4k", type: "repo" },
    ],
  },
  {
    n: 6,
    name: "AI Agents",
    weeks: "Weeks 11–12",
    weekRange: [11, 12],
    summary: "Tool use, MCP, LangGraph. An agent that manages your study life.",
    primary: "microsoft/ai-agents-for-beginners · Anthropic MCP · LangGraph",
    checkpoint: "Working agent with MCP. Tool use, multi-step workflows.",
    resources: [
      { name: "microsoft/ai-agents-for-beginners", repo: "github/microsoft",  stars: "24.7k", type: "repo" },
      { name: "Introduction to MCP",               repo: "anthropic.com",     stars: null,    type: "course" },
      { name: "LangGraph",                         repo: "github/langchain",  stars: "8.1k",  type: "repo" },
      { name: "Anthropic Cookbook",                repo: "github/anthropic",  stars: "10.3k", type: "repo" },
    ],
  },
  {
    n: 7,
    name: "Production, Portfolio & Responsible AI",
    weeks: "Weeks 13–14",
    weekRange: [13, 14],
    summary: "Deploy, evaluate, red-team. Capstone in front of employers.",
    primary: "Gradio · DeepEval · RAGAS · Constitutional AI",
    checkpoint: "Deployed, evaluated, safety-checked. GitHub becomes resume.",
    resources: [
      { name: "Gradio + Hugging Face Spaces", repo: "huggingface.co",            stars: null,    type: "tool" },
      { name: "DeepEval",                     repo: "github/confident-ai",       stars: "4.8k",  type: "repo" },
      { name: "RAGAS",                        repo: "github/explodinggradients", stars: "7.2k",  type: "repo" },
      { name: "Constitutional AI",            repo: "anthropic.com",             stars: null,    type: "doc" },
    ],
  },
];

/* ────────────── HEATMAP GENERATORS ────────────── */

interface HeatmapOpts {
  density?: number;
  recencyBias?: number;
  lastNDays?: number | null;
}

function makeHeatmap({ density = 0.5, recencyBias = 0.5, lastNDays = null }: HeatmapOpts = {}): number[] {
  const cells: number[] = [];
  const seed = (i: number) => {
    const x = Math.sin(i * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };
  const totalCells = 52 * 7;
  for (let w = 0; w < 52; w++) {
    for (let d = 0; d < 7; d++) {
      const i = w * 7 + d;
      // count cells from the end: 0 = today, growing into the past
      const fromEnd = totalCells - 1 - i;
      if (lastNDays != null) {
        // fresh-user mode: only the most recent N days have any activity
        if (fromEnd < lastNDays) {
          cells.push(seed(i) > 0.4 ? 1 : 0);
        } else {
          cells.push(0);
        }
        continue;
      }
      const r = seed(i);
      const recency = w / 51;
      const weight = r * density + recency * recencyBias;
      let h = 0;
      if (weight > 0.55) h = 1;
      if (weight > 0.75) h = 2;
      if (weight > 0.95) h = 3;
      if (weight > 1.15) h = 4;
      if (w < 8 && r > 0.7) h = 0;
      cells.push(h);
    }
  }
  return cells;
}

/* ────────────── DEMO STATE — Priya, Step 4 Week 7 ────────────── */

function demoData(): ProgressData {
  return {
    steps: STEPS_BASE.map((s): Step => {
      let state: StepState = "locked";
      if (s.n <= 3) state = "passed";
      if (s.n === 4) state = "current";
      const out: Step = { ...s, state };
      if (s.n === 4) {
        out.checkpointCriteria = [
          { id: "c1", text: "I can derive backpropagation on paper for a two-layer net.",        done: true  },
          { id: "c2", text: "My nanoGPT-from-scratch repo trains and generates Shakespeare-like text.", done: true  },
          { id: "c3", text: "I can describe self-attention without looking it up.",              done: false },
          { id: "c4", text: "I have run llama3.2:3b locally with Ollama and read its output.",   done: false },
        ];
      }
      return out;
    }),
    today: {
      step: 4, week: 7, weekOf: "8",
      date: "Sun, May 24",
      taskTitle: "Lecture 4 — Activations & BatchNorm",
      source: "karpathy/nn-zero-to-hero",
      url: "https://github.com/karpathy/nn-zero-to-hero",
      duration: "~2h 10m",
      expected: "Implement BatchNorm forward + backward by hand in micrograd. Note when it stabilises training and when it actively hurts.",
      nextUp: "Lecture 5 — building makemore Part 4. Tomorrow.",
      lectureLabel: "Lecture 4 of 7",
      dayLabel: "Day 3 of 10 in Step 4",
      dayProgress: [3, 10],
      sessionNumber: 31,
      tasks: [
        "Watch Karpathy Lecture 4 to the end. Don't skip the activation visualisation in the middle — that's the lecture.",
        "Re-implement BatchNorm forward & backward by hand in your micrograd fork. Don't import torch.nn.BatchNorm1d.",
        "Run llama3.2:3b in a separate terminal and ask it to explain BatchNorm. Note one place its answer is sloppy. That's the gap you just closed.",
        "Write today's session note using the four-prompt template on the right. Commit your micrograd diff to GitHub before bed.",
      ],
      experiment: {
        title: "Parallel experiment",
        sub:   "runs alongside today",
        body:  "While your toy net trains, run a real 3B model. Compare. The gap between micrograd and llama3.2 is the entire reason this course exists.",
        cmd:   "$ ollama run llama3.2:3b",
      },
      noteTemplate: `## What I learned\n\nThe activation distribution problem: if pre-activation values drift too wide, tanh saturates and gradients vanish. BatchNorm centres and rescales them mid-network so the next layer sees a stable distribution.\n\n## What surprised me\n\nThat BatchNorm has *learnable* gamma and beta — it doesn't just normalise, it lets the network un-normalise if that's what it wants. That's why it isn't "just" a scaler.\n\n## Still unclear\n\n`,
      pastNotes: [
        { date: "Sat, May 23", title: "Why softmax is just normalised exponentials", terms: ["softmax","logits","temperature"] },
        { date: "Fri, May 22", title: "Embeddings as lookup tables in disguise",     terms: ["embedding","lookup","one-hot"] },
        { date: "Thu, May 21", title: "What I got wrong about cross-entropy",         terms: ["cross-entropy","loss","KL"] },
        { date: "Wed, May 20", title: "Why we don't init weights at zero",            terms: ["init","Xavier","symmetry"] },
      ],
    },
    streak: {
      days: 18,
      notesTotal: 31,
      lastNote: "Sat, May 23 — Why softmax is just normalised exponentials",
    },
    heatmap: makeHeatmap({ density: 1, recencyBias: 0.5 }),
    projects: [
      {
        name: "titanic-classifier", step: 3,
        desc: "Logistic regression + random forest on Titanic. Confusion matrix in the README. First model that wasn't a tutorial copy-paste.",
        commits: 12, pushed: "3 weeks ago", lang: "Python", status: "shipped",
      },
      {
        name: "nanoGPT-from-scratch", step: 4,
        desc: "Following Karpathy line by line. Tiny shakespeare corpus. Currently debugging BatchNorm gradients.",
        commits: 7, pushed: "yesterday", lang: "Python", status: "in-progress",
      },
    ],
    skills: [
      { name: "AI Fundamentals",      step: 2, earned: true  },
      { name: "Trained a real model", step: 3, earned: true  },
      { name: "Built a transformer",  step: 4, earned: false, progress: 0.62 },
      { name: "Prompt engineer",      step: 5, earned: false, progress: 0 },
      { name: "RAG architect",        step: 5, earned: false, progress: 0 },
      { name: "Agent builder",        step: 6, earned: false, progress: 0 },
      { name: "Production deployed",  step: 7, earned: false, progress: 0 },
      { name: "Safety checked",       step: 7, earned: false, progress: 0 },
    ],
    persona: { name: "Priya Mehta", initials: "PM", age: 29, role: "data analyst → AI engineer" },
  };
}

/* ────────────── FRESH STATE — Day 1, just onboarded ────────────── */

function freshData(): ProgressData {
  return {
    steps: STEPS_BASE.map((s): Step => {
      let state: StepState = "locked";
      if (s.n === 1) state = "current";
      const out: Step = { ...s, state };
      if (s.n === 1) {
        out.checkpointCriteria = [
          { id: "f1", text: "Python 3.11+, VS Code, Git, Obsidian and Ollama are installed locally.",   done: false },
          { id: "f2", text: "I created accounts on Anthropic Academy, OpenAI Academy, Google AI and IBM ML.", done: false },
          { id: "f3", text: "My Obsidian AI-Learning vault exists with /sessions, /concepts, /projects.",      done: false },
          { id: "f4", text: "I pushed an initial commit to a public GitHub repo named ground-up.",             done: false },
        ];
      }
      return out;
    }),
    today: {
      step: 1, week: "Day 1", weekOf: "1",
      date: "Sun, May 24",
      taskTitle: "Tonight — installs, accounts, vault",
      source: "Step 1 · Environment Setup",
      url: "https://obsidian.md",
      duration: "~55 min",
      expected: "Install Python, VS Code, Obsidian and Ollama. Create the four academy accounts. Initialise your vault and push an empty repo to GitHub. Don't open a lecture yet — Step 2 starts tomorrow.",
      nextUp: "Tomorrow · Step 2 — Anthropic AI Fluency, Module 1.",
      dayLabel: "Day 1 of 1 in Step 1",
      dayProgress: [1, 1],
      sessionNumber: 1,
      tasks: [
        "Install the local stack: Python 3.11+, VS Code with the Python extension, Git, Obsidian, Ollama. Don't skim — make sure `python --version` and `ollama --version` both print something in your terminal.",
        "Create four free accounts: Anthropic Academy, OpenAI Academy, Google AI (via Coursera), IBM Machine Learning on Coursera (audit mode = free). Bookmark each.",
        "Open Obsidian and scaffold the AI-Learning folder structure (see the panel below). Copy the one-line terminal command if you want it done in five seconds, or download the ready-made zip and drag it into your vault. Either way: you should see AI-Learning/ in your file explorer before bed.",
        "Create a public GitHub repo called ground-up. Push an empty README that says one sentence about why you're doing this. That's your first commit.",
      ],
      experiment: {
        title: "While the installers run",
        sub:   "this is the only night that's pure setup",
        body:  "Write your first session note tonight, even if it's three sentences. The streak that matters is the one that survives Day 1 — most people quit before Day 2 because they never wrote anything down.",
        cmd:   "$ obsidian-vault/sessions/2026-05-24.md",
      },
      noteTemplate: `## What I learned\n\nWhy I'm doing Ground Up. The one outcome that would make all 14 weeks worth it.\n\n## What surprised me\n\n\n\n## Still unclear\n\nWhat "understanding AI ground up" actually means to me — I'll know better at the Step 2 checkpoint.\n\n## Key terms\n\n`,
      pastNotes: [],
      vaultScaffold: {
        root: "AI-Learning",
        tree: [
          { kind: "dir",  depth: 0, name: "AI-Learning/" },
          { kind: "dir",  depth: 1, name: "00-setup/" },
          { kind: "file", depth: 2, name: "accounts-and-tools.md" },
          { kind: "dir",  depth: 1, name: "01-fundamentals/" },
          { kind: "file", depth: 2, name: "notes.md" },
          { kind: "file", depth: 2, name: "key-concepts.md" },
          { kind: "dir",  depth: 1, name: "02-ml-foundations/" },
          { kind: "file", depth: 2, name: "notes.md" },
          { kind: "dir",  depth: 2, name: "projects/" },
          { kind: "dir",  depth: 1, name: "03-deep-learning/" },
          { kind: "file", depth: 2, name: "notes.md" },
          { kind: "dir",  depth: 2, name: "karpathy-exercises/" },
          { kind: "dir",  depth: 1, name: "04-llms-and-prompting/" },
          { kind: "file", depth: 2, name: "notes.md" },
          { kind: "dir",  depth: 2, name: "projects/" },
          { kind: "dir",  depth: 1, name: "05-agents/" },
          { kind: "file", depth: 2, name: "notes.md" },
          { kind: "dir",  depth: 2, name: "my-agent/" },
          { kind: "dir",  depth: 1, name: "06-production/" },
          { kind: "file", depth: 2, name: "deploy-notes.md" },
          { kind: "dir",  depth: 2, name: "eval-results/" },
          { kind: "dir",  depth: 1, name: "07-portfolio/" },
          { kind: "file", depth: 2, name: "github-readme-draft.md" },
          { kind: "file", depth: 2, name: "linkedin-cases.md" },
          { kind: "file", depth: 1, name: "resources.md" },
        ],
        command: "mkdir -p AI-Learning/{00-setup,01-fundamentals,02-ml-foundations/projects,03-deep-learning/karpathy-exercises,04-llms-and-prompting/projects,05-agents/my-agent,06-production/eval-results,07-portfolio} && cd AI-Learning && touch 00-setup/accounts-and-tools.md 01-fundamentals/{notes,key-concepts}.md 02-ml-foundations/notes.md 03-deep-learning/notes.md 04-llms-and-prompting/notes.md 05-agents/notes.md 06-production/deploy-notes.md 07-portfolio/{github-readme-draft,linkedin-cases}.md resources.md",
        // file contents used by the in-app zip download
        files: {
          "AI-Learning/00-setup/accounts-and-tools.md":
`---\ntags: [ai-learning, setup]\nstatus: in-progress\n---\n\n# Accounts & Tools\n\n> One-time setup. Check items off as you go.\n\n## Accounts\n- [ ] OpenAI (API key + billing limit)\n- [ ] Anthropic Console (API key)\n- [ ] Hugging Face (token, read + write)\n- [ ] GitHub (SSH key set up)\n- [ ] Weights & Biases (optional)\n- [ ] Google Colab / Kaggle (free GPU)\n\n## Local environment\n- [ ] Python 3.11+ via uv or pyenv\n- [ ] VS Code / Cursor\n- [ ] Obsidian (this vault)\n- [ ] git, gh CLI\n- [ ] Docker (later)\n\n## API keys\nStore in ~/.env or password manager. **Never commit.**\n\n\`\`\`\nOPENAI_API_KEY=\nANTHROPIC_API_KEY=\nHF_TOKEN=\n\`\`\`\n`,
          "AI-Learning/01-fundamentals/notes.md":
`---\ntags: [ai-learning, fundamentals]\n---\n\n# Fundamentals — Notes\n\n> Linear algebra, probability, calculus, Python refresh.\n\n## Topics\n- [ ] Vectors, matrices, dot product\n- [ ] Eigen-decomposition (intuition)\n- [ ] Probability distributions, Bayes\n- [ ] Gradients & chain rule\n- [ ] NumPy / PyTorch tensor basics\n\n## Daily log\n`,
          "AI-Learning/01-fundamentals/key-concepts.md":
`---\ntags: [ai-learning, fundamentals, concepts]\n---\n\n# Key Concepts\n\nAtomic notes. One concept per heading.\n\n## Tensor\nA multi-dimensional array. Shape = (dim0, dim1, ...).\n\n## Gradient\n\n## Loss function\n\n## Backpropagation\n\n## Overfitting / underfitting\n`,
          "AI-Learning/02-ml-foundations/notes.md":
`---\ntags: [ai-learning, ml]\n---\n\n# ML Foundations — Notes\n\n## Topics\n- [ ] Supervised vs unsupervised\n- [ ] Linear & logistic regression\n- [ ] Trees, random forests\n- [ ] Gradient boosting\n- [ ] Train / val / test, cross-validation\n- [ ] Metrics: accuracy, precision/recall, F1, AUC\n\n## Projects → see projects/\n`,
          "AI-Learning/02-ml-foundations/projects/.gitkeep": "",
          "AI-Learning/03-deep-learning/notes.md":
`---\ntags: [ai-learning, dl]\n---\n\n# Deep Learning — Notes\n\n> Karpathy "Zero to Hero" + PyTorch.\n\n## Topics\n- [ ] Micrograd\n- [ ] Makemore\n- [ ] Building GPT from scratch\n- [ ] Tokenization deep dive\n- [ ] Transformers\n\n## Exercises → see karpathy-exercises/\n`,
          "AI-Learning/03-deep-learning/karpathy-exercises/.gitkeep": "",
          "AI-Learning/04-llms-and-prompting/notes.md":
`---\ntags: [ai-learning, llm, prompting]\n---\n\n# LLMs & Prompting — Notes\n\n## Topics\n- [ ] Tokenization (BPE)\n- [ ] Sampling: temperature, top-k, top-p\n- [ ] Structured output / tool use\n- [ ] Few-shot vs zero-shot\n- [ ] Chain-of-thought, ReAct\n- [ ] RAG basics\n\n## Projects → see projects/\n`,
          "AI-Learning/04-llms-and-prompting/projects/.gitkeep": "",
          "AI-Learning/05-agents/notes.md":
`---\ntags: [ai-learning, agents]\n---\n\n# Agents — Notes\n\n## Topics\n- [ ] Tool use / function calling\n- [ ] Planning loops (ReAct, Reflexion)\n- [ ] Memory (short, long, vector)\n- [ ] Multi-agent patterns\n- [ ] Evaluation of agent runs\n\n## Build → see my-agent/\n`,
          "AI-Learning/05-agents/my-agent/.gitkeep": "",
          "AI-Learning/06-production/deploy-notes.md":
`---\ntags: [ai-learning, production, deploy]\n---\n\n# Deploy Notes\n\n## Topics\n- [ ] Hosting: Modal / Replicate / Fly / Vercel\n- [ ] FastAPI wrapper\n- [ ] Streaming responses\n- [ ] Caching & rate limiting\n- [ ] Cost monitoring\n- [ ] Observability\n`,
          "AI-Learning/06-production/eval-results/.gitkeep": "",
          "AI-Learning/07-portfolio/github-readme-draft.md":
`---\ntags: [ai-learning, portfolio]\n---\n\n# GitHub README — Draft\n\n## Hi, I'm [name]\nShort pitch — one line.\n\n## Projects\n### 1. [Project name]\n- What it does:\n- Stack:\n- Link:\n\n### 2.\n\n### 3.\n`,
          "AI-Learning/07-portfolio/linkedin-cases.md":
`---\ntags: [ai-learning, portfolio, linkedin]\n---\n\n# LinkedIn Case Studies — Drafts\n\n## Case 1: [Title]\n**Problem.**\n\n**Approach.**\n\n**Result.**\n\n**Stack.**\n`,
          "AI-Learning/resources.md":
`---\ntags: [ai-learning, resources, moc]\n---\n\n# Resources (MOC)\n\n> Map of content. Living index.\n\n## Courses\n- [ ] Andrew Ng — Machine Learning Specialization\n- [ ] fast.ai — Practical Deep Learning\n- [ ] Karpathy — Neural Networks: Zero to Hero\n- [ ] DeepLearning.AI short courses\n\n## Books\n- [ ] Deep Learning — Goodfellow et al\n- [ ] Hands-On ML — Géron\n- [ ] Designing ML Systems — Huyen\n\n## Papers\n- [ ] Attention Is All You Need\n- [ ] GPT-2 / GPT-3\n- [ ] InstructGPT\n- [ ] Chinchilla\n`,
        },
      },
    },
    streak: {
      days: 0,
      notesTotal: 0,
      lastNote: "You haven't written one yet. Tonight's the first.",
    },
    heatmap: makeHeatmap({ lastNDays: 1 }),
    projects: [],
    skills: [
      { name: "AI Fundamentals",      step: 2, earned: false, progress: 0 },
      { name: "Trained a real model", step: 3, earned: false, progress: 0 },
      { name: "Built a transformer",  step: 4, earned: false, progress: 0 },
      { name: "Prompt engineer",      step: 5, earned: false, progress: 0 },
      { name: "RAG architect",        step: 5, earned: false, progress: 0 },
      { name: "Agent builder",        step: 6, earned: false, progress: 0 },
      { name: "Production deployed",  step: 7, earned: false, progress: 0 },
      { name: "Safety checked",       step: 7, earned: false, progress: 0 },
    ],
    persona: { name: "You", initials: "YO", age: null, role: "Day 1 · environment setup" },
  };
}

/* ────────────── ONBOARDING OPTIONS ────────────── */

export const ONBOARD = {
  background: ["Complete beginner", "Some Python", "Know ML basics", "Familiar with LLMs"],
  goal: ["Get a job in AI", "Build my own AI products", "Understand AI deeply", "Use AI better at work"],
  hours: ["5", "10", "15", "20+"],
};

/* ────────────── MODE SWITCH ────────────── */
// Returns a fresh deep copy of the dataset for the given mode, so that
// in-app mutations (criteria ticks) never leak across mode switches.

export function getProgress(mode: Mode): ProgressData {
  return mode === "demo" ? demoData() : freshData();
}
