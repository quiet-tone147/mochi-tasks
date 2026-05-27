
// ======================================
// MOCHI TASKS ✨
// FINAL CLEAN SCRIPT + CINEMATIC INTRO FIXED
// ======================================

// ===========================
// ELEMENTS
// ===========================

const popup = document.getElementById('popup');

const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');
const priorityInput = document.getElementById('priority');

const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

const completedCount = document.getElementById('completedCount');
const focusScore = document.getElementById('focusScore');

// AUDIO
const lofiAudio = document.getElementById('lofi');
const dingAudio = document.getElementById('ding');
const pianoAudio = document.getElementById('piano');
const windAudio = document.getElementById('wind');

// ===========================
// STORAGE
// ===========================

let tasks = JSON.parse(localStorage.getItem('mochiTasks')) || [];

// ===========================
// POPUP
// ===========================

function showPopup(text) {
  if (!popup) return;

  popup.textContent = text;
  popup.classList.add('show');

  setTimeout(() => popup.classList.remove('show'), 2000);
}

// ===========================
// TASK SYSTEM
// ===========================

function saveTasks() {
  localStorage.setItem('mochiTasks', JSON.stringify(tasks));
}

function renderTasks(filtered = tasks) {
  if (!taskList) return;

  taskList.innerHTML = '';

  filtered.forEach((task, index) => {
    const div = document.createElement('div');
    div.className = `task ${task.done ? 'done' : ''}`;

    div.innerHTML = `
      <div class="task-left">
        <div class="check" onclick="toggleTask(${index})">✔</div>
        <div>
          <div>${task.text}</div>
          <small>${task.priority}</small>
        </div>
      </div>
      <button class="delete" onclick="deleteTask(${index})">💖</button>
    `;

    taskList.appendChild(div);
  });

  updateStats();
}

function addTask() {
  const text = taskInput.value.trim();
  const priority = priorityInput.value;

  if (!text) return showPopup('🌸 Write a task first');

  tasks.push({ text, priority, done: false });

  saveTasks();
  renderTasks();

  taskInput.value = '';
  showPopup('✨ Task added');
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;

  saveTasks();
  renderTasks();

  dingAudio?.play().catch(() => {});
  showPopup(tasks[index].done ? '🌸 Task completed' : '✨ Task updated');
}

function deleteTask(index) {
  tasks.splice(index, 1);

  saveTasks();
  renderTasks();

  showPopup('🗑️ Task deleted');
}

// ===========================
// STATS
// ===========================

function updateStats() {
  const completed = tasks.filter(t => t.done).length;
  const total = tasks.length;

  const percent = total ? Math.round((completed / total) * 100) : 0;

  completedCount.textContent = completed;
  focusScore.textContent = percent + '%';

  progressText.textContent = percent + '%';
  progressBar.style.width = percent + '%';
}

// ===========================
// THEME
// ===========================

function toggleTheme() {
  document.body.classList.toggle('dark');

  localStorage.setItem(
    'mochiTheme',
    document.body.classList.contains('dark') ? 'dark' : 'light'
  );

  showPopup('🌙 Theme changed');
}

if (localStorage.getItem('mochiTheme') === 'dark') {
  document.body.classList.add('dark');
}

// ===========================
// AUDIO SYSTEM (FIXED)
// ===========================

const audios = {
  lofi: lofiAudio,
  ding: dingAudio,
  piano: pianoAudio,
  wind: windAudio
};

let audioUnlocked = false;

function unlockAudio() {
  if (audioUnlocked) return;

  Object.values(audios).forEach(audio => {
    if (!audio) return;

    audio.muted = true;
    audio.play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.muted = false;
      })
      .catch(() => {});
  });

  audioUnlocked = true;
}

document.addEventListener('click', unlockAudio, { once: true });

// ===========================
// MUSIC CONTROL
// ===========================

function playMusic(type) {
  const audio = audios[type];

  if (!audio) return showPopup('⚠️ Audio not found');

  const start = () => {
    Object.values(audios).forEach(a => {
      if (!a) return;
      a.pause();
      a.currentTime = 0;
    });

    audio.currentTime = 0;
    audio.volume = 0.5;

    audio.play()
      .then(() => showPopup('🎧 Playing'))
      .catch(() => showPopup('⚠️ Tap once then try again'));
  };

  if (!audioUnlocked) {
    unlockAudio();
    setTimeout(start, 300);
  } else {
    start();
  }
}

function stopMusic() {
  Object.values(audios).forEach(a => {
    if (!a) return;
    a.pause();
    a.currentTime = 0;
  });

  showPopup('🌙 Music stopped');
}

// ===========================
// CINEMATIC INTRO 🌸
// ===========================

window.addEventListener("load", () => {
  const container = document.getElementById("petalContainer");

  if (!container) return;

  const count = 24;

  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "petal";

    const angle = (Math.PI * 2 * i) / count;
    const radius = 70 + Math.random() * 20;

    const x = Math.cos(angle) * radius + "px";
    const y = Math.sin(angle) * radius + "px";

    p.style.setProperty("--x", x);
    p.style.setProperty("--y", y);

    p.style.left = "50%";
    p.style.top = "60px";

    p.style.animationDelay = (1.4 + Math.random() * 0.6) + "s";

    container.appendChild(p);
  }

  // remove intro smoothly
  setTimeout(() => {
    const intro = document.getElementById("intro");
    if (intro) {
      intro.style.opacity = "0";
      intro.style.transform = "scale(1.1)";
      setTimeout(() => intro.remove(), 1200);
    }
  }, 6000);
});

// ===========================
// CURSOR GLOW FOLLOW
// ===========================

document.addEventListener("mousemove", (e) => {
  const glow = document.querySelector(".glow");
  if (!glow) return;

  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

// ===========================
// SOUND START (PIANO + WIND)
// ===========================

document.addEventListener("click", () => {
  pianoAudio?.play().catch(() => {});
  windAudio?.play().catch(() => {});
}, { once: true });

// ===========================
// INIT
// ===========================

renderTasks();
updateStats();