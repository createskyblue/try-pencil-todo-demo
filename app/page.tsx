"use client";

import { Search, Plus, Check, X, Trash2, Edit2, Clock, Flag } from "lucide-react";
import { useState, useEffect } from "react";

type Task = {
  id: string;
  title: string;
  time: string;
  category: string;
  completed: boolean;
  inProgress: boolean;
  important: boolean;
  createdAt: number;
};

type WeekDay = {
  label: string;
  date: string;
  completed: boolean;
  current?: boolean;
  hasTask?: boolean;
};

const DEFAULT_TASKS: Task[] = [
  { id: "1", title: "晨练", time: "7:00", category: "健康", completed: true, inProgress: false, important: false, createdAt: Date.now() },
  { id: "2", title: "设计评审会议", time: "10:00", category: "工作", completed: false, inProgress: true, important: false, createdAt: Date.now() },
  { id: "3", title: "购买日用品", time: "14:00", category: "生活", completed: false, inProgress: false, important: false, createdAt: Date.now() },
  { id: "4", title: "阅读30分钟", time: "晚上", category: "自我提升", completed: false, inProgress: false, important: false, createdAt: Date.now() },
  { id: "5", title: "完成项目方案", time: "明天截止", category: "工作", completed: false, inProgress: false, important: true, createdAt: Date.now() },
];

const CATEGORIES = ["工作", "生活", "健康", "学习", "自我提升", "其他"];

// 获取当前周的日期
function getWeekDays(): WeekDay[] {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));

  const days: WeekDay[] = [];
  const labels = ["一", "二", "三", "四", "五", "六", "日"];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const isCurrentDay = d.toDateString() === now.toDateString();
    days.push({
      label: labels[i],
      date: d.getDate().toString(),
      completed: false,
      current: isCurrentDay,
    });
  }
  return days;
}

export default function Home() {
  // 从 localStorage 加载任务
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [activeTab, setActiveTab] = useState<"all" | "inProgress" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [weekDays, setWeekDays] = useState<WeekDay[]>(getWeekDays());

  // 表单状态
  const [formData, setFormData] = useState({
    title: "",
    time: "",
    category: "工作",
    important: false,
  });

  // 加载/保存到 localStorage
  useEffect(() => {
    const saved = localStorage.getItem("todo-app-tasks");
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load tasks:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todo-app-tasks", JSON.stringify(tasks));
    updateWeekProgress();
  }, [tasks]);

  // 更新周进度
  const updateWeekProgress = () => {
    const now = new Date();
    const today = now.getDay();
    setWeekDays(prev => prev.map((day, i) => {
      const dayIndex = i === 6 ? 0 : i + 1; // 转换为 JS 的星期格式
      const isPastDay = dayIndex < today;
      return {
        ...day,
        completed: isPastDay && Math.random() > 0.3, // 模拟已完成
        hasTask: i === 4, // 模拟周五有任务
      };
    }));
  };

  // 过滤任务
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" ||
                      (activeTab === "completed" && task.completed) ||
                      (activeTab === "inProgress" && task.inProgress && !task.completed);
    return matchesSearch && matchesTab;
  });

  // 计算完成度
  const completionRate = tasks.length > 0
    ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
    : 0;

  // 添加/更新任务
  const handleSaveTask = () => {
    if (!formData.title.trim()) return;

    if (editingTask) {
      setTasks(tasks.map(t =>
        t.id === editingTask.id
          ? { ...t, title: formData.title, time: formData.time, category: formData.category, important: formData.important }
          : t
      ));
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        title: formData.title,
        time: formData.time || "未设置",
        category: formData.category,
        completed: false,
        inProgress: false,
        important: formData.important,
        createdAt: Date.now(),
      };
      setTasks([newTask, ...tasks]);
    }

    handleCloseModal();
  };

  // 删除任务
  const handleDeleteTask = (id: string) => {
    if (confirm("确定要删除这个任务吗？")) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  // 切换完成状态
  const toggleComplete = (id: string) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed, inProgress: false } : t
    ));
  };

  // 切换进行中状态
  const toggleInProgress = (id: string) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, inProgress: !t.inProgress, completed: false } : t
    ));
  };

  // 切换重要状态
  const toggleImportant = (id: string) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, important: !t.important } : t
    ));
  };

  // 打开添加/编辑模态框
  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        time: task.time,
        category: task.category,
        important: task.important,
      });
    } else {
      setEditingTask(null);
      setFormData({ title: "", time: "", category: "工作", important: false });
    }
    setShowModal(true);
  };

  // 关闭模态框
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setFormData({ title: "", time: "", category: "工作", important: false });
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-white rounded-3xl overflow-hidden shadow-xl">
        {/* Header */}
        <header className="p-6 pb-6">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-1">我的任务</h1>
          <p className="text-gray-500 text-base mb-4">
            今天你有 {filteredTasks.length} 个任务
            {activeTab !== "all" && ` (${activeTab === "completed" ? "已完成" : "进行中"})`}
          </p>

          {/* Search Bar */}
          <div className="bg-[#F6F7F8] rounded-2xl flex items-center px-4 py-3.5 gap-3">
            <Search className="w-4.5 h-4.5 text-gray-400 flex-shrink-0" strokeWidth={2} />
            <input
              type="text"
              placeholder="搜索任务..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent flex-1 outline-none text-base text-gray-900 placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            )}
          </div>
        </header>

        {/* Tabs */}
        <div className="px-6 mb-4">
          <div className="bg-[#F3F4F6] rounded-[22px] h-11 p-1 flex gap-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 rounded-[18px] text-sm font-semibold transition-all ${
                activeTab === "all"
                  ? "bg-white text-gray-900"
                  : "text-gray-400 font-medium"
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setActiveTab("inProgress")}
              className={`flex-1 rounded-[18px] text-sm font-semibold transition-all ${
                activeTab === "inProgress"
                  ? "bg-white text-gray-900"
                  : "text-gray-400 font-medium"
              }`}
            >
              进行中
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`flex-1 rounded-[18px] text-sm font-semibold transition-all ${
                activeTab === "completed"
                  ? "bg-white text-gray-900"
                  : "text-gray-400 font-medium"
              }`}
            >
              已完成
            </button>
          </div>
        </div>

        {/* Tasks Section */}
        <section className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-gray-900">今天</h2>
            <button
              onClick={() => handleOpenModal()}
              className="bg-[#FF6B6B] text-white rounded-2xl px-3.5 py-2 flex items-center gap-1.5 text-xs font-semibold hover:bg-[#ff5252] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
              添加任务
            </button>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>暂无任务</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`rounded-2xl p-4 flex items-center gap-3 transition-all group ${
                    task.completed
                      ? "bg-[#F6F7F8]"
                      : task.inProgress
                      ? "bg-[#FFFBEB] border border-yellow-400"
                      : "bg-[#F6F7F8]"
                  }`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleComplete(task.id)}
                    className={`w-6 h-6 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                      task.completed
                        ? "bg-green-500"
                        : task.inProgress
                        ? "border-3 border-yellow-400"
                        : "border-2 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </button>

                  {/* Task Content */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => handleOpenModal(task)}
                  >
                    <p
                      className={`text-base font-semibold truncate ${
                        task.completed ? "text-gray-400 font-medium" : "text-gray-900"
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" strokeWidth={2} />
                      {task.time} • {task.category}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Toggle In Progress */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleInProgress(task.id); }}
                      className={`p-1.5 rounded-lg transition-opacity ${
                        task.inProgress && !task.completed
                          ? "bg-yellow-100 text-yellow-600"
                          : "opacity-0 group-hover:opacity-100 hover:bg-gray-200"
                      }`}
                      title="进行中"
                    >
                      <Clock className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </button>

                    {/* Toggle Important */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleImportant(task.id); }}
                      className={`p-1.5 rounded-lg transition-opacity ${
                        task.important && !task.completed
                          ? "bg-red-100 text-red-500"
                          : "opacity-0 group-hover:opacity-100 hover:bg-gray-200"
                      }`}
                      title="重要"
                    >
                      <Flag className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-500 transition-all"
                      title="删除"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Week Progress Section */}
        <section className="p-6 pb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-gray-900">本周进度</h2>
            <span className="bg-[#F0F5FF] text-indigo-500 text-xs font-semibold px-3 py-1.5 rounded-xl">
              完成度 {completionRate}%
            </span>
          </div>

          <div className="bg-[#F6F7F8] rounded-2xl p-5">
            <div className="flex justify-between">
              {weekDays.map((day, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      day.completed
                        ? "bg-green-500"
                        : day.current
                        ? "bg-yellow-400"
                        : day.hasTask
                        ? "bg-[#FF6B6B]"
                        : "border-2 border-gray-200 bg-transparent"
                    }`}
                  >
                    {day.date === "check" ? (
                      <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                    ) : (
                      <span
                        className={`text-base font-bold ${
                          day.completed ? "text-white" : day.hasTask ? "text-white" : day.current ? "text-white" : "text-gray-400"
                        }`}
                      >
                        {day.date}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      day.hasTask ? "text-[#FF6B6B]" : day.current ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {day.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-gray-900">
                {editingTask ? "编辑任务" : "添加任务"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" strokeWidth={2} />
              </button>
            </div>

            <div className="space-y-4">
              {/* 标题 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  任务名称 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="输入任务名称..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  autoFocus
                />
              </div>

              {/* 时间 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  时间
                </label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  placeholder="例如: 10:00 或 明天截止"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                />
              </div>

              {/* 分类 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  分类
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all bg-white"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* 重要标记 */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.important}
                  onChange={(e) => setFormData({ ...formData, important: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700">标记为重要任务</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveTask}
                disabled={!formData.title.trim()}
                className="flex-1 px-4 py-3 rounded-xl bg-indigo-500 text-white font-semibold hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {editingTask ? "保存" : "添加"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
