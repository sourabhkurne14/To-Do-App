
import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import './index.css';

function Dashboard() {

  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if(!user){
      navigate('/login');
    }
  }, [user, navigate]);

  const storageKey = user ? `tasks_${user.uid}` : "tasks";


  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('')

  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  }

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
  }, [tasks, storageKey, user]);

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  function addTask() {
    if (newTask.trim() !== "") {
      setTasks(t => [...t, { text: newTask, completed: false }]);
      setNewTask("");
    }
  }

  function deleteTask(index) {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);

    
  }

  function moveTaskUp(index) {
    if (index > 0) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index - 1]] =
        [updatedTasks[index - 1], updatedTasks[index]];
      setTasks(updatedTasks);
    }
  }

  function moveTaskDown(index) {
    if (index < tasks.length - 1) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index + 1]] =
        [updatedTasks[index + 1], updatedTasks[index]];
      setTasks(updatedTasks);
    }
  }
  

  function handleCheckboxChange(index){
    
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks)
  }

  function Completed(){
    setFilter("completed");
  }

  function Pending(){
    setFilter("pending");
  }

  function All(){
    setFilter("all");
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');

  };

  const handleStartEdit = (index) => {
    setEditIndex(index);
    setEditText(tasks[index].text);
  };

  const handleEditSubmit = (index) => {
    if(editText.trim() === '') return;
    const updatedTasks = [...tasks];
    updatedTasks[index].text = editText;
    setTasks(updatedTasks);
    setEditIndex(null);
    setEditText('');
  };



  return (
    <div className={darkMode ? 'dark' : ''}>

    <div className= "min-h-screen bg-gray-100 font-sans text-center pt-20 px-4 dark:bg-gray-700"  >

      <div className='text-right mb-4'>
        <button onClick={toggleTheme} className="px-4 py-2 border rounded text-sm font-semibold bg-gray-200 dark:bg-gray-700 dark:text-white ">
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <h1 className="text-4xl font-bold text-gray-800 mb-6 dark:text-white">To-Do-App</h1>

      <div className='mb-4 flex justify-center gap-4 flex-wrap'>
        <input
          type="text"
          placeholder='Enter a task...'
          value={newTask}
          onChange={handleInputChange}
          className="text-lg px-4 py-2 border border-gray-300 rounded-md focus:outline-none dark:text-black dark:bg-gray-400 dark:border-gray-600 dark: placeholder-black"
        />
        <button className='bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-md text-lg' onClick={addTask}>Add</button>
      </div>

      <div className=" py-2 px-4 mb-6 inline-block">
        <ul className='flex gap-4 justify-center'>
          <li><button className={`text-black font-medium dark:text-white ${filter === 'all' ? 'underline underline-offset-4' : ''}`} onClick={All}>All</button></li>
          <li><button className={`text-black font-medium dark:text-white ${filter === 'completed' ? 'underline underline-offset-4' : ''}`} onClick={Completed}>Completed</button></li>
          <li><button className={`text-black font-medium dark:text-white ${filter === 'pending' ? 'underline underline-offset-4' : ''}`} onClick={Pending}>Pending</button></li>
        </ul>
      </div>

      <ol className='space-y-4 max-w-xl mx-auto'>
        {filteredTasks.map((task, index) => {
          const actualIndex = tasks.indexOf(task);
          return(
            <li key={actualIndex} className='flex items-center justify-between bg-white p-4 border-2 border-gray-300 rounded-md dark:bg-gray-400 dark:text-white dark:border-gray-600'>
              {
                editIndex === actualIndex ? (
                  <input type="text" value={editText} autoFocus onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => handleEditSubmit(actualIndex)}
                  onKeyDown={(e) => {
                    if(e.key === 'Enter') handleEditSubmit(actualIndex);
                  }}
                  className='flex-1 mr-4 border-b-2 border-gray-400 outline-none dark:text-black dark:bg-gray-400 '
                />
                ) : (
                  <span className={`flex-1 mr-4 text-lg cursor-pointer  ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`} style={{textDecoration: task.completed ? "line-through" : "none", cursor: 'pointer'}}
                  onClick={() => handleStartEdit(actualIndex)}>
                    {task.text}
                  </span>
                )
              }
            <div className='flex items-center gap-2'>

            <button className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm' onClick={() => deleteTask(actualIndex)}>Delete</button>
            <button className='bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm' onClick={() => moveTaskUp(actualIndex)}>☝️</button>
            <button className='bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm' onClick={() => moveTaskDown(actualIndex)}>👇</button>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleCheckboxChange(actualIndex)}
              className='w-5 h-5 accent-green-500'
            />
            </div>

            </li>
          );
        })}
      </ol>

      <div className='mt-6' >
        <button className="text-black border px-4 py-2 rounded-md hover:bg-gray-400 font-medium dark:text-white dark:bg-gray-800 " onClick={handleLogout}>Logout</button>
      </div>
    </div>
    </div>
  );
}


export default Dashboard;
