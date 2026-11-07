/**
 * Curated starter templates for Athokpam Labs
 * Each template includes realistic files, package.json, and interactive components.
 */

export interface StarterTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Fullstack' | 'Game' | 'SaaS' | 'AI' | 'E-commerce';
  files: Record<string, string>;
  defaultOpenPath: string;
}

export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: 'saas-dashboard',
    title: 'SaaS Analytics Dashboard',
    description: 'Modern executive analytics with revenue charts, user conversion, metrics, and activity feed.',
    icon: 'LayoutDashboard',
    category: 'SaaS',
    defaultOpenPath: 'src/App.tsx',
    files: {
      'package.json': JSON.stringify({
        name: 'saas-analytics',
        version: '1.0.0',
        dependencies: {
          'react': '^18.3.1',
          'react-dom': '^18.3.1',
          'lucide-react': '^0.344.0',
        }
      }, null, 2),
      'src/App.tsx': `function App() {
  const [timeRange, setTimeRange] = useState('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const metrics = [
    { label: 'Total Revenue', value: '$124,592', change: '+14.2%', trend: 'up' },
    { label: 'Active Users', value: '45,231', change: '+8.1%', trend: 'up' },
    { label: 'Conversion Rate', value: '3.64%', change: '-0.4%', trend: 'down' },
    { label: 'Avg Session', value: '4m 32s', change: '+12.5%', trend: 'up' },
  ];

  const recentTransactions = [
    { id: 'TX-9021', customer: 'Acme Cloud Corp', plan: 'Enterprise Team', amount: '$4,200', status: 'Completed', date: 'Just now' },
    { id: 'TX-9020', customer: 'Starlight Media', plan: 'Pro Monthly', amount: '$99', status: 'Completed', date: '12m ago' },
    { id: 'TX-9019', customer: 'Nexus Robotics', plan: 'Scale Yearly', amount: '$1,890', status: 'Processing', date: '34m ago' },
    { id: 'TX-9018', customer: 'Vanguard Labs', plan: 'Enterprise Custom', amount: '$6,500', status: 'Completed', date: '1h ago' },
    { id: 'TX-9017', customer: 'Hyperion AI', plan: 'Pro Monthly', amount: '$99', status: 'Failed', date: '2h ago' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 py-3.5 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            ⚡
          </div>
          <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Nexus Pulse</span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ml-2">Live 99.98%</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search metrics, users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 w-52 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter</option>
            <option value="1y">All Time</option>
          </select>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3.5 py-1.5 rounded-lg transition-colors shadow-lg shadow-indigo-600/20">
            Export Report
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-6 max-w-7xl mx-auto w-full flex-1 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 hover:border-slate-700 transition-all shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>{m.label}</span>
                <span className={\`px-2 py-0.5 rounded text-[11px] font-semibold \${
                  m.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                }\`}>
                  {m.change}
                </span>
              </div>
              <div className="mt-3 text-2xl font-bold tracking-tight text-white">{m.value}</div>
              <div className="mt-2 text-[11px] text-slate-500">vs. previous period</div>
            </div>
          ))}
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual Chart */}
          <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-sm text-white">Revenue Velocity</h3>
                <p className="text-xs text-slate-400">Monthly recurring MRR trajectory</p>
              </div>
              <div className="flex gap-1.5 bg-slate-800/50 p-1 rounded-lg">
                <button className="text-xs px-2.5 py-1 rounded bg-indigo-600 text-white font-medium">MRR</button>
                <button className="text-xs px-2.5 py-1 rounded text-slate-400 hover:text-white transition-colors">Users</button>
              </div>
            </div>

            {/* Simulated Chart Bars */}
            <div className="h-48 flex items-end gap-3 pt-6 border-b border-slate-800/60 pb-2">
              {[42, 58, 65, 52, 74, 88, 95, 78, 110, 125, 115, 140].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    \${h}k
                  </div>
                  <div 
                    style={{ height: \`\${(h / 140) * 100}%\` }}
                    className="w-full bg-gradient-to-t from-indigo-600/40 to-indigo-500 rounded-t group-hover:from-indigo-500 group-hover:to-purple-400 transition-all cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 font-mono">M{i+1}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-1">
              <span>Projection: <strong>+$38k Q4</strong></span>
              <span className="text-emerald-400 font-medium">Target Achieved 104%</span>
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-sm text-white mb-1">Server Cluster Health</h3>
              <p className="text-xs text-slate-400 mb-4">Multi-region edge performance</p>

              <div className="space-y-3.5">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">us-east-1 (N. Virginia)</span>
                    <span className="text-emerald-400 font-mono">18ms • 99.99%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[94%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">eu-central-1 (Frankfurt)</span>
                    <span className="text-emerald-400 font-mono">24ms • 99.95%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full w-[88%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">ap-southeast-1 (Tokyo)</span>
                    <span className="text-emerald-400 font-mono">38ms • 99.90%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full w-[76%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Requests</span>
                <span className="font-mono text-white font-semibold">14.8M / day</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-sm text-white">Live Transactions</h3>
            <span className="text-xs text-slate-400">Showing last 5 payments</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800/60">
                <tr>
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Plan</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-indigo-400">{tx.id}</td>
                    <td className="px-5 py-3.5 font-medium text-white">{tx.customer}</td>
                    <td className="px-5 py-3.5 text-slate-300">{tx.plan}</td>
                    <td className="px-5 py-3.5 font-semibold text-white">{tx.amount}</td>
                    <td className="px-5 py-3.5">
                      <span className={\`px-2 py-0.5 rounded-full text-[10px] font-medium \${
                        tx.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        tx.status === 'Processing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }\`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}`,
      'src/index.css': `@import "tailwindcss";`,
    }
  },
  {
    id: 'retro-game',
    title: 'Cyberpunk Arcade Snake',
    description: 'Playable neon retro snake game with power-ups, score combo counter, and fluid canvas physics.',
    icon: 'Gamepad2',
    category: 'Game',
    defaultOpenPath: 'src/App.tsx',
    files: {
      'package.json': JSON.stringify({
        name: 'arcade-snake',
        version: '1.0.0',
        dependencies: {
          'react': '^18.3.1',
          'react-dom': '^18.3.1',
        }
      }, null, 2),
      'src/App.tsx': `function App() {
  const [snake, setSnake] = useState([[10, 10], [10, 11], [10, 12]]);
  const [food, setFood] = useState([5, 5]);
  const [direction, setDirection] = useState([0, -1]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(120);
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);

  const BOARD_SIZE = 20;

  const resetGame = () => {
    setSnake([[10, 10], [10, 11], [10, 12]]);
    setFood([Math.floor(Math.random() * BOARD_SIZE), Math.floor(Math.random() * BOARD_SIZE)]);
    setDirection([0, -1]);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code) && direction[1] !== 1) setDirection([0, -1]);
      if (['ArrowDown', 'KeyS'].includes(e.code) && direction[1] !== -1) setDirection([0, 1]);
      if (['ArrowLeft', 'KeyA'].includes(e.code) && direction[0] !== 1) setDirection([-1, 0]);
      if (['ArrowRight', 'KeyD'].includes(e.code) && direction[0] !== -1) setDirection([1, 0]);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = [prevSnake[0][0] + direction[0], prevSnake[0][1] + direction[1]];

        // Wall collision
        if (head[0] < 0 || head[0] >= BOARD_SIZE || head[1] < 0 || head[1] >= BOARD_SIZE) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        // Self collision
        for (const segment of prevSnake) {
          if (segment[0] === head[0] && segment[1] === head[1]) {
            setGameOver(true);
            setIsPlaying(false);
            return prevSnake;
          }
        }

        const newSnake = [head, ...prevSnake];

        // Eat food
        if (head[0] === food[0] && head[1] === food[1]) {
          setScore((s) => {
            const next = s + 10;
            if (next > highScore) setHighScore(next);
            return next;
          });
          setFood([Math.floor(Math.random() * BOARD_SIZE), Math.floor(Math.random() * BOARD_SIZE)]);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, gameOver, direction, food, speed, highScore]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-2xl shadow-purple-900/30 max-w-md w-full">
        {/* Header HUD */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">👾</span>
            <h1 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
              CYBER SNAKE
            </h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-slate-400">SCORE: <strong className="text-cyan-400 text-sm">{score}</strong></span>
            <span className="text-slate-400">HIGH: <strong className="text-fuchsia-400 text-sm">{highScore}</strong></span>
          </div>
        </div>

        {/* Game Grid */}
        <div className="relative aspect-square w-full bg-slate-950 border-2 border-slate-800 rounded-xl overflow-hidden shadow-inner">
          <div 
            className="w-full h-full grid" 
            style={{ 
              gridTemplateColumns: \`repeat(\${BOARD_SIZE}, 1fr)\`, 
              gridTemplateRows: \`repeat(\${BOARD_SIZE}, 1fr)\` 
            }}
          >
            {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => {
              const x = index % BOARD_SIZE;
              const y = Math.floor(index / BOARD_SIZE);
              const isHead = snake[0] && snake[0][0] === x && snake[0][1] === y;
              const isBody = snake.slice(1).some((s) => s[0] === x && s[1] === y);
              const isFood = food[0] === x && food[1] === y;

              let cellClass = 'border-[0.5px] border-slate-900/40';
              if (isHead) cellClass = 'bg-cyan-400 shadow-md shadow-cyan-400/80 rounded-sm';
              else if (isBody) cellClass = 'bg-cyan-600/80 rounded-sm';
              else if (isFood) cellClass = 'bg-fuchsia-500 rounded-full animate-pulse shadow-md shadow-fuchsia-500/80';

              return <div key={index} className={cellClass} />;
            })}
          </div>

          {/* Overlay when game over or stopped */}
          {(!isPlaying || gameOver) && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <h2 className="text-2xl font-bold mb-2 text-white">
                {gameOver ? 'SYSTEM CRASH 💥' : 'READY PLAYER ONE'}
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                {gameOver ? \`Final Score: \${score} pts\` : 'Use Arrow keys or WASD to navigate'}
              </p>
              <button 
                onClick={resetGame}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-purple-600/40 transition-transform active:scale-95"
              >
                {gameOver ? 'Play Again' : 'Start Engine'}
              </button>
            </div>
          )}
        </div>

        {/* Controls Info */}
        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-3">
          <span>🎮 Keys: W, A, S, D or Arrows</span>
          <div className="flex gap-2">
            <button onClick={() => setSpeed(160)} className={\`px-2 py-0.5 rounded \${speed === 160 ? 'bg-cyan-900 text-cyan-300' : 'text-slate-400'}\`}>Slow</button>
            <button onClick={() => setSpeed(120)} className={\`px-2 py-0.5 rounded \${speed === 120 ? 'bg-cyan-900 text-cyan-300' : 'text-slate-400'}\`}>Normal</button>
            <button onClick={() => setSpeed(70)} className={\`px-2 py-0.5 rounded \${speed === 70 ? 'bg-cyan-900 text-cyan-300' : 'text-slate-400'}\`}>Turbo</button>
          </div>
        </div>
      </div>
    </div>
  );
}`,
      'src/index.css': `@import "tailwindcss";`,
    }
  },
  {
    id: 'ai-prompt-studio',
    title: 'AI Prompt & Persona Studio',
    description: 'Interactive prompt engineering workbench with token analysis, test playground, and exportable presets.',
    icon: 'Sparkles',
    category: 'AI',
    defaultOpenPath: 'src/App.tsx',
    files: {
      'package.json': JSON.stringify({
        name: 'ai-prompt-studio',
        version: '1.0.0',
        dependencies: {
          'react': '^18.3.1',
          'react-dom': '^18.3.1',
        }
      }, null, 2),
      'src/App.tsx': `function App() {
  const [systemPrompt, setSystemPrompt] = useState('You are an expert senior TypeScript engineer who writes concise, clean, production-grade code.');
  const [userPrompt, setUserPrompt] = useState('Create a custom useDebounce hook with immediate execution support.');
  const [temperature, setTemperature] = useState(0.7);
  const [response, setResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState([
    { title: 'Debounce hook', tokens: 342, date: '10m ago' },
    { title: 'Tailwind button component', tokens: 184, date: '1h ago' }
  ]);

  const handleRun = () => {
    setIsGenerating(true);
    setResponse('');
    
    // Simulate streaming output
    const mockOutput = \`\`\`typescript
import { useEffect, useRef, useState } from 'react';

export function useDebounce<T>(value: T, delay: number, immediate = false): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (immediate && isFirstRun.current) {
      isFirstRun.current = false;
      setDebouncedValue(value);
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay, immediate]);

  return debouncedValue;
}
\`\`\`\`;

    let i = 0;
    const interval = setInterval(() => {
      if (i < mockOutput.length) {
        setResponse(mockOutput.substring(0, i + 10));
        i += 10;
      } else {
        clearInterval(interval);
        setIsGenerating(false);
        setHistory(prev => [{ title: userPrompt.slice(0, 24) + '...', tokens: Math.floor(mockOutput.length / 4), date: 'Just now' }, ...prev]);
      }
    }, 20);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-lg bg-purple-600/20 text-purple-400 font-bold">✨</span>
          <div>
            <h1 className="text-base font-bold text-white">PromptLab Pro</h1>
            <p className="text-xs text-slate-400">System Instruction & Parameter Playground</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-2.5 py-1 bg-slate-800 rounded border border-slate-700 text-purple-300">
            ~{Math.round((systemPrompt.length + userPrompt.length) / 4)} prompt tokens
          </span>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 p-6 gap-6 max-w-7xl mx-auto w-full">
        {/* Left Config */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">System Persona</label>
            <textarea 
              rows={4}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">User Prompt</label>
            <textarea 
              rows={4}
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            />
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Temp: {temperature}</span>
                <input 
                  type="range" min="0" max="1" step="0.1" 
                  value={temperature} 
                  onChange={(e) => setTemperature(parseFloat(e.target.value))} 
                  className="w-24 accent-purple-500"
                />
              </div>
              <button 
                onClick={handleRun}
                disabled={isGenerating}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-lg shadow-purple-600/30 transition-all"
              >
                {isGenerating ? 'Generating...' : 'Run Simulation'}
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">Recent Runs</h3>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div key={i} className="flex justify-between items-center text-xs p-2 rounded bg-slate-950/60 border border-slate-800/60">
                  <span className="text-slate-300 font-medium truncate max-w-[180px]">{h.title}</span>
                  <span className="text-slate-500 font-mono text-[11px]">{h.tokens} tok • {h.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Model Response</span>
            {response && (
              <button 
                onClick={() => navigator.clipboard.writeText(response)}
                className="text-xs text-purple-400 hover:text-purple-300 font-medium"
              >
                Copy Code
              </button>
            )}
          </div>
          <div className="p-5 flex-1 bg-slate-950/60 overflow-auto font-mono text-xs text-slate-300 whitespace-pre-wrap">
            {response ? response : (
              <div className="text-slate-600 italic h-full flex items-center justify-center">
                Press "Run Simulation" to generate completion...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}`,
      'src/index.css': `@import "tailwindcss";`,
    }
  },
  {
    id: 'ecommerce-store',
    title: 'Minimalist Storefront',
    description: 'Clean e-commerce product catalog with interactive cart, category filters, and checkout drawer.',
    icon: 'ShoppingBag',
    category: 'E-commerce',
    defaultOpenPath: 'src/App.tsx',
    files: {
      'package.json': JSON.stringify({
        name: 'minimal-store',
        version: '1.0.0',
        dependencies: {
          'react': '^18.3.1',
          'react-dom': '^18.3.1',
        }
      }, null, 2),
      'src/App.tsx': `function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const products = [
    { id: 1, name: 'Acoustic Studio Headphones', price: 249, category: 'Audio', image: '🎧', rating: 4.8 },
    { id: 2, name: 'Minimalist Mechanical Keyboard', price: 179, category: 'Desk', image: '⌨️', rating: 4.9 },
    { id: 3, name: 'Precision Ergonomic Mouse', price: 89, category: 'Desk', image: '🖱️', rating: 4.7 },
    { id: 4, name: 'Smart Ambient Desk Lamp', price: 119, category: 'Lighting', image: '💡', rating: 4.6 },
    { id: 5, name: 'Ultra-Dense Wool Felt Desk Pad', price: 45, category: 'Desk', image: '🪵', rating: 4.9 },
    { id: 6, name: 'Hi-Fi Spatial Desktop Speakers', price: 320, category: 'Audio', image: '🔊', rating: 4.9 },
  ];

  const categories = ['All', 'Desk', 'Audio', 'Lighting'];

  const filtered = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 font-sans flex flex-col">
      <header className="border-b border-stone-800 bg-stone-900/90 sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">⚪</span>
          <span className="font-semibold text-lg tracking-tight">KURA STUDIO</span>
        </div>
        <button 
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="relative bg-stone-800 hover:bg-stone-700 text-stone-200 px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2"
        >
          <span>Cart</span>
          <span className="bg-amber-500 text-black font-bold px-1.5 py-0.2 rounded-full text-[10px]">
            {cart.reduce((a, b) => a + b.qty, 0)}
          </span>
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-6 flex-1 w-full">
        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={\`px-4 py-1.5 rounded-full text-xs font-medium transition-all \${
                selectedCategory === cat 
                  ? 'bg-amber-400 text-stone-950 font-semibold' 
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
              }\`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(product => (
            <div key={product.id} className="bg-stone-800/40 border border-stone-800 rounded-xl p-5 hover:border-stone-700 transition-all flex flex-col justify-between">
              <div>
                <div className="h-40 rounded-lg bg-stone-800 flex items-center justify-center text-5xl mb-4">
                  {product.image}
                </div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-sm text-stone-100">{product.name}</h3>
                  <span className="text-amber-400 font-bold text-sm">\${product.price}</span>
                </div>
                <div className="text-xs text-stone-400 mb-4">{product.category} • ★ {product.rating}</div>
              </div>
              <button 
                onClick={() => addToCart(product)}
                className="w-full bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-200 text-xs font-semibold py-2.5 rounded-lg transition-colors"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-y-0 right-0 w-80 bg-stone-900 border-l border-stone-800 shadow-2xl p-6 z-30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
              <h3 className="font-bold text-sm">Shopping Cart</h3>
              <button onClick={() => setIsCartOpen(false)} className="text-stone-400 hover:text-white text-xs">Close ✕</button>
            </div>
            {cart.length === 0 ? (
              <p className="text-xs text-stone-500 text-center py-12">Your cart is empty.</p>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between text-xs p-2.5 rounded bg-stone-800/50">
                    <div>
                      <div className="font-medium text-stone-200">{item.name}</div>
                      <div className="text-stone-400">\${item.price} × {item.qty}</div>
                    </div>
                    <span className="font-semibold text-stone-100">\${item.price * item.qty}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {cart.length > 0 && (
            <div className="border-t border-stone-800 pt-4">
              <div className="flex justify-between text-sm font-bold mb-4">
                <span>Total</span>
                <span className="text-amber-400">\${total}</span>
              </div>
              <button 
                onClick={() => alert('Order Placed Successfully! Mock checkout complete.')}
                className="w-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs py-3 rounded-lg transition-colors"
              >
                Checkout Now (\${total})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}`,
      'src/index.css': `@import "tailwindcss";`,
    }
  }
];
