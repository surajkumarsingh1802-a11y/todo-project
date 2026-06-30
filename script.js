const PERIODS = [
  { key: 'morning', label: 'Morning' },
  { key: 'afternoon', label: 'Afternoon' },
  { key: 'evening', label: 'Evening' }
];

let tasks = [];

const sectionsContainer = document.getElementById('sectionsContainer');
const taskInput = document.getElementById('taskInput');
const periodSelect = document.getElementById('periodSelect');
const addBtn = document.getElementById('addBtn');
const globalEmpty = document.getElementById('globalEmpty');
const arcFg = document.getElementById('arcFg');
const arcLabel = document.getElementById('arcLabel');
const progressHeadline = document.getElementById('progressHeadline');
const progressSub = document.getElementById('progressSub');
const taskCountSummary = document.getElementById('taskCountSummary');

function formatDate() {
  const d = new Date();
  const opts = { weekday: 'long', month: 'long', day: 'numeric' };
  return d.toLocaleDateString('en-US', opts);
}
document.getElementById('todayDate').textContent = formatDate();

function uid() {
  return 't' + Math.random().toString(36).slice(2, 10);
}

function addTask(text, period) {
  tasks.push({ id: uid(), text, period, done: false, createdAt: Date.now() });
  render();
}

function toggleTask(id) {
  const t = tasks.find(x => x.id === id);
  if (t) t.done = !t.done;
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(x => x.id !== id);
  render();
}

function render() {
  sectionsContainer.innerHTML = '';

  if (tasks.length === 0) {
    globalEmpty.style.display = 'block';
  } else {
    globalEmpty.style.display = 'none';
  }

  PERIODS.forEach(period => {
    const items = tasks.filter(t => t.period === period.key);
    const section = document.createElement('div');
    section.className = 'section';

    const head = document.createElement('div');
    head.className = 'section-head';
    head.innerHTML = `<h2>${period.label}</h2><span class="count">${items.length ? items.filter(t=>t.done).length + ' / ' + items.length : ''}</span>`;
    section.appendChild(head);

    const list = document.createElement('div');
    list.className = 'task-list';

    if (items.length === 0) {
      const note = document.createElement('div');
      note.className = 'empty-note';
      note.textContent = 'Nothing planned yet.';
      list.appendChild(note);
    } else {
      items.forEach(t => {
        const row = document.createElement('div');
        row.className = 'task' + (t.done ? ' done' : '');

        const cb = document.createElement('div');
        cb.className = 'checkbox' + (t.done ? ' checked' : '');
        cb.addEventListener('click', () => toggleTask(t.id));

        const label = document.createElement('div');
        label.className = 'task-label';
        label.textContent = t.text;
        label.addEventListener('click', () => toggleTask(t.id));

        const del = document.createElement('button');
        del.className = 'del-btn';
        del.innerHTML = '&times;';
        del.setAttribute('aria-label', 'Delete task');
        del.addEventListener('click', () => deleteTask(t.id));

        row.appendChild(cb);
        row.appendChild(label);
        row.appendChild(del);
        list.appendChild(row);
      });
    }

    section.appendChild(list);
    sectionsContainer.appendChild(section);
  });

  updateProgress();
}

function updateProgress() {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const circumference = 2 * Math.PI * 23;
  const dash = (pct / 100) * circumference;
  arcFg.setAttribute('stroke-dasharray', `${dash} ${circumference}`);
  arcLabel.textContent = pct + '%';

  if (total === 0) {
    progressHeadline.textContent = "A clean page to start with.";
    progressSub.textContent = "Add your first task below.";
    taskCountSummary.textContent = '';
  } else if (done === total) {
    progressHeadline.textContent = "Every task crossed off.";
    progressSub.textContent = "That's a good day's work.";
    taskCountSummary.textContent = `${total} of ${total} done`;
  } else {
    progressHeadline.textContent = `${done} of ${total} done.`;
    progressSub.textContent = total - done === 1 ? "One left to go." : `${total - done} left to go.`;
    taskCountSummary.textContent = `${done} of ${total} done`;
  }
}

function handleAdd() {
  const text = taskInput.value.trim();
  if (!text) {
    taskInput.focus();
    return;
  }
  addTask(text, periodSelect.value);
  taskInput.value = '';
  taskInput.focus();
}

addBtn.addEventListener('click', handleAdd);
taskInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleAdd();
});

render();
