import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  BookOpen, CheckCircle, Trophy, Calendar, Settings, Clock, 
  ChevronRight, Star, Flame, BarChart3, ChevronLeft, Award, 
  Dumbbell, Sun, Moon, Coffee, Brain, Zap, Timer, Play, Pause, RotateCcw,
  Bell, Smartphone, X, Landmark, GraduationCap, PenTool, Hash, Edit3, Save, Plus,
  History, Palette, Sparkles, Layout
} from 'lucide-react';

// --- 励志文案库 (系统自动分配) ---
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

// --- 默认配置模板 ---
const DEFAULT_CONFIGS = {
  kaogong: {
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
    name: '教师资格证',
    icon: BookOpen,
    countdownPresets: [120],
    defaultPlan: [
      { time: '09:00', content: '综合素质：文化素养' },
      { time: '14:00', content: '教育教学知识与能力' }
    ]
  },
  certificate: {
    name: '职业资格证',
    icon: Award,
    countdownPresets: [90, 120],
    defaultPlan: [
      { time: '19:00', content: '核心考点背诵' },
      { time: '21:00', content: '历年真题演练' }
    ]
  }
};

// --- 高级主题预设 ---
const THEME_PRESETS = [
  { name: '静谧深海 (默认)', primary: '#0f172a', accent: '#38bdf8', badge: '#fbbf24', text: '#1e293b', bg: '#f1f5f9' },
  { name: '森之呼吸', primary: '#14532d', accent: '#4ade80', badge: '#facc15', text: '#1a2e05', bg: '#f0fdf4' },
  { name: '极简黑白', primary: '#000000', accent: '#666666', badge: '#000000', text: '#000000', bg: '#ffffff' },
  { name: '落日余晖', primary: '#9a3412', accent: '#fb923c', badge: '#fde047', text: '#431407', bg: '#fff7ed' },
  { name: '皇家紫金', primary: '#581c87', accent: '#c084fc', badge: '#fde047', text: '#3b0764', bg: '#faf5ff' },
];

const ALARM_SOUND = "https://actions.google.com/sounds/v1/alarms/beep_short.ogg";

const getBeijingDate = () => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (3600000 * 8));
};

// --- 开屏动画 ---
const SplashScreen = ({ onFinish }) => {
  const [text, setText] = useState('');
  const fullText = "就这样备考，你的专属定制化备考app";
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      if (idx <= fullText.length) {
        setText(fullText.slice(0, idx));
        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setOpacity(0);
          setTimeout(onFinish, 800); // Wait for fade out
        }, 1000);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  if (opacity === 0) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-opacity duration-700"
      style={{ opacity }}
    >
      <div className="p-4 bg-black rounded-2xl mb-6 shadow-2xl">
        <Sparkles className="w-12 h-12 text-yellow-400 animate-pulse" />
      </div>
      <h1 className="text-xl font-bold text-gray-800 tracking-widest">{text}<span className="animate-blink">|</span></h1>
      <style>{`.animate-blink { animation: blink 1s infinite; } @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
    </div>
  );
};

// --- 徽章展示组件 ---
const BadgeWall = ({ count, color }) => {
  if (count === 0) return null;
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-6 animate-fadeIn max-w-[80%] mx-auto">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="relative group animate-popIn" style={{ animationDelay: `${i * 0.05}s` }}>
          <Award className="w-6 h-6 drop-shadow-md" style={{ color: color }} fill="currentColor" />
        </div>
      ))}
      <div className="w-full text-center text-xs mt-2 opacity-60 font-medium tracking-wide">
        已获得 {count} 枚专注徽章
      </div>
    </div>
  );
};

// --- 计时器组件 (修正居中与历史记录) ---
const TimerView = ({ theme, examType, badges, onAddBadge }) => {
  const [mode, setMode] = useState('stopwatch'); 
  const [isActive, setIsActive] = useState(false);
  const [displaySeconds, setDisplaySeconds] = useState(0);
  const [countdownInitial, setCountdownInitial] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(30);
  const [historyMinutes, setHistoryMinutes] = useState(null); // 历史记录
  
  const startTimeRef = useRef(0);
  const endTimeRef = useRef(0);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => { 
    audioRef.current = new Audio(ALARM_SOUND);
    const savedHistory = localStorage.getItem('timer_history');
    if (savedHistory) setHistoryMinutes(parseInt(savedHistory));
  }, []);

  const presets = DEFAULT_CONFIGS[examType]?.countdownPresets || [60];

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
           new Notification("专注达成！", { body: "你太棒了！获得一枚徽章！" });
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
    // Save to history if not standard
    if (!presets.includes(mins)) {
      setHistoryMinutes(mins);
      localStorage.setItem('timer_history', mins);
    }
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pb-24 space-y-6 animate-fadeIn">
      <div 
        className="rounded-3xl p-8 shadow-xl relative overflow-hidden transition-all duration-500 flex flex-col items-center"
        style={{ backgroundColor: theme.primary }}
      >
        <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: theme.accent, opacity: 0.5 }}></div>
        
        <div className="flex justify-center gap-3 mb-10 bg-white/10 p-1.5 rounded-full w-fit backdrop-blur-md border border-white/10">
          <button 
            onClick={() => { setMode('stopwatch'); setIsActive(false); setDisplaySeconds(0); }}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === 'stopwatch' ? 'text-white shadow-lg scale-105' : 'text-white/60 hover:text-white'}`}
            style={mode === 'stopwatch' ? { backgroundColor: theme.accent } : {}}
          >
            正计时
          </button>
          <button 
            onClick={() => { setMode('countdown'); setIsActive(false); setDisplaySeconds(countdownInitial || presets[0]*60); }}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === 'countdown' ? 'text-white shadow-lg scale-105' : 'text-white/60 hover:text-white'}`}
            style={mode === 'countdown' ? { backgroundColor: theme.accent } : {}}
          >
            倒计时
          </button>
        </div>

        {/* 修复：使用 text-center 和 w-full 确保居中 */}
        <div className="w-full text-center">
          <div className="font-mono text-7xl font-bold tracking-tight mb-2 tabular-nums drop-shadow-lg transition-colors" style={{ color: theme.accent }}>
            {formatTime(displaySeconds)}
          </div>
          <p className="text-white/50 text-xs font-medium tracking-widest uppercase">
            {isActive ? (mode === 'stopwatch' ? 'F O C U S I N G' : 'R U N N I N G') : 'P A U S E D'}
          </p>
        </div>

        {mode === 'stopwatch' && <BadgeWall count={badges} color={theme.badge} />}

        <div className="flex justify-center gap-8 items-center mt-10">
          <button 
            onClick={isActive ? pauseTimer : startTimer}
            className="w-24 h-24 rounded-full flex items-center justify-center text-white shadow-2xl active:scale-95 transition-all border-[6px] border-white/10 hover:border-white/20"
            style={{ backgroundColor: theme.accent }}
          >
            {isActive ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
          </button>
          <button 
            onClick={resetTimer}
            className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center shadow-lg active:scale-95 transition-all hover:bg-white/20 border border-white/5"
            style={{ color: 'white' }}
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      </div>

      {mode === 'countdown' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm animate-slideUp">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-800">
            <Clock className="w-5 h-5" style={{ color: theme.accent }} /> 快速设定
          </h3>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {presets.map(min => (
              <button
                key={min}
                onClick={() => setPreset(min)}
                className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all border-2 flex-1 min-w-[80px]`}
                style={
                  displaySeconds === min * 60 && !isActive
                  ? { backgroundColor: `${theme.accent}10`, color: theme.accent, borderColor: theme.accent }
                  : { backgroundColor: 'transparent', color: '#666', borderColor: '#eee' }
                }
              >
                {min}m
              </button>
            ))}
            {/* 历史记录按钮 */}
            {historyMinutes && !presets.includes(historyMinutes) && (
              <button
                onClick={() => setPreset(historyMinutes)}
                className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all border-2 flex-1 min-w-[80px] flex items-center justify-center gap-1`}
                style={
                  displaySeconds === historyMinutes * 60 && !isActive
                  ? { backgroundColor: `${theme.accent}10`, color: theme.accent, borderColor: theme.accent }
                  : { backgroundColor: 'transparent', color: '#666', borderColor: '#eee' }
                }
              >
                <History className="w-3 h-3" /> {historyMinutes}m
              </button>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-xs">自定义</span>
            </div>
            <input 
              type="number" 
              value={customMinutes}
              onChange={(e) => setCustomMinutes(Number(e.target.value))}
              className="w-full bg-gray-50 border-2 border-transparent rounded-xl py-3 pl-16 pr-20 text-lg font-bold outline-none focus:bg-white transition-colors"
              style={{ color: theme.text }}
            />
            <button 
              onClick={() => setPreset(customMinutes)}
              className="absolute right-1 top-1 bottom-1 px-4 rounded-lg font-bold text-sm text-white shadow-sm active:scale-95 transition-transform"
              style={{ backgroundColor: theme.primary }}
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

  // 确保选中天数的数据存在
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
    // 覆盖所有天数（简单逻辑，实际可优化）
    const newSchedule = schedule.map(day => ({ ...day, tasks: newTasks }));
    if(window.confirm('这将覆盖所有日期的计划，确定吗？')) {
      setSchedule(newSchedule);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col animate-slideUp">
      <div className="p-4 border-b flex justify-between items-center shadow-sm z-10" style={{ backgroundColor: theme.primary }}>
        <h2 className="font-bold text-white text-lg flex items-center gap-2"><Edit3 className="w-5 h-5"/> 编辑计划</h2>
        <button onClick={onClose} className="p-2 bg-white/20 rounded-full text-white active:scale-90 transition-transform"><X className="w-5 h-5"/></button>
      </div>

      <div className="flex bg-white shadow-sm mb-2">
        <button onClick={() => setActiveTab('interactive')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'interactive' ? '' : 'border-transparent text-gray-400'}`} style={activeTab === 'interactive' ? { borderColor: theme.accent, color: theme.accent } : {}}>交互模式</button>
        <button onClick={() => setActiveTab('import')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'import' ? '' : 'border-transparent text-gray-400'}`} style={activeTab === 'import' ? { borderColor: theme.accent, color: theme.accent } : {}}>文本导入</button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'interactive' ? (
          <>
            {/* 日期滑动选择器 */}
            <div className="bg-white p-2 shadow-sm z-0">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
                {schedule.map((day) => (
                  <button 
                    key={day.day}
                    onClick={() => setSelectedDay(day.day)}
                    className={`flex-shrink-0 w-14 h-16 rounded-xl flex flex-col items-center justify-center snap-center transition-all border-2 ${selectedDay === day.day ? 'shadow-md scale-105' : 'border-transparent bg-gray-50 opacity-60'}`}
                    style={selectedDay === day.day ? { borderColor: theme.accent, backgroundColor: 'white' } : {}}
                  >
                    <span className="text-[10px] text-gray-400 font-bold">DAY</span>
                    <span className="text-xl font-bold font-mono" style={{ color: selectedDay === day.day ? theme.accent : '#999' }}>{day.day}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 任务编辑区 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {currentDayPlan.tasks.map((task, idx) => (
                <div key={idx} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-3 items-center animate-fadeIn">
                  {/* 原生时间选择器 (Time Picker) */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                      <Clock className="w-3 h-3 text-gray-400"/>
                    </div>
                    <input 
                      type="time" 
                      value={task.time.includes(':') ? task.time : '08:00'}
                      onChange={(e) => updateTask(idx, 'time', e.target.value)}
                      className="w-24 pl-6 pr-2 py-2 bg-gray-50 border-0 rounded-lg text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <input 
                    type="text" 
                    value={task.content}
                    onChange={(e) => updateTask(idx, 'content', e.target.value)}
                    placeholder="输入学习任务..."
                    className="flex-1 py-2 bg-transparent border-b border-gray-100 focus:border-blue-400 outline-none text-sm text-gray-700"
                  />
                  <button onClick={() => removeTask(idx)} className="p-2 text-gray-300 hover:text-red-500"><X className="w-4 h-4"/></button>
                </div>
              ))}
              
              <button 
                onClick={addTask}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-bold text-sm flex items-center justify-center gap-2 hover:border-gray-400 hover:text-gray-500 transition-colors"
              >
                <Plus className="w-4 h-4"/> 添加任务
              </button>
            </div>
          </>
        ) : (
          <div className="p-4 h-full flex flex-col">
            <textarea 
              className="flex-1 w-full p-4 border rounded-xl resize-none focus:outline-none focus:ring-2 text-sm leading-relaxed"
              style={{ '--tw-ring-color': theme.primary }}
              placeholder={`支持直接粘贴 Word 内容：\n\n8:00 背诵50个单词\n9:00 做一套真题\n14:00 复盘错题\n...`}
              value={importText}
              onChange={e => setImportText(e.target.value)}
            />
            <button 
              onClick={handleImport}
              className="w-full py-4 mt-4 rounded-xl text-white font-bold shadow-lg active:scale-95 transition-transform"
              style={{ backgroundColor: theme.accent }}
            >
              一键生成计划
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
  const [targetDate, setTargetDate] = useState('2026-03-14');
  const [theme, setTheme] = useState(THEME_PRESETS[0]);
  
  const [schedule, setSchedule] = useState([]);
  const [completedTasks, setCompletedTasks] = useState({}); 
  const [xp, setXp] = useState(0);
  const [badges, setBadges] = useState(0);
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [isEditingPlan, setIsEditingPlan] = useState(false);

  // --- 初始化 ---
  useEffect(() => {
    const savedConfig = JSON.parse(localStorage.getItem('user_config_v3') || '{}');
    if (savedConfig.theme) setTheme(savedConfig.theme);
    if (savedConfig.examType) setExamType(savedConfig.examType);
    if (savedConfig.targetDate) setTargetDate(savedConfig.targetDate);
    if (savedConfig.badges) setBadges(savedConfig.badges);
    
    const savedSchedule = JSON.parse(localStorage.getItem('user_schedule_v3'));
    if (savedSchedule) {
      setSchedule(savedSchedule);
    } else {
      generateSchedule(savedConfig.examType || 'kaogong');
    }
    setCompletedTasks(JSON.parse(localStorage.getItem('completed_tasks_v3') || '{}'));
  }, []);

  // --- 自动提醒核心逻辑 ---
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') return;

    const checkReminders = () => {
      const now = new Date();
      // 获取当前时分 "08:30"
      const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
      
      // 获取今天的计划
      // 简单起见，假设 Day 1 是开始使用的第一天，实际可以用 startDate 计算差值
      // 这里为了演示，永远检查 schedule[0] 即第一天的任务，或者你需要更复杂的日期映射
      const todayTasks = schedule[0]?.tasks || [];

      todayTasks.forEach((task, idx) => {
        // 假设 task.time 是 "08:30"
        const key = `notified_${new Date().toDateString()}_${idx}`;
        if (task.time === timeStr && !sessionStorage.getItem(key)) {
          new Notification("学习提醒 🔔", { 
            body: `是时候开始：${task.content}`,
            icon: '/vite.svg',
            vibrate: [200, 100, 200]
          });
          sessionStorage.setItem(key, 'true');
        }
      });
    };

    const interval = setInterval(checkReminders, 20000); // 20秒检查一次
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
    const config = { theme, examType, targetDate, badges };
    localStorage.setItem('user_config_v3', JSON.stringify(config));
    localStorage.setItem('user_schedule_v3', JSON.stringify(schedule));
    localStorage.setItem('completed_tasks_v3', JSON.stringify(completedTasks));
  }, [theme, examType, targetDate, badges, schedule, completedTasks]);

  const daysLeft = useMemo(() => {
    const today = getBeijingDate();
    today.setHours(0,0,0,0);
    const target = new Date(targetDate);
    target.setHours(0,0,0,0);
    const diff = target - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [targetDate]);

  const currentDayData = schedule[0] || { tasks: [], quote: '' };

  const toggleTask = (dayIdx, taskIdx) => {
    const key = `${dayIdx}-${taskIdx}`;
    const newState = !completedTasks[key];
    setCompletedTasks(prev => ({ ...prev, [key]: newState }));
    if (newState) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      setXp(p => p + 50);
    }
  };

  if (loading) return <SplashScreen onFinish={() => setLoading(false)} />;

  return (
    <div className="min-h-screen font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden" style={{ backgroundColor: theme.bg, color: theme.text }}>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="absolute animate-fall w-2 h-2 rounded-full" 
              style={{
                left: `${Math.random() * 100}%`, top: `-20px`,
                animationDuration: `${Math.random() * 2 + 1}s`,
                backgroundColor: [theme.primary, theme.accent, theme.badge][Math.floor(Math.random()*3)]
              }} 
            />
          ))}
          <style>{`@keyframes fall { to { transform: translateY(100vh) rotate(720deg); opacity: 0; } } .animate-fall { animation: fall linear forwards; }`}</style>
        </div>
      )}

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
           <div className="flex justify-between items-center mb-6 animate-slideDown">
             <div className="flex items-center gap-3">
               <div className="p-2 rounded-xl shadow-lg transition-transform hover:scale-105" style={{ backgroundColor: theme.primary }}>
                 <Layout className="w-6 h-6 text-white" />
               </div>
               <div>
                 <h1 className="font-bold text-lg leading-none tracking-tight" style={{ color: theme.text }}>
                   就这样备考
                 </h1>
                 <p className="text-[10px] font-bold tracking-widest uppercase mt-1 opacity-60">
                   {DEFAULT_CONFIGS[examType]?.name}
                 </p>
               </div>
             </div>
             <div className="bg-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-gray-100">
               <Award className="w-4 h-4" style={{ color: theme.badge }} />
               <span className="text-xs font-bold text-gray-600">{xp}</span>
             </div>
           </div>

           {/* Views */}
           {currentView === 'dashboard' && (
             <div className="animate-fadeIn pb-24 space-y-6">
               <div 
                 className="rounded-3xl p-6 shadow-xl relative overflow-hidden transition-all duration-500 group"
                 style={{ backgroundColor: theme.primary }}
               >
                 <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                 <div className="flex justify-between items-start relative z-10">
                   <div>
                     <p className="text-xs font-bold mb-1 tracking-wider uppercase text-white/60">距离上岸 ({targetDate})</p>
                     <h1 className="text-5xl font-extrabold text-white">{daysLeft >= 0 ? daysLeft : 0}<span className="text-lg font-normal opacity-80 ml-1">天</span></h1>
                     <p className="text-xs mt-3 font-medium text-white/80 flex items-center gap-1">
                       <CheckCircle className="w-3 h-3"/> 今日完成 {Object.keys(completedTasks).filter(k => k.startsWith(`${currentDayData.day}-`)).length}/{currentDayData.tasks.length}
                     </p>
                   </div>
                   <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md shadow-inner border border-white/10">
                     <Trophy className="w-6 h-6 text-yellow-300" />
                   </div>
                 </div>
                 <div className="mt-6 pt-4 border-t border-white/10">
                   <p className="text-sm italic font-medium leading-relaxed text-white/90">"{currentDayData.quote}"</p>
                 </div>
               </div>

               <div className="space-y-4">
                 <div className="flex items-center justify-between px-1">
                   <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: theme.text }}>
                     <Calendar className="w-5 h-5" style={{ color: theme.accent }} /> 今日计划
                   </h2>
                   <button onClick={() => setIsEditingPlan(true)} className="text-xs font-bold px-3 py-1 bg-white rounded-full shadow-sm text-gray-500 hover:text-gray-800">调整计划</button>
                 </div>
                 
                 {currentDayData.tasks.map((task, idx) => {
                   const isDone = completedTasks[`${currentDayData.day}-${idx}`];
                   return (
                     <div 
                       key={idx} 
                       onClick={() => toggleTask(currentDayData.day, idx)}
                       className={`relative p-4 rounded-2xl border transition-all active:scale-98 duration-200 cursor-pointer shadow-sm group ${isDone ? 'bg-gray-100 border-transparent opacity-60' : 'bg-white border-white hover:border-blue-100 hover:shadow-md'}`}
                     >
                       <div className="flex justify-between items-center">
                         <div>
                           <div className="flex items-center gap-2 mb-1">
                             <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                               {task.time}
                             </span>
                           </div>
                           <p className={`text-sm font-bold ${isDone ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                             {task.content}
                           </p>
                         </div>
                         <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isDone ? 'border-transparent' : 'border-gray-200 group-hover:border-blue-300'}`} style={isDone ? { backgroundColor: theme.primary } : {}}>
                           {isDone && <CheckCircle className="w-4 h-4 text-white" />}
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
                 <div key={idx} className="p-5 rounded-2xl bg-white shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
                   <div className="flex justify-between items-center mb-3 border-b border-gray-50 pb-2">
                     <span className="font-bold text-sm" style={{ color: theme.accent }}>Day {day.day}</span>
                     <span className="text-[10px] text-gray-400">Task Count: {day.tasks.length}</span>
                   </div>
                   {/* 励志文案已隐藏，只显示干货任务 */}
                   <div className="space-y-2">
                     {day.tasks.map((t, ti) => (
                       <div key={ti} className="text-xs flex gap-3 items-start">
                         <span className="font-mono text-gray-400 min-w-[40px]">{t.time}</span>
                         <span className="font-medium text-gray-700">{t.content}</span>
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
                <section>
                  <h3 className="font-bold mb-4 text-gray-900">备考项目</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(DEFAULT_CONFIGS).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => { setExamType(key); generateSchedule(key); }}
                        className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${examType === key ? 'bg-white shadow-md' : 'bg-transparent border-transparent hover:bg-white/50'}`}
                        style={examType === key ? { borderColor: theme.primary } : {}}
                      >
                        <config.icon className="w-8 h-8" style={{ color: examType === key ? theme.primary : '#ccc' }} />
                        <span className="text-xs font-bold text-gray-600">{config.name}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="font-bold mb-4 text-gray-900">主题风格</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {THEME_PRESETS.map((t, i) => (
                      <button 
                        key={i}
                        onClick={() => setTheme(t)}
                        className={`w-full aspect-square rounded-full border-2 transition-transform hover:scale-110 shadow-sm ${theme.name === t.name ? 'ring-2 ring-offset-2 ring-gray-300' : 'border-transparent'}`}
                        style={{ backgroundColor: t.primary }}
                        title={t.name}
                      />
                    ))}
                  </div>
                  
                  <div className="mt-4 p-4 bg-white rounded-xl shadow-sm space-y-3">
                    <p className="text-xs font-bold text-gray-400 mb-2">自定义微调</p>
                    {['primary', 'accent', 'badge'].map(key => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 capitalize">{key} Color</span>
                        <input type="color" value={theme[key]} onChange={e => setTheme({...theme, [key]: e.target.value})} className="w-8 h-8 rounded cursor-pointer border-0"/>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="font-bold mb-4 text-gray-900">目标设定</h3>
                  <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between">
                    <span className="text-sm text-gray-600">考试日期</span>
                    <input 
                      type="date" 
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="bg-gray-50 border-0 rounded-lg p-2 text-sm font-bold text-gray-800 outline-none"
                    />
                  </div>
                </section>
                
                <div className="text-center pt-8">
                  <p className="text-[10px] text-gray-400 font-mono">JustPrep v3.0 · Stay Focused</p>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* 底部导航栏 */}
      <div className="absolute bottom-0 left-0 right-0 px-6 py-4 flex justify-between items-center z-40 safe-area-bottom bg-white/90 backdrop-blur-lg border-t border-gray-100">
        {[
          { id: 'dashboard', icon: Clock, label: '今日' },
          { id: 'schedule', icon: Calendar, label: '全景' },
          { id: 'timer', icon: Timer, label: '专注' },
          { id: 'settings', icon: Settings, label: '我的' }
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentView === item.id ? '-translate-y-1' : 'opacity-50 hover:opacity-80'}`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${currentView === item.id ? 'bg-gray-100' : 'bg-transparent'}`}>
              <item.icon className="w-6 h-6" style={{ color: currentView === item.id ? theme.accent : '#999' }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color: currentView === item.id ? theme.accent : '#999' }}>{item.label}</span>
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
        .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
      `}</style>
    </div>
  );
}