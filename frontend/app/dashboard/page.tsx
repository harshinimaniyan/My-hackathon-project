"use client";
import { useEffect, useState, useRef } from "react";
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title as ChartTitle } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ChartTitle);

type Task = {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
};

const priorities = ["low", "medium", "high"];

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareTaskId, setShareTaskId] = useState<string | null>(null);
  const [shareEmail, setShareEmail] = useState("");
  const shareInputRef = useRef<HTMLInputElement>(null);

  // Fetch tasks from backend
  const fetchTasks = () => {
    fetch("http://localhost:5000/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch tasks:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // For demonstration, show some sample tasks if the backend is empty
  useEffect(() => {
    if (!loading && tasks.length === 0) {
      setTasks([
        {
          _id: '1',
          title: 'Implement JWT Authentication',
          description: 'Add secure JWT-based authentication to the backend API.',
          status: 'completed',
          priority: 'high',
          createdAt: new Date().toISOString(),
        },
        {
          _id: '2',
          title: 'Optimize Database Indexes',
          description: 'Analyze and optimize MongoDB indexes for faster queries.',
          status: 'in progress',
          priority: 'medium',
          createdAt: new Date().toISOString(),
        },
        {
          _id: '3',
          title: 'Refactor React Components',
          description: 'Break down large React components into reusable pieces.',
          status: 'pending',
          priority: 'medium',
          createdAt: new Date().toISOString(),
        },
        {
          _id: '4',
          title: 'Setup CI/CD Pipeline',
          description: 'Configure GitHub Actions for automated testing and deployment.',
          status: 'completed',
          priority: 'high',
          createdAt: new Date().toISOString(),
        },
        {
          _id: '5',
          title: 'API Rate Limiting',
          description: 'Implement rate limiting middleware to prevent API abuse.',
          status: 'pending',
          priority: 'high',
          createdAt: new Date().toISOString(),
        },
        {
          _id: '6',
          title: 'Add Dark Mode',
          description: 'Enable dark mode toggle for the frontend UI.',
          status: 'in progress',
          priority: 'low',
          createdAt: new Date().toISOString(),
        },
        {
          _id: '7',
          title: 'Write Unit Tests',
          description: 'Increase test coverage for backend controllers and models.',
          status: 'pending',
          priority: 'medium',
          createdAt: new Date().toISOString(),
        },
        {
          _id: '8',
          title: 'Integrate Payment Gateway',
          description: 'Add Stripe integration for processing user payments.',
          status: 'completed',
          priority: 'high',
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  }, [loading, tasks]);

  // Add or update a task
  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTask) return;
    if (editTask._id.startsWith("temp")) {
      // Add new
      await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTask.title,
          description: editTask.description,
          status: editTask.status,
          priority: editTask.priority,
        }),
      });
    } else {
      // Update
      await fetch(`http://localhost:5000/api/tasks/${editTask._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editTask),
      });
    }
    setShowModal(false);
    setEditTask(null);
    fetchTasks();
  };

  // Delete a task
  const handleDeleteTask = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        alert("Delete failed: " + (error.error || "Unknown error"));
      } else {
        fetchTasks();
      }
    } catch (err) {
      alert("Delete failed: " + err);
    }
  };

  // Open modal to view task details
  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setEditTask(null);
    setShowModal(true);
  };

  // Open modal to edit task
  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setSelectedTask(null);
    setShowModal(true);
  };

  // Derived data
  let filteredTasks = filter === "all" ? tasks : tasks.filter(t => t.priority === filter);
  if (statusFilter !== "all") {
    filteredTasks = filteredTasks.filter(t => t.status === statusFilter);
  }
  const totalTasks = tasks.length;
  const lowPriority = tasks.filter(t => t.priority === "low").length;
  const mediumPriority = tasks.filter(t => t.priority === "medium").length;
  const highPriority = tasks.filter(t => t.priority === "high").length;
  const completed = tasks.filter(t => t.status === "completed").length;
  const pending = tasks.filter(t => t.status !== "completed").length;
  const completionRate = totalTasks ? Math.round((completed / totalTasks) * 100) : 0;

  // Recent activity (last 3 completed)
  const recent = tasks.filter(t => t.status === "completed").slice(-3).reverse();

  // Calculate task statistics for 8 tasks
  const completeCount = tasks.filter(t => t.status === 'completed').length;
  const progressCount = tasks.filter(t => t.status === 'in progress').length;
  const incompleteCount = tasks.filter(t => t.status !== 'completed' && t.status !== 'in progress').length;
  const totalCount = tasks.length;
  const pieChartData = {
    labels: ['Complete Task', 'Progress Task', 'Incomplete Task', 'Other'],
    datasets: [
      {
        data: [completeCount, progressCount, incompleteCount, 0.01], // 0.01 for blue segment
        backgroundColor: [
          '#7c3aed', // purple
          '#facc15', // yellow
          '#22c55e', // green
          '#3b82f6', // blue (for visual match)
        ],
        borderWidth: 0,
      },
    ],
  };
  const pieChartOptions = {
    cutout: '70%',
    rotation: -90,
    circumference: 270,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  // Timeline demo data for horizontal timeline
  const timelineSlots = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];
  const timelineTasks = [
    { start: 2, end: 4, label: 'Saas Design', percent: 100, avatars: ['A', 'B'], color: 'bg-purple-200', status: 'done' },
    { start: 1, end: 3, label: 'App Design', percent: 0, avatars: ['C'], color: 'bg-purple-100', status: 'cancelled' },
    { start: 6, end: 8, label: 'Motion Design', percent: 54, avatars: ['D'], color: 'bg-purple-200', status: 'progress' },
    { start: 7, end: 9, label: 'Web Design', percent: 80, avatars: ['E'], color: 'bg-purple-200', status: 'progress' },
    { start: 4, end: 6, label: 'Delete Task', percent: 0, avatars: ['F'], color: 'bg-purple-100', status: 'cancelled' },
  ];
  const currentTimeIdx = 6; // 13:00

  // Enhanced demo data for monthly spent
  const monthlySpentData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'High',
        data: [12, 19, 3, 5, 2, 3, 7, 8],
        backgroundColor: 'rgba(59,130,246,0.9)', // blue
        borderRadius: 8,
        barPercentage: 0.6,
        categoryPercentage: 0.5,
      },
      {
        label: 'Medium',
        data: [2, 3, 20, 5, 1, 4, 6, 9],
        backgroundColor: 'rgba(251,146,60,0.9)', // orange
        borderRadius: 8,
        barPercentage: 0.6,
        categoryPercentage: 0.5,
      },
      {
        label: 'Low',
        data: [3, 10, 13, 15, 22, 30, 12, 5],
        backgroundColor: 'rgba(34,197,94,0.9)', // green
        borderRadius: 8,
        barPercentage: 0.6,
        categoryPercentage: 0.5,
      },
    ],
  };
  const monthlySpentOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        stacked: true,
        ticks: { color: '#a1a1aa', font: { size: 12, weight: 'bold' as const } },
      },
      y: {
        grid: { color: '#f3f4f6' },
        stacked: true,
        ticks: { color: '#a1a1aa', font: { size: 12, weight: 'bold' as const } },
      },
    },
    borderRadius: 8,
    barPercentage: 0.6,
    categoryPercentage: 0.5,
  };

  // Custom data for monthly spent dot/bar chart
  const monthlySpentDots = [
    // Each entry: [purple, yellow, green, blue] heights (in px)
    { month: 'Jan', values: [48, 16, 16, 8] },
    { month: 'Feb', values: [64, 16, 32, 8] },
    { month: 'Mar', values: [24, 48, 24, 8] },
    { month: 'Apr', values: [16, 48, 16, 8] },
    { month: 'May', values: [64, 16, 16, 8] },
    { month: 'Jun', values: [32, 48, 32, 8] },
    { month: 'Jul', values: [32, 48, 32, 8] },
    { month: 'Aug', values: [16, 16, 48, 8] },
  ];
  const dotColors = [
    'bg-[#7c3aed]', // purple
    'bg-[#facc15]', // yellow
    'bg-[#22c55e]', // green
    'bg-[#3b82f6]', // blue
  ];

  // Add a click handler to close the menu when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileMenuOpen) {
        setProfileMenuOpen(false);
      }
    }
    if (profileMenuOpen) {
      window.addEventListener('click', handleClick);
    }
    return () => window.removeEventListener('click', handleClick);
  }, [profileMenuOpen]);

  const handleShareTask = (taskId: string) => {
    setShareTaskId(taskId);
    setShareModalOpen(true);
    setTimeout(() => shareInputRef.current?.focus(), 100);
  };

  const handleShareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareTaskId || !shareEmail) return;
    await fetch(`http://localhost:5000/api/tasks/${shareTaskId}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: shareEmail }),
    });
    setShareModalOpen(false);
    setShareTaskId(null);
    setShareEmail("");
    alert("Task shared successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-200 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-300 shadow-lg flex flex-col p-6 min-h-screen">
        <div className="flex items-center gap-2 mb-8">
          <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">H</span>
          <span className="font-bold text-2xl text-purple-600">TaskFlow</span>
        </div>
        <div className="mb-8">
          <div className="text-xs text-gray-400 mb-1">PRODUCTIVITY</div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
            <span className="text-xs font-bold text-purple-600">100%</span>
          </div>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            <li className="bg-purple-100 text-purple-700 font-semibold rounded px-3 py-2">Dashboard</li>
            <li className="text-gray-600 px-3 py-2">Pending Tasks</li>
            <li className="text-gray-600 px-3 py-2">Completed Tasks</li>
          </ul>
        </nav>
        <div className="mt-8 bg-purple-50 p-4 rounded-lg text-xs text-purple-700 text-center">
          All systems operational.
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Topbar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Task Overview</h2>
            <div className="text-gray-400 text-sm">Manage your tasks efficiently</div>
          </div>
          <div className="flex items-center gap-4 relative">
            <button onClick={() => { setEditTask({ _id: `temp${Date.now()}`, title: '', description: '', status: 'pending', priority: 'low', createdAt: new Date().toISOString() }); setShowModal(true); }} className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold shadow">+ Add New Task</button>
            <button onClick={() => setProfileMenuOpen(v => !v)} className="flex flex-col items-end focus:outline-none">
              <span className="font-bold text-purple-700">Harshini</span>
              <span className="text-xs text-gray-400">harshini@example.com</span>
            </button>
            <button onClick={() => setProfileMenuOpen(v => !v)} className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center font-bold text-purple-700 focus:outline-none">HE</button>
            {profileMenuOpen && (
              <div className="absolute right-0 top-16 bg-white rounded-lg shadow-lg py-2 w-40 z-50 border">
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-purple-50">Profile</a>
                <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-purple-50">Settings</a>
                <a href="#" className="block px-4 py-2 text-red-500 hover:bg-red-50">Logout</a>
              </div>
            )}
          </div>
        </div>
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-purple-50 rounded-lg shadow p-6 flex flex-col items-center">
            <div className="text-2xl font-bold text-purple-600">{totalTasks}</div>
            <div className="text-gray-500">Total Tasks</div>
          </div>
          <div className="bg-purple-50 rounded-lg shadow p-6 flex flex-col items-center">
            <div className="text-2xl font-bold text-green-500">{lowPriority}</div>
            <div className="text-gray-500">Low Priority</div>
          </div>
          <div className="bg-purple-50 rounded-lg shadow p-6 flex flex-col items-center">
            <div className="text-2xl font-bold text-yellow-500">{mediumPriority}</div>
            <div className="text-gray-500">Medium Priority</div>
          </div>
          <div className="bg-purple-50 rounded-lg shadow p-6 flex flex-col items-center">
            <div className="text-2xl font-bold text-red-500">{highPriority}</div>
            <div className="text-gray-500">High Priority</div>
          </div>
        </div>
        {/* Task Today, Timeline, Task Statistic, Total Monthly Spent */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Timeline Widget (custom horizontal timeline) */}
          <div className="bg-purple-50 rounded-lg shadow p-4 col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Task Today, 2 July</h3>
            </div>
            <div className="w-full">
              <div className="relative w-full mx-auto" style={{ minHeight: 120 }}>
                <div className="flex justify-between text-xs text-gray-400 mb-2 w-full">
                  {timelineSlots.map((slot, idx) => (
                    <div key={slot} className="flex-1 text-center min-w-0">{slot}</div>
                  ))}
                </div>
                <div className="relative h-24 w-full">
                  {/* Current time marker */}
                  <div className="absolute top-0 left-0 h-full flex z-10" style={{ left: `calc(${currentTimeIdx * 100 / (timelineSlots.length - 1)}% - 10px)` }}>
                    <div className="w-0.5 h-full bg-purple-400 mx-auto relative">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-white border-4 border-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-purple-700">13:00</span>
                      </div>
                    </div>
                  </div>
                  {/* Task bars */}
                  {timelineTasks.map((task, idx) => (
                    <div
                      key={idx}
                      className={`absolute flex items-center shadow ${task.color} rounded-full px-4 py-2 text-gray-800`}
                      style={{
                        left: `calc(${task.start * 100 / (timelineSlots.length - 1)}% + 10px)`,
                        width: `calc(${(task.end - task.start) * 100 / (timelineSlots.length - 1)}% - 20px)`,
                        top: `${10 + idx * 32}px`,
                        zIndex: 2,
                      }}
                    >
                      <span className="font-bold text-xs bg-white text-purple-700 px-2 py-0.5 rounded mr-2 shadow">{task.percent ? `${task.percent}%` : task.status === 'cancelled' ? 'Cancelled' : ''}</span>
                      <span className="mr-2 text-sm font-semibold">{task.label}</span>
                      <div className="flex items-center gap-1 ml-2">
                        {task.avatars.map((a, i) => (
                          <span key={i} className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-xs font-bold text-purple-700 border-2 border-white shadow">{a}</span>
                        ))}
                        <span className="ml-1 text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full font-bold shadow">+2</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Task Statistic Widget */}
          <div className="bg-purple-50 rounded-lg shadow p-6 flex flex-row items-center justify-between" style={{ minHeight: 220 }}>
            <div className="flex flex-col gap-6">
              <h3 className="font-bold text-lg">Task Statistic</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3"><span className="w-4 h-4 bg-purple-500 rounded-full"></span> <span className="text-gray-400 font-semibold">Complete Task</span> <span className="ml-4 text-lg font-bold text-gray-900">{completeCount}</span></div>
                <div className="flex items-center gap-3"><span className="w-4 h-4 bg-yellow-400 rounded-full"></span> <span className="text-gray-400 font-semibold">Progress Task</span> <span className="ml-4 text-lg font-bold text-gray-900">{progressCount}</span></div>
                <div className="flex items-center gap-3"><span className="w-4 h-4 bg-green-400 rounded-full"></span> <span className="text-gray-400 font-semibold">Incomplete Task</span> <span className="ml-4 text-lg font-bold text-gray-900">{incompleteCount}</span></div>
              </div>
            </div>
            <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
              <Pie data={pieChartData} options={pieChartOptions} style={{ width: 140, height: 140 }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-gray-400 text-xs">Complete Task</span>
                <span className="text-2xl font-extrabold text-gray-900">{totalCount} Task</span>
              </div>
            </div>
          </div>
          {/* Total Monthly Spent Widget */}
          <div className="bg-purple-50 rounded-lg shadow p-6 lg:col-span-3 flex flex-col" style={{ minHeight: 140, padding: '1.5rem' }}>
            <h3 className="font-bold text-lg mb-4">Total Monthly Spent</h3>
            <div className="flex items-end justify-between h-24 px-0 gap-2 max-w-md mx-auto w-full">
              {monthlySpentDots.map((m, i) => (
                <div key={m.month} className="flex flex-col items-center w-6">
                  {/* Dots/bars, from bottom to top */}
                  <div className="flex flex-col-reverse gap-1 h-16 justify-end">
                    {m.values.map((h, j) => (
                      <div
                        key={j}
                        className={`${dotColors[j]} rounded-full mx-auto`}
                        style={{ width: '8px', height: `${Math.max(8, h * 0.7)}px` }}
                      ></div>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 mt-1">{m.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Main Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* All Tasks */}
          <div className="lg:col-span-2 bg-purple-50 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="font-bold text-lg">All Tasks</div>
              <div className="flex gap-2 items-center">
                <span className="text-xs text-gray-400">Priority:</span>
                <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-purple-100 text-purple-700' : 'text-gray-400'}`}>All</button>
                {priorities.map(p => (
                  <button key={p} onClick={() => setFilter(p)} className={`px-3 py-1 rounded capitalize ${filter === p ? (p === 'low' ? 'bg-teal-100 text-teal-700' : p === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-purple-100 text-purple-700') : 'text-gray-400'}`}>{p}</button>
                ))}
                <span className="ml-6 text-xs text-gray-400">Status:</span>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border px-2 py-1 rounded text-xs">
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <ul>
              {loading ? <li className="text-gray-400">Loading...</li> : filteredTasks.length === 0 ? <li className="text-gray-400">No tasks found.</li> : filteredTasks.map(task => (
                <li key={task._id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mb-3 shadow-sm">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-700 flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${task.priority === 'low' ? 'bg-green-400' : task.priority === 'medium' ? 'bg-orange-400' : 'bg-blue-400'}`}></span>
                      {task.title}
                      <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${task.priority === 'low' ? 'bg-green-100 text-green-700' : task.priority === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                    </span>
                    <span className="text-xs text-gray-400 mt-1">{task.description}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${task.status === 'completed' ? 'text-green-600' : 'text-purple-600'}`}>{task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span>
                    <span className="text-xs text-gray-400 ml-2">{new Date(task.createdAt).toLocaleDateString()}</span>
                    <button onClick={() => { setEditTask(task); setShowModal(true); }} className="ml-2 bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200 transition">Edit</button>
                    <button onClick={() => handleDeleteTask(task._id)} className="ml-2 bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition">Delete</button>
                    <button onClick={() => handleShareTask(task._id)} className="ml-2 bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition">Share</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* Task Statistics & Recent Activity */}
          <div className="flex flex-col gap-8">
            <div className="bg-purple-50 rounded-lg shadow p-6">
              <div className="font-bold text-lg mb-2">Recent Activity</div>
              <ul>
                {recent.length === 0 ? <li className="text-gray-400">No recent activity.</li> : recent.map(t => (
                  <li key={t._id} className="flex items-center justify-between mb-2">
                    <span>{t.title}</span>
                    <span className="text-green-500 font-bold text-xs">Done</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Modal for Add/Edit Task */}
        {showModal && editTask && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
              <button onClick={() => { setShowModal(false); setEditTask(null); }} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
              <form onSubmit={handleSaveTask}>
                <h2 className="text-xl font-bold mb-4 text-purple-700">{editTask._id.startsWith("temp") ? "Add New Task" : "Edit Task"}</h2>
                <div className="mb-2">
                  <label className="block font-bold text-purple-700">Title:</label>
                  <input type="text" value={editTask.title} onChange={e => setEditTask({ ...editTask, title: e.target.value })} className="border px-2 py-1 rounded w-full" required />
                </div>
                <div className="mb-2">
                  <label className="block font-bold text-pink-600">Description:</label>
                  <input type="text" value={editTask.description} onChange={e => setEditTask({ ...editTask, description: e.target.value })} className="border px-2 py-1 rounded w-full" required />
                </div>
                <div className="mb-2">
                  <label className="block font-bold text-blue-600">Status:</label>
                  <select value={editTask.status} onChange={e => setEditTask({ ...editTask, status: e.target.value })} className="border px-2 py-1 rounded w-full">
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block font-bold text-green-600">Priority:</label>
                  <select value={editTask.priority} onChange={e => setEditTask({ ...editTask, priority: e.target.value })} className="border px-2 py-1 rounded w-full">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <button type="submit" className="bg-purple-500 hover:bg-purple-700 text-white px-4 py-2 rounded mt-2">{editTask._id.startsWith("temp") ? "Add Task" : "Update Task"}</button>
              </form>
            </div>
          </div>
        )}
        {/* Share Task Modal */}
        {shareModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
              <button onClick={() => { setShareModalOpen(false); setShareTaskId(null); setShareEmail(""); }} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
              <form onSubmit={handleShareSubmit}>
                <h2 className="text-xl font-bold mb-4 text-blue-700">Share Task</h2>
                <div className="mb-2">
                  <label className="block font-bold text-blue-700">User Email:</label>
                  <input ref={shareInputRef} type="email" value={shareEmail} onChange={e => setShareEmail(e.target.value)} className="border px-2 py-1 rounded w-full" required />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded mt-2">Share</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}