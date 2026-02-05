import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  BookOpen, CheckCircle, Trophy, Calendar, Settings, Clock, 
  ChevronRight, Star, Flame, BarChart3, ChevronLeft, Award, 
  Dumbbell, Sun, Moon, Coffee, Brain, Zap, Timer, Play, Pause, RotateCcw,
  Bell, Smartphone, X, Landmark, GraduationCap, PenTool, Hash, Edit3, Save, Plus,
  History, Palette, Sparkles, Layout, RefreshCw, Feather, Rocket, Check, Share, Menu, Download, AlertTriangle, Compass, MoreVertical, PlusSquare,
  Lock, Crown
} from 'lucide-react';

// --- 版本号 ---
const APP_VERSION = "v4.7"; 

// --- 更新日志 ---
const UPDATE_LOGS = [
  { title: "激励机制调整", desc: "XP 里程碑调整为每 500 分触发，庆祝更隆重，奖励更珍贵。" },
  { title: "界面修复", desc: "修复了专注计时器字体过大的问题，适配更多机型。" },
  { title: "功能优化", desc: "新增显眼的徽章图鉴入口，让你的成就一目了然。" },
  { title: "视觉升级", desc: "里程碑弹窗全新设计，红金配色，热烈庆祝你的每一次突破。" }
];

// --- 专注徽章图鉴定义 ---
const BADGE_LIBRARY = [
  { id: 1, count: 1, name: "初次专注", desc: "累计专注 1 小时", icon: Star, color: "#FBBF24" },
  { id: 2, count: 3, name: "渐入佳境", desc: "累计专注 3 小时", icon: Zap, color: "#3B82F6" },
  { id: 3, count: 10, name: "深度沉浸", desc: "累计专注 10 小时", icon: Flame, color: "#EF4444" },
  { id: 4, count: 30, name: "心流大师", desc: "累计专注 30 小时", icon: Award, color: "#8B5CF6" },
  { id: 5, count: 60, name: "自律王者", desc: "累计专注 60 小时", icon: Trophy, color: "#F59E0B" },
  { id: 6, count: 100, name: "上岸传说", desc: "累计专注 100 小时", icon: Crown, color: "#10B981" },
];

// --- 里程碑祝福语 ---
const MILESTONE_WISHES = [
  "星光不负赶路人，你的每一分努力都在发光！",
  "太棒了！你距离上岸又近了一大步！",
  "保持这个节奏，全世界都会为你让路！",
  "乾坤未定，你我皆是黑马，继续冲！",
  "坚持很难，但坚持下来的你真的很酷！",
  "这种执行力，活该你考上！",
  "今天的汗水，就是明天的录取通知书！"
];

const MOTIVATIONAL_QUOTES = [
  "现在的关键不在于计划的完美，而在于执行的坚决。",
  "你背不下来的书，总有人能背下来；你做不出来的题，总有人能做出来。",
  "半山腰总是最挤的，你得去山顶看看。",
  "星光不问赶路人，时光不负有心人。",
  "将来的你，一定会感谢现在拼命的自己。",
  "耐得住寂寞，才守得住繁华。",
  "乾坤未定，你我皆是黑马。",
  "不要假装努力，结果不会陪你演戏。",
  "最痛苦的日子，往往是成长最快的日子。",
  "种一棵树最好的时间是十年前，其次是现在。"
];

const DEFAULT_CONFIGS = {
  kaogong: {
    id: 'kaogong',
    name: '公务员考试',
    icon: Landmark,
    countdownPresets: [120, 150],
    defaultPlan: [
      { time: '08:00', content: '行测：模块专项训练' },
      { time: '14:00', content: '申论：归纳概括训练' },
      { time: '19:00', content: '复盘：整理错题本' }
    ]
  },
  kaoyan: {
    id: 'kaoyan',
    name: '研究生考试',
    icon: GraduationCap,
    countdownPresets: [180],
    defaultPlan: [
      { time: '07:30', content: '英语：单词背诵' },
      { time: '09:00', content: '数学：高强度刷题' },
      { time: '14:00', content: '专业课：核心考点' }
    ]
  },
  jiauzi: {
    id: 'jiauzi',
    name: '教师资格证',
    icon: BookOpen,
    countdownPresets: [120],
    defaultPlan: [
      { time: '09:00', content: '综合素质：文化素养' },
      { time: '14:00', content: '教育教学知识与能力' }
    ]
  },
  certificate: {
    id: 'certificate',
    name: '职业资格证',
    icon: Award,
    countdownPresets: [90, 120],
    defaultPlan: [
      { time: '19:00', content: '核心考点背诵' },
      { time: '21:00', content: '历年真题演练' }
    ]
  },
  custom: {
    id: 'custom',
    name: '自定义考试', 
    icon: PenTool,
    countdownPresets: [60, 90, 120],
    defaultPlan: [
      { time: '08:00', content: '早安，开始新的挑战' },
      { time: '20:00', content: '晚安，复盘今日所学' }
    ]
  }
};

const THEME_PRESETS = [
  { name: '极简白', primary: '#FFFFFF', accent: '#007AFF', badge: '#FF9500', text: '#1D1D1F', bg: '#F2F2F7', cardBg: '#FFFFFF' },
  { name: '暗夜黑', primary: '#1C1C1E', accent: '#0A84FF', badge: '#FFD60A', text: '#F5F5F7', bg: '#000000', cardBg: '#1C1C1E' },
  { name: '抹茶绿', primary: '#F2FCE2', accent: '#3F6212', badge: '#EAB308', text: '#1A2F0A', bg: '#ECFCCB', cardBg: '#FFFFFF' },
  { name: '迷雾灰', primary: '#E5E7EB', accent: '#374151', badge: '#F59E0B', text: '#111827', bg: '#F9FAFB', cardBg: '#FFFFFF' },
  { name: '落日橘', primary: '#FFF7ED', accent: '#EA580C', badge: '#FBBF24', text: '#431407', bg: '#FFEDD5', cardBg: '#FFFFFF' },
];

const ALARM_SOUND = "https://actions.google.com/sounds/v1/alarms/beep_short.ogg";

const getBeijingDate = () => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (3600000 * 8));
};

// --- 高性能礼花特效 ---
const Confetti = React.memo(({ triggerKey }) => {
  const particles = useMemo(() => {
    if (!triggerKey) return []; 
    return [...Array(80)].map((_, i) => ({
      id: i,
      color: ['#FF2D55', '#FF9500', '#FFCC00', '#4CD964', '#5AC8FA', '#007AFF', '#5856D6', '#FF3B30'][Math.floor(Math.random() * 8)],
      width: Math.random() * 10 + 5 + 'px', 
      height: Math.random() * 10 + 5 + 'px',
      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      x: (Math.random() - 0.5) * 200 + 'vw', 
      y: (Math.random() - 0.5) * 150 + 'vh',
      r: Math.random() * 720 + 'deg',
      delay: Math.random() * 0.2 + 's',
      duration: Math.random() * 1.0 + 1.2 + 's',
    }));
  }, [triggerKey]);

  if (!triggerKey) return null;

  return (
    <div key={triggerKey} className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute animate-confetti"
          style={{
            left: '50%',
            top: '50%',
            backgroundColor: p.color,
            width: p.width,
            height: p.height,
            borderRadius: p.borderRadius,
            '--x': p.x,
            '--y': p.y,
            '--r': p.r,
            animationDelay: p.delay,
            animationDuration: p.duration,
            willChange: 'transform, opacity',
          }}
        />
      ))}
      <style>{`
        @keyframes confetti {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          15% { opacity: 1; }
          100% { transform: translate(var(--x), var(--y)) rotate(var(--r)) scale(0.5); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>
    </div>
  );
});

// --- 热烈版里程碑弹窗 ---
const MilestoneModal = ({ xp, onClose }) => {
  const wish = useMemo(() => MILESTONE_WISHES[Math.floor(Math.random() * MILESTONE_WISHES.length)], []);
  
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-lg animate-fadeIn p-6" onClick={onClose}>
      <div 
        className="relative w-full max-w-sm overflow-hidden text-center animate-scaleIn p-8 rounded-[2rem]"
        style={{ background: 'linear-gradient(135deg, #FF3B30 0%, #FF9500 100%)', boxShadow: '0 20px 50px rgba(255, 59, 48, 0.5)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* 放射光芒背景 */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,white_10deg,transparent_20deg,white_30deg,transparent_40deg,white_50deg,transparent_60deg,white_70deg,transparent_80deg,white_90deg,transparent_100deg,white_110deg,transparent_120deg,white_130deg,transparent_140deg,white_150deg,transparent_160deg,white_170deg,transparent_180deg,white_190deg,transparent_200deg,white_210deg,transparent_220deg,white_230deg,transparent_240deg,white_250deg,transparent_260deg,white_270deg,transparent_280deg,white_290deg,transparent_300deg,white_310deg,transparent_320deg,white_330deg,transparent_340deg,white_350deg,transparent_360deg)] animate-spin-slow"></div>
        </div>

        <div className="relative z-10">
          <div className="mb-4 inline-block p-4 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 shadow-xl">
             <Trophy className="w-20 h-20 text-yellow-300 drop-shadow-md animate-bounce" fill="currentColor" />
          </div>
          
          <h2 className="text-5xl font-black text-white mb-1 drop-shadow-md tracking-tight">{xp}</h2>
          <p className="text-sm font-bold text-white/90 mb-8 uppercase tracking-[0.3em]">里程碑达成</p>
          
          <div className="bg-white/95 p-5 rounded-2xl shadow-lg mb-6 transform rotate-1">
            <p className="text-base text-gray-800 font-bold leading-relaxed">"{wish}"</p>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-4 rounded-xl font-bold text-red-600 shadow-xl active:scale-95 transition-transform bg-white hover:bg-gray-50 border-b-4 border-red-200"
          >
            收下祝福，继续冲！
          </button>
        </div>
      </div>
      <style>{`
        @keyframes spin-slow { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
    </div>
  );
};

// --- 徽章图鉴弹窗 ---
const BadgeLibraryModal = ({ currentBadges, onClose }) => {
  return (
    <div className="fixed inset-0 z-[250] bg-gray-50 flex flex-col animate-slideUp">
      <div className="p-5 border-b bg-white shadow-sm flex justify-between items-center z-10 sticky top-0">
        <h2 className="font-bold text-xl text-gray-900 flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-500" /> 专注徽章图鉴
        </h2>
        <button onClick={onClose} className="p-2 bg-gray-100 rounded-full active:scale-90 transition-transform">
          <X className="w-5 h-5 text-gray-600"/>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl mb-8 text-white shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-blue-100 uppercase tracking-wider mb-1">当前拥有</p>
            <p className="text-3xl font-black">{currentBadges} <span className="text-sm font-medium opacity-80">枚</span></p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
             <Award className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider ml-1">成就列表</h3>
          <div className="grid grid-cols-1 gap-4">
            {BADGE_LIBRARY.map((badge) => {
              const isUnlocked = currentBadges >= badge.count;
              return (
                <div 
                  key={badge.id} 
                  className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${isUnlocked ? 'bg-white border-blue-100 shadow-sm' : 'bg-gray-100 border-transparent'}`}
                >
                  <div 
                    className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-transform ${isUnlocked ? 'shadow-md scale-110' : 'bg-gray-200 grayscale'}`}
                    style={{ backgroundColor: isUnlocked ? badge.color : undefined }}
                  >
                    {isUnlocked ? <badge.icon className="w-7 h-7 text-white" /> : <Lock className="w-6 h-6 text-gray-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className={`font-bold ${isUnlocked ? 'text-gray-900' : 'text-gray-400'}`}>{badge.name}</h3>
                      {isUnlocked && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><Check className="w-3 h-3"/> 已点亮</span>}
                    </div>
                    <p className="text-xs text-gray-500">{badge.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <p className="text-center text-xs text-gray-400 mt-8 mb-4">每专注满 1 小时，即可获得 1 枚徽章</p>
      </div>
    </div>
  );
};

// --- 安装教程弹窗 ---
const InstallHelpModal = ({ onClose }) => {
  const [tab, setTab] = useState('ios'); 
  const isIOS = tab === 'ios';
  const themeText = isIOS ? 'text-blue-600' : 'text-green-600';
  const themeBorder = isIOS ? 'border-blue-100' : 'border-green-100';
  const themeBg = isIOS ? 'bg-blue-50' : 'bg-green-50';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl animate-scaleIn flex flex-col max-h-[85vh]">
        <div className="flex p-1.5 bg-gray-100 mx-4 mt-4 rounded-xl">
          <button onClick={() => setTab('ios')} className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${isIOS ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>苹果 iOS</button>
          <button onClick={() => setTab('android')} className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${!isIOS ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>安卓 Android</button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <div className="text-center mb-6">
            <h3 className="text-xl font-extrabold text-gray-900 mb-1">如何安装 App?</h3>
            <p className="text-xs text-gray-400 uppercase tracking-widest">Add to Home Screen</p>
          </div>
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl border-2 ${themeBorder} ${themeBg} flex gap-4 items-start relative`}>
              <div className={`absolute -left-2 -top-2 w-6 h-6 rounded-full ${isIOS ? 'bg-blue-600' : 'bg-green-600'} text-white flex items-center justify-center text-xs font-bold shadow-sm`}>1</div>
              <div className={`p-2 bg-white rounded-xl shadow-sm ${themeText}`}>
                {isIOS ? <Compass className="w-6 h-6" /> : <img src="/vite.svg" className="w-6 h-6 grayscale opacity-50" alt="chrome"/>}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 text-sm mb-1">{isIOS ? '用 Safari 打开' : '用 Chrome 打开'}</h4>
                <p className="text-xs text-gray-500 leading-snug">{isIOS ? '必须使用系统自带 Safari。' : '推荐使用 Chrome 浏览器。'}</p>
              </div>
            </div>
            <div className={`p-4 rounded-2xl border-2 ${themeBorder} ${themeBg} flex gap-4 items-start relative`}>
              <div className={`absolute -left-2 -top-2 w-6 h-6 rounded-full ${isIOS ? 'bg-blue-600' : 'bg-green-600'} text-white flex items-center justify-center text-xs font-bold shadow-sm`}>2</div>
              <div className={`p-2 bg-white rounded-xl shadow-sm ${themeText}`}>
                {isIOS ? <Share className="w-6 h-6" /> : <MoreVertical className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 text-sm mb-1">{isIOS ? '点击底部“分享”' : '点击右上角菜单'}</h4>
                <p className="text-xs text-gray-500 leading-snug">{isIOS ? '找到底部的分享图标。' : '点击右上角的三个点。'}</p>
              </div>
            </div>
            <div className={`p-4 rounded-2xl border-2 ${themeBorder} ${themeBg} flex gap-4 items-start relative`}>
              <div className={`absolute -left-2 -top-2 w-6 h-6 rounded-full ${isIOS ? 'bg-blue-600' : 'bg-green-600'} text-white flex items-center justify-center text-xs font-bold shadow-sm`}>3</div>
              <div className={`p-2 bg-white rounded-xl shadow-sm ${themeText}`}>
                {isIOS ? <PlusSquare className="w-6 h-6" /> : <Download className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 text-sm mb-1">{isIOS ? '添加到主屏幕' : '安装应用'}</h4>
                <p className="text-xs text-gray-500 leading-snug">找到并点击该选项即可。</p>
              </div>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="bg-gray-900 text-white py-4 font-bold text-sm hover:bg-gray-800 transition-colors">我知道了</button>
      </div>
    </div>
  );
};

// --- 更新日志弹窗 ---
const UpdateModal = ({ onClose }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn p-6">
    <div className="bg-white rounded-[2rem] w-full max-w-xs overflow-hidden shadow-2xl animate-scaleIn">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl"></div>
        <Rocket className="w-10 h-10 mx-auto mb-3 animate-bounce" />
        <h2 className="text-xl font-bold">就这样备考 {APP_VERSION}</h2>
      </div>
      <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto">
        {UPDATE_LOGS.map((log, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
            <div>
              <h4 className="text-sm font-bold text-gray-800">{log.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{log.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-6 pt-2">
        <button onClick={onClose} className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-transform bg-gray-900">开启新体验</button>
      </div>
    </div>
  </div>
);

// --- 开屏动画 ---
const SplashScreen = ({ onFinish }) => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    setTimeout(() => setStep(1), 600);
    setTimeout(() => setStep(2), 1800);
    setTimeout(() => setStep(3), 3200);
    setTimeout(onFinish, 4000);
  }, []);
  if (step === 4) return null;
  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-opacity duration-1000 ${step === 3 ? 'opacity-0' : 'opacity-100'}`}>
      <div className={`transition-all duration-1000 transform flex flex-col items-center ${step >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="p-5 bg-gray-900 rounded-[2rem] mb-8 shadow-2xl"><Feather className="w-16 h-16 text-white" /></div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">就这样备考</h1>
      </div>
      <div className={`mt-6 transition-all duration-1000 delay-300 transform ${step >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <p className="text-sm font-medium text-gray-400 tracking-[0.2em] uppercase">你的专属定制化 App</p>
      </div>
    </div>
  );
};

// --- 徽章展示组件 (点击可查看图鉴) ---
const BadgeWall = ({ count, color }) => {
  const safeCount = Math.max(0, parseInt(count) || 0);
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-8 animate-fadeIn max-w-[90%] mx-auto">
      {[...Array(safeCount)].map((_, i) => (
        <div key={i} className="relative group animate-popIn" style={{ animationDelay: `${i * 0.05}s` }}>
          <Award className="w-6 h-6 drop-shadow-sm" style={{ color: color }} fill="currentColor" />
        </div>
      ))}
      {safeCount === 0 && (
        <div className="text-xs text-white/50 font-bold uppercase tracking-wider">暂无徽章，开始专注吧</div>
      )}
    </div>
  );
};

// --- 计时器组件 ---
const TimerView = ({ theme, examType, badges, onAddBadge }) => {
  const [mode, setMode] = useState('stopwatch'); 
  const [isActive, setIsActive] = useState(false);
  const [displaySeconds, setDisplaySeconds] = useState(0);
  const [countdownInitial, setCountdownInitial] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(30);
  const [historyMinutes, setHistoryMinutes] = useState(null); 
  const [showLibrary, setShowLibrary] = useState(false);
  
  const startTimeRef = useRef(0);
  const endTimeRef = useRef(0);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => { 
    audioRef.current = new Audio(ALARM_SOUND);
    const savedHistory = localStorage.getItem('timer_history');
    if (savedHistory) setHistoryMinutes(parseInt(savedHistory));
  }, []);

  const currentConfig = DEFAULT_CONFIGS[examType] || DEFAULT_CONFIGS['kaogong'];
  const presets = currentConfig.countdownPresets;

  const startTimer = () => {
    if ('Notification' in window && Notification.permission !== 'granted') Notification.requestPermission();
    setIsActive(true);
    if (mode === 'stopwatch') {
      startTimeRef.current = Date.now() - (displaySeconds * 1000);
    } else {
      const initial = countdownInitial > 0 ? countdownInitial : (presets[0] * 60);
      if (countdownInitial === 0) setCountdownInitial(initial);
      endTimeRef.current = Date.now() + (displaySeconds > 0 ? displaySeconds * 1000 : initial * 1000);
    }

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      if (mode === 'stopwatch') {
        const elapsed = Math.floor((now - startTimeRef.current) / 1000);
        setDisplaySeconds(elapsed);
        if (elapsed > 0 && elapsed % 3600 === 0) {
           onAddBadge();
           if(audioRef.current) audioRef.current.play().catch(()=>{});
        }
      } else {
        const remaining = Math.ceil((endTimeRef.current - now) / 1000);
        if (remaining <= 0) {
          clearInterval(intervalRef.current);
          setIsActive(false);
          setDisplaySeconds(0);
          new Notification("时间到！", { body: "模考结束，请立即停笔！" });
          if(audioRef.current) audioRef.current.play().catch(()=>{});
        } else {
          setDisplaySeconds(remaining);
        }
      }
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
    setDisplaySeconds(mode === 'stopwatch' ? 0 : countdownInitial);
  };

  const setPreset = (mins) => {
    setCountdownInitial(mins * 60);
    setDisplaySeconds(mins * 60);
    setIsActive(false);
    if (!presets.includes(mins)) {
      setHistoryMinutes(mins);
      localStorage.setItem('timer_history', mins);
    }
  };

  const formatTime = (totalSeconds) => {
    const safeSeconds = Math.max(0, parseInt(totalSeconds) || 0); 
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const secs = safeSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pb-24 space-y-6 animate-fadeIn">
      {showLibrary && <BadgeLibraryModal currentBadges={badges} onClose={() => setShowLibrary(false)} theme={theme} />}

      <div 
        className="rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden transition-all duration-500 flex flex-col items-center justify-center min-h-[420px]"
        style={{ backgroundColor: theme.cardBg === '#FFFFFF' && theme.bg !== '#000000' ? '#FFFFFF' : theme.cardBg }}
      >
        <div className="absolute top-0 left-0 w-full h-1.5 opacity-20" style={{ backgroundColor: theme.accent }}></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full opacity-5 blur-3xl" style={{ backgroundColor: theme.accent }}></div>
        
        <div className="flex justify-center gap-1 mb-8 bg-gray-100/50 p-1.5 rounded-full w-fit backdrop-blur-md">
          <button 
            onClick={() => { setMode('stopwatch'); setIsActive(false); setDisplaySeconds(0); }}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${mode === 'stopwatch' ? 'bg-white shadow-md scale-100 text-black' : 'text-gray-400 hover:text-gray-600'}`}
          >
            正计时
          </button>
          <button 
            onClick={() => { setMode('countdown'); setIsActive(false); setDisplaySeconds(countdownInitial || presets[0]*60); }}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${mode === 'countdown' ? 'bg-white shadow-md scale-100 text-black' : 'text-gray-400 hover:text-gray-600'}`}
          >
            倒计时
          </button>
        </div>

        {/* 完美居中 + 智能缩放字体 (解决大屏溢出) */}
        <div className="flex flex-col items-center justify-center w-full text-center mb-6">
          <div className="font-mono font-bold tracking-tight tabular-nums drop-shadow-sm transition-colors w-full text-center" 
               style={{ 
                 color: theme.text, 
                 fontSize: 'clamp(3rem, 12vw, 5.5rem)', // 关键修复：最小3rem，最大5.5rem，中间随屏幕宽自适应
                 lineHeight: '1.1' 
               }}>
            {formatTime(displaySeconds)}
          </div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase opacity-40 text-center w-full mt-2" style={{ color: theme.text }}>
            {isActive ? (mode === 'stopwatch' ? '专 注 中' : '进 行 中') : '已 暂 停'}
          </p>
        </div>

        {mode === 'stopwatch' && (
          <div className="flex flex-col items-center w-full">
            <BadgeWall count={badges} color={theme.badge} />
            <button 
              onClick={() => setShowLibrary(true)}
              className="mt-4 text-[10px] font-bold px-3 py-1.5 rounded-full bg-gray-100/50 hover:bg-gray-100 text-gray-500 flex items-center gap-1 transition-colors"
            >
              <Award className="w-3 h-3" /> 查看徽章图鉴
            </button>
          </div>
        )}

        <div className="flex justify-center gap-8 items-center mt-10 w-full">
          <button 
            onClick={isActive ? pauseTimer : startTimer}
            className="w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl active:scale-95 transition-all hover:scale-105"
            style={{ backgroundColor: theme.accent }}
          >
            {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>
          <button 
            onClick={resetTimer}
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all hover:bg-gray-50 border border-gray-100"
            style={{ backgroundColor: theme.cardBg, color: theme.text }}
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {mode === 'countdown' && (
        <div className="rounded-3xl p-6 border shadow-sm animate-slideUp" style={{ backgroundColor: theme.cardBg, borderColor: 'rgba(0,0,0,0.05)' }}>
          <h3 className="font-bold mb-5 flex items-center gap-2 text-sm opacity-80" style={{ color: theme.text }}>
            <Clock className="w-4 h-4" style={{ color: theme.accent }} /> 模考时长选择
          </h3>
          <div className="flex flex-wrap gap-3 mb-6">
            {presets.map(min => (
              <button
                key={min}
                onClick={() => setPreset(min)}
                className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all border-2 flex-1 min-w-[80px] shadow-sm active:scale-95`}
                style={
                  displaySeconds === min * 60 && !isActive
                  ? { backgroundColor: theme.accent, color: '#fff', borderColor: theme.accent }
                  : { backgroundColor: 'transparent', color: theme.text, borderColor: 'rgba(0,0,0,0.1)' }
                }
              >
                {min}分
              </button>
            ))}
            {historyMinutes && !presets.includes(historyMinutes) && (
              <button
                onClick={() => setPreset(historyMinutes)}
                className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all border-2 flex-1 min-w-[80px] flex items-center justify-center gap-1 shadow-sm active:scale-95`}
                style={
                  displaySeconds === historyMinutes * 60 && !isActive
                  ? { backgroundColor: theme.accent, color: '#fff', borderColor: theme.accent }
                  : { backgroundColor: 'transparent', color: theme.text, borderColor: 'rgba(0,0,0,0.1)' }
                }
              >
                <History className="w-3 h-3" /> {historyMinutes}分
              </button>
            )}
          </div>
          <div className="relative">
            <input 
              type="number" 
              placeholder="自定义时长..."
              value={customMinutes}
              onChange={(e) => setCustomMinutes(Number(e.target.value))}
              className="w-full bg-gray-50/50 border-2 border-transparent rounded-2xl py-4 pl-5 pr-24 text-lg font-bold outline-none focus:bg-white focus:border-gray-200 transition-all"
              style={{ color: theme.text }}
            />
            <button 
              onClick={() => setPreset(customMinutes)}
              className="absolute right-2 top-2 bottom-2 px-5 rounded-xl font-bold text-sm text-white shadow-md active:scale-95 transition-transform"
              style={{ backgroundColor: theme.accent }}
            >
              开始
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- 全新交互式计划编辑器 ---
const SmartPlanEditor = ({ schedule, setSchedule, theme, onClose }) => {
  const [activeTab, setActiveTab] = useState('interactive');
  const [selectedDay, setSelectedDay] = useState(1);
  const [importText, setImportText] = useState('');

  const currentDayPlan = schedule.find(d => d.day === selectedDay) || { tasks: [] };

  const updateTask = (idx, field, value) => {
    const newSchedule = schedule.map(day => {
      if (day.day === selectedDay) {
        const newTasks = [...day.tasks];
        newTasks[idx] = { ...newTasks[idx], [field]: value };
        return { ...day, tasks: newTasks };
      }
      return day;
    });
    setSchedule(newSchedule);
  };

  const addTask = () => {
    const newSchedule = schedule.map(day => {
      if (day.day === selectedDay) {
        return { ...day, tasks: [...day.tasks, { time: '08:00', content: '' }] };
      }
      return day;
    });
    setSchedule(newSchedule);
  };

  const removeTask = (idx) => {
    const newSchedule = schedule.map(day => {
      if (day.day === selectedDay) {
        const newTasks = day.tasks.filter((_, i) => i !== idx);
        return { ...day, tasks: newTasks };
      }
      return day;
    });
    setSchedule(newSchedule);
  };

  const handleImport = () => {
    const lines = importText.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return alert('请输入内容');
    const newTasks = lines.map((line, idx) => ({ time: `任务${idx+1}`, content: line.trim() }));
    const newSchedule = schedule.map(day => ({ ...day, tasks: newTasks }));
    if(window.confirm('这将覆盖所有日期的计划，确定吗？')) {
      setSchedule(newSchedule);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col animate-slideUp">
      <div className="p-4 border-b flex justify-between items-center shadow-sm z-10" style={{ backgroundColor: theme.primary }}>
        <h2 className="font-bold text-lg flex items-center gap-2" style={{ color: theme.name === '暗夜黑' ? 'white' : theme.text }}><Edit3 className="w-5 h-5"/> 编辑计划</h2>
        <button onClick={onClose} className="p-2 bg-black/10 rounded-full active:scale-90 transition-transform"><X className="w-5 h-5" style={{ color: theme.name === '暗夜黑' ? 'white' : theme.text }}/></button>
      </div>

      <div className="flex bg-white shadow-sm mb-2">
        <button onClick={() => setActiveTab('interactive')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'interactive' ? '' : 'border-transparent text-gray-400'}`} style={activeTab === 'interactive' ? { borderColor: theme.accent, color: theme.accent } : {}}>交互模式</button>
        <button onClick={() => setActiveTab('import')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'import' ? '' : 'border-transparent text-gray-400'}`} style={activeTab === 'import' ? { borderColor: theme.accent, color: theme.accent } : {}}>文本导入</button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'interactive' ? (
          <>
            <div className="bg-white p-3 shadow-sm z-0 border-b border-gray-100">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x px-2">
                {schedule.map((day) => (
                  <button 
                    key={day.day}
                    onClick={() => setSelectedDay(day.day)}
                    className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center snap-center transition-all border-2 ${selectedDay === day.day ? 'shadow-lg scale-105' : 'border-transparent bg-gray-50 opacity-60'}`}
                    style={selectedDay === day.day ? { borderColor: theme.accent, backgroundColor: 'white' } : {}}
                  >
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Day</span>
                    <span className="text-2xl font-black font-mono" style={{ color: selectedDay === day.day ? theme.accent : '#999' }}>{day.day}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {currentDayPlan.tasks.map((task, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center animate-fadeIn">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                      <Clock className="w-3 h-3 text-gray-400"/>
                    </div>
                    <input 
                      type="time" 
                      value={task.time.includes(':') ? task.time : '08:00'}
                      onChange={(e) => updateTask(idx, 'time', e.target.value)}
                      className="w-24 pl-7 pr-2 py-2 bg-gray-50 border-0 rounded-xl text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 transition-shadow"
                    />
                  </div>
                  <input 
                    type="text" 
                    value={task.content}
                    onChange={(e) => updateTask(idx, 'content', e.target.value)}
                    placeholder="输入任务内容..."
                    className="flex-1 py-2 bg-transparent border-b border-gray-100 focus:border-blue-400 outline-none text-sm text-gray-700 font-medium"
                  />
                  <button onClick={() => removeTask(idx)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><X className="w-5 h-5"/></button>
                </div>
              ))}
              
              <button 
                onClick={addTask}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 font-bold text-sm flex items-center justify-center gap-2 hover:border-gray-400 hover:text-gray-500 transition-all hover:bg-gray-50"
              >
                <Plus className="w-5 h-5"/> 添加新任务
              </button>
            </div>
          </>
        ) : (
          <div className="p-4 h-full flex flex-col">
            <textarea 
              className="flex-1 w-full p-4 border rounded-2xl resize-none focus:outline-none focus:ring-2 text-sm leading-relaxed"
              style={{ '--tw-ring-color': theme.primary }}
              placeholder={`请直接粘贴文本内容：\n\n8:00 晨读\n9:00 刷题\n...`}
              value={importText}
              onChange={e => setImportText(e.target.value)}
            />
            <button 
              onClick={handleImport}
              className="w-full py-4 mt-4 rounded-xl text-white font-bold shadow-lg active:scale-95 transition-transform"
              style={{ backgroundColor: theme.accent }}
            >
              一键生成
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- 主应用 ---
export default function ExamPrepApp() {
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  
  const [examType, setExamType] = useState('kaogong');
  const [customExamName, setCustomExamName] = useState('自定义考试'); // 专门存储自定义名字
  const [targetDate, setTargetDate] = useState('2026-03-14');
  const [theme, setTheme] = useState(THEME_PRESETS[0]);
  
  const [schedule, setSchedule] = useState([]);
  const [completedTasks, setCompletedTasks] = useState({}); 
  const [xp, setXp] = useState(0);
  const [badges, setBadges] = useState(0);
  
  const [confettiTrigger, setConfettiTrigger] = useState(0); // Use counter for trigger
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false); // 控制安装指南
  const [showMilestone, setShowMilestone] = useState(false); // 里程碑弹窗

  // --- 初始化与版本检测 ---
  useEffect(() => {
    const savedConfig = JSON.parse(localStorage.getItem('user_config_v4') || '{}');
    if (savedConfig.theme) setTheme(savedConfig.theme);
    if (savedConfig.examType) setExamType(savedConfig.examType);
    if (savedConfig.customExamName) setCustomExamName(savedConfig.customExamName); // 读取自定义名
    if (savedConfig.targetDate) setTargetDate(savedConfig.targetDate);
    if (savedConfig.badges) setBadges(savedConfig.badges);
    
    const savedSchedule = JSON.parse(localStorage.getItem('user_schedule_v4'));
    if (savedSchedule) {
      setSchedule(savedSchedule);
    } else {
      generateSchedule(savedConfig.examType || 'kaogong');
    }
    setCompletedTasks(JSON.parse(localStorage.getItem('completed_tasks_v4') || '{}'));
    // 恢复XP
    const savedXp = parseInt(localStorage.getItem('user_xp_v4') || '0');
    setXp(savedXp);

    // 检查版本号，显示更新弹窗
    const lastVersion = localStorage.getItem('app_version');
    if (lastVersion !== APP_VERSION) {
      setShowUpdateModal(true);
      localStorage.setItem('app_version', APP_VERSION);
    }
  }, []);

  // --- 动态设置状态栏颜色 (沉浸式体验) ---
  useEffect(() => {
    let metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.name = "theme-color";
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = theme.bg;
  }, [theme]);

  // --- 自动提醒 ---
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') return;
    const checkReminders = () => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
      const todayTasks = schedule[0]?.tasks || [];
      todayTasks.forEach((task, idx) => {
        const key = `notified_${new Date().toDateString()}_${idx}`;
        if (task.time === timeStr && !sessionStorage.getItem(key)) {
          new Notification("学习提醒 🔔", { body: `是时候开始：${task.content}`, icon: '/vite.svg', vibrate: [200, 100, 200] });
          sessionStorage.setItem(key, 'true');
        }
      });
    };
    const interval = setInterval(checkReminders, 20000);
    return () => clearInterval(interval);
  }, [schedule]);

  const generateSchedule = (type) => {
    const template = DEFAULT_CONFIGS[type]?.defaultPlan || DEFAULT_CONFIGS['kaogong'].defaultPlan;
    const newSchedule = Array.from({ length: 60 }, (_, i) => ({
      day: i + 1,
      quote: MOTIVATIONAL_QUOTES[i % MOTIVATIONAL_QUOTES.length], 
      tasks: template.map(t => ({ ...t }))
    }));
    setSchedule(newSchedule);
  };

  useEffect(() => {
    const config = { theme, examType, customExamName, targetDate, badges };
    localStorage.setItem('user_config_v4', JSON.stringify(config));
    localStorage.setItem('user_schedule_v4', JSON.stringify(schedule));
    localStorage.setItem('completed_tasks_v4', JSON.stringify(completedTasks));
    localStorage.setItem('user_xp_v4', xp.toString());
  }, [theme, examType, customExamName, targetDate, badges, schedule, completedTasks, xp]);

  const daysLeft = useMemo(() => {
    const today = getBeijingDate();
    today.setHours(0,0,0,0);
    const target = new Date(targetDate);
    target.setHours(0,0,0,0);
    const diff = target - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [targetDate]);

  const currentDayData = schedule[0] || { tasks: [], quote: '' };

  // --- XP 处理核心逻辑 ---
  const toggleTask = (dayIdx, taskIdx) => {
    const key = `${dayIdx}-${taskIdx}`;
    const isComplete = !!completedTasks[key];
    const newState = !isComplete; // Toggle state

    setCompletedTasks(prev => ({ ...prev, [key]: newState }));
    
    if (newState) {
      // 任务完成：加分 + 礼花 + 检查里程碑
      setConfettiTrigger(Date.now()); // Update key to force re-render confetti
      setXp(prev => {
        const newXp = prev + 50;
        // 检查里程碑 (每满 500 分)
        if (newXp > 0 && newXp % 500 === 0) {
          setShowMilestone(true);
        }
        return newXp;
      });
    } else {
      // 任务取消：扣分 (最低0分)
      setXp(prev => Math.max(0, prev - 50));
    }
  };

  const handleRefresh = () => { if(window.confirm('确定要检查更新吗？')) window.location.reload(true); };

  if (loading) return <SplashScreen onFinish={() => setLoading(false)} />;

  const currentExamName = examType === 'custom' ? customExamName : DEFAULT_CONFIGS[examType]?.name;

  // 汉化颜色标签的映射表
  const colorLabels = {
    primary: "主色调",
    accent: "强调色",
    badge: "徽章色"
  };

  return (
    <div className="min-h-screen font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden" style={{ backgroundColor: theme.bg, color: theme.text }}>
      {showUpdateModal && <UpdateModal onClose={() => setShowUpdateModal(false)} />}
      {showInstallHelp && <InstallHelpModal onClose={() => setShowInstallHelp(false)} />}
      {showMilestone && <MilestoneModal xp={xp} onClose={() => setShowMilestone(false)} />}
      
      <Confetti triggerKey={confettiTrigger} />

      {isEditingPlan && (
        <SmartPlanEditor 
          schedule={schedule} 
          setSchedule={setSchedule} 
          theme={theme} 
          onClose={() => setIsEditingPlan(false)} 
        />
      )}

      <div className="h-screen overflow-y-auto scrollbar-hide">
        <div className="p-5 pt-8">
           {/* Header */}
           <div className="flex justify-between items-center mb-8 animate-slideDown">
             <div className="flex items-center gap-3">
               <div className="p-2.5 rounded-2xl shadow-lg transition-transform hover:scale-105" style={{ backgroundColor: theme.primary }}>
                 <Feather className="w-6 h-6" style={{ color: theme.accent }} />
               </div>
               <div>
                 <h1 className="font-extrabold text-xl leading-none tracking-tight" style={{ color: theme.text }}>
                   就这样备考
                 </h1>
                 <p className="text-[10px] font-bold tracking-widest uppercase mt-1 opacity-50" style={{ color: theme.text }}>
                   {currentExamName}
                 </p>
               </div>
             </div>
             <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-sm border border-black/5">
               <Award className="w-4 h-4" style={{ color: theme.badge }} />
               <span className="text-xs font-bold opacity-70">{xp}</span>
             </div>
           </div>

           {/* Views */}
           {currentView === 'dashboard' && (
             <div className="animate-fadeIn pb-24 space-y-6">
               <div 
                 className="rounded-[2rem] p-6 shadow-xl relative overflow-hidden transition-all duration-500 group min-h-[180px] flex flex-col justify-center"
                 style={{ backgroundColor: theme.cardBg === '#FFFFFF' ? theme.primary : theme.cardBg }}
               >
                 <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                 <div className="flex justify-between items-center relative z-10">
                   <div>
                     <p className="text-xs font-bold mb-1 tracking-wider uppercase opacity-60" style={{ color: theme.text }}>距离目标日</p>
                     <h1 className="text-6xl font-black tracking-tighter" style={{ color: theme.accent }}>{daysLeft >= 0 ? daysLeft : 0}<span className="text-xl font-medium ml-1 opacity-60">天</span></h1>
                   </div>
                   <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md shadow-inner">
                     <Trophy className="w-8 h-8" style={{ color: theme.badge }} />
                   </div>
                 </div>
                 <div className="mt-4 pt-4 border-t border-black/5 text-left w-full">
                   <p className="text-sm font-medium opacity-90 leading-relaxed break-words" style={{ color: theme.text }}>"{currentDayData.quote}"</p>
                 </div>
               </div>

               <div className="space-y-4">
                 <div className="flex items-center justify-between px-1">
                   <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: theme.text }}>
                     <Calendar className="w-5 h-5" style={{ color: theme.accent }} /> 今日计划
                   </h2>
                   <button onClick={() => setIsEditingPlan(true)} className="text-xs font-bold px-4 py-1.5 bg-white rounded-full shadow-sm text-gray-500 hover:text-gray-800 transition-all active:scale-95">调整</button>
                 </div>
                 
                 {currentDayData.tasks.map((task, idx) => {
                   const isDone = completedTasks[`${currentDayData.day}-${idx}`];
                   return (
                     <div 
                       key={idx} 
                       onClick={() => toggleTask(currentDayData.day, idx)}
                       className={`relative p-5 rounded-3xl border-2 transition-all active:scale-98 duration-200 cursor-pointer shadow-sm group ${isDone ? 'bg-gray-50 border-transparent opacity-60 grayscale' : 'bg-white border-transparent hover:border-gray-100 hover:shadow-md'}`}
                     >
                       <div className="flex justify-between items-center">
                         <div className="flex-1">
                           <div className="flex items-center gap-3 mb-1">
                             <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-gray-100 text-gray-500">
                               {task.time}
                             </span>
                           </div>
                           <p className={`text-sm font-bold leading-relaxed ${isDone ? 'line-through' : ''}`} style={{ color: theme.text }}>
                             {task.content}
                           </p>
                         </div>
                         <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${isDone ? 'border-transparent' : 'border-gray-200'}`} style={isDone ? { backgroundColor: theme.accent } : {}}>
                           {isDone && <CheckCircle className="w-5 h-5 text-white" />}
                         </div>
                       </div>
                     </div>
                   )
                 })}
               </div>
             </div>
           )}

           {currentView === 'schedule' && (
             <div className="space-y-4 pb-24 animate-fadeIn">
               <h2 className="text-xl font-bold px-1" style={{ color: theme.text }}>全景作战地图</h2>
               {schedule.map((day, idx) => (
                 <div key={idx} className="p-5 rounded-3xl bg-white shadow-sm border border-gray-50 hover:shadow-md transition-all duration-300">
                   <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-2">
                     <span className="font-extrabold text-sm px-3 py-1 rounded-full bg-gray-50" style={{ color: theme.accent }}>Day {day.day}</span>
                     <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">Mission List</span>
                   </div>
                   <div className="space-y-3">
                     {day.tasks.map((t, ti) => (
                       <div key={ti} className="text-xs flex gap-3 items-start">
                         <span className="font-mono text-gray-400 font-bold min-w-[40px] pt-0.5">{t.time}</span>
                         <span className="font-medium text-gray-600 leading-relaxed">{t.content}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               ))}
             </div>
           )}

           {currentView === 'timer' && (
             <TimerView 
               theme={theme} 
               examType={examType}
               badges={badges}
               onAddBadge={() => setBadges(b => b + 1)}
             />
           )}

           {currentView === 'settings' && (
             <div className="space-y-8 animate-fadeIn pb-24">
                {/* 备考项目与自定义 */}
                <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-200">
                  <h3 className="font-bold mb-4 text-gray-900 text-lg">备考项目</h3>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {Object.entries(DEFAULT_CONFIGS).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => { setExamType(key); generateSchedule(key); }}
                        className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all relative overflow-hidden ${examType === key ? 'bg-gray-50' : 'bg-transparent border-gray-200 hover:bg-gray-50'}`}
                        style={examType === key ? { borderColor: theme.accent } : {}}
                      >
                        <config.icon className="w-6 h-6" style={{ color: examType === key ? theme.accent : '#ccc' }} />
                        <span className="text-xs font-bold text-gray-600 z-10">{config.name}</span>
                        {key === 'custom' && examType === 'custom' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-xs font-bold text-blue-500">点击编辑名称</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {/* 自定义名称编辑框 (优化样式) */}
                  {examType === 'custom' && (
                    <div className="animate-slideUp bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                      <PenTool className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-gray-400 block mb-1 uppercase tracking-wider">Custom Exam Name</label>
                        <input 
                          type="text" 
                          value={customExamName}
                          onChange={(e) => setCustomExamName(e.target.value)}
                          className="w-full bg-transparent border-b-2 border-gray-200 py-1 text-sm font-bold text-gray-800 outline-none focus:border-blue-500 transition-colors"
                          placeholder="例如：注册会计师"
                        />
                      </div>
                    </div>
                  )}
                </section>

                <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-200">
                  <h3 className="font-bold mb-4 text-gray-900 text-lg">主题风格</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {THEME_PRESETS.map((t, i) => (
                      <button 
                        key={i}
                        onClick={() => setTheme(t)}
                        className={`w-full aspect-square rounded-full border transition-transform hover:scale-110 shadow-sm flex items-center justify-center ${theme.name === t.name ? 'ring-2 ring-offset-2 ring-gray-300 scale-110' : 'border-gray-100'}`}
                        style={{ backgroundColor: t.primary }}
                        title={t.name}
                      >
                        {theme.name === t.name && <CheckCircle className="w-4 h-4 text-white drop-shadow-md" />}
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">配色微调</p>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                      {['primary', 'accent', 'badge'].map(key => (
                        <div key={key} className="flex-shrink-0 flex flex-col items-center gap-2">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-sm border border-gray-100">
                            <input type="color" value={theme[key]} onChange={e => setTheme({...theme, [key]: e.target.value})} className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"/>
                          </div>
                          {/* 汉化标签 */}
                          <span className="text-[10px] text-gray-400 capitalize">{colorLabels[key]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-200">
                  <h3 className="font-bold mb-4 text-gray-900 text-lg">目标设定</h3>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                    <span className="text-sm text-gray-500 font-medium ml-2">考试日期</span>
                    <input 
                      type="date" 
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="bg-white border-0 rounded-lg py-2 px-3 text-sm font-bold text-gray-800 outline-none shadow-sm"
                    />
                  </div>
                </section>
                
                <div className="text-center pt-8 pb-4 space-y-3">
                  <button 
                    onClick={() => setShowInstallHelp(true)}
                    className="text-xs flex items-center justify-center gap-2 mx-auto text-blue-500 font-bold bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    <Download className="w-3 h-3" /> 如何安装到手机?
                  </button>
                  <button 
                    onClick={handleRefresh}
                    className="text-[10px] flex items-center justify-center gap-1 mx-auto text-gray-400 font-medium hover:text-gray-600 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" /> 检查更新 ({APP_VERSION})
                  </button>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* 底部导航栏 */}
      <div className="absolute bottom-0 left-0 right-0 px-8 py-5 flex justify-between items-center z-40 safe-area-bottom bg-white/90 backdrop-blur-lg border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        {[
          { id: 'dashboard', icon: Clock, label: '今日' },
          { id: 'schedule', icon: Calendar, label: '全景' },
          { id: 'timer', icon: Timer, label: '专注' },
          { id: 'settings', icon: Settings, label: '我的' }
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 group ${currentView === item.id ? '-translate-y-1' : 'opacity-40 hover:opacity-70'}`}
          >
            <item.icon 
              className="w-6 h-6 transition-colors" 
              style={{ color: currentView === item.id ? theme.accent : '#000' }} 
              fill={currentView === item.id ? theme.accent : 'none'}
              fillOpacity={currentView === item.id ? 0.2 : 0}
            />
            <span className="text-[10px] font-bold tracking-wide" style={{ color: currentView === item.id ? theme.accent : '#000' }}>{item.label}</span>
          </button>
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideDown { animation: slideDown 0.5s ease-out forwards; }
        @keyframes popIn { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
        .animate-popIn { animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-scaleIn { animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
      `}</style>
    </div>
  );
}