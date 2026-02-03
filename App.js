import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import TaskForm from './components/TaskForm.jsx';
import TaskStats from './components/TaskStats.jsx';
import TaskItem from './components/TaskItem.jsx';

function App() {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const addTask = () => {
    const newTask = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
      createdAt: new Date().toLocaleDateString('en-IN'),
      priority: 'medium'
    };
    setTasks([newTask, ...tasks]);
    setInput('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    setTasks(tasks.map(task => 
      task.id === editingId ? { ...task, text: editText.trim() } : task
    ));
    setEditingId(null);
    setEditText('');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl lg:text-7xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            TaskMaster
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Built with React Hooks + Tailwind CSS. Perfect for your internship portfolio!
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl shadow-2xl rounded-3xl p-8 lg:p-12 border border-white/50">
          <TaskForm input={input} setInput={setInput} onAddTask={addTask} />
          
          <TaskStats {...stats} />
          
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {['all', 'pending', 'completed'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-8 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-300 ${
                  filter === status
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-purple-500/25 scale-105'
                    : 'bg-white/70 text-gray-800 hover:bg-white hover:shadow-xl hover:scale-105 border border-gray-200/50 hover:border-indigo-300'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-4 -mr-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-24">
                <div className="text-8xl mb-6">🎉</div>
                <h3 className="text-3xl font-bold text-gray-700 mb-2">
                  {filter === 'all' ? 'No tasks yet!' : `No ${filter} tasks`}
                </h3>
                <p className="text-gray-500 text-lg">Start by adding your first task above ✨</p>
              </div>
            ) : (
              filteredTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isEditing={editingId === task.id}
                  editText={editText}
                  onToggle={() => toggleTask(task.id)}
                  onDelete={() => deleteTask(task.id)}
                  onStartEdit={() => startEdit(task.id, task.text)}
                  onSaveEdit={saveEdit}
                  onEditChange={setEditText}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
