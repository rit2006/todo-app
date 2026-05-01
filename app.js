
// ─── State ───────────────────────────────────────────────────────────────────
let todos = [];
let filter = 'all';
let nextId = 1;

// ─── Core Functions (exported for testing) ───────────────────────────────────

function createTodo(text) {
  if (!text || text.trim() === '') throw new Error('Todo text cannot be empty');
  return { id: nextId++, text: text.trim(), done: false };
}

function addTodoItem(text) {
  const todo = createTodo(text);
  todos.push(todo);
  render();
  return todo;
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) throw new Error(`Todo with id ${id} not found`);
  todo.done = !todo.done;
  render();
  return todo;
}

function deleteTodo(id) {
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) throw new Error(`Todo with id ${id} not found`);
  todos.splice(index, 1);
  render();
}

function clearCompleted() {
  todos = todos.filter(t => !t.done);
  render();
}

function getFiltered() {
  if (filter === 'active') return todos.filter(t => !t.done);
  if (filter === 'done')   return todos.filter(t => t.done);
  return todos;
}

function getPendingCount() {
  return todos.filter(t => !t.done).length;
}

// ─── UI Functions ─────────────────────────────────────────────────────────────

function render() {
  const list = document.getElementById('todoList');
  if (!list) return;

  const shown = getFiltered();

  if (shown.length === 0) {
    list.innerHTML = '<li class="empty">Nothing here yet ✓</li>';
  } else {
    list.innerHTML = shown.map(t => `
      <li class="todo-item${t.done ? ' done' : ''}" id="todo-${t.id}">
        <input
          type="checkbox"
          id="cb-${t.id}"
          ${t.done ? 'checked' : ''}
          onchange="toggleTodo(${t.id})"
        />
        <label for="cb-${t.id}">${escapeHtml(t.text)}</label>
        <button class="delete-btn" onclick="deleteTodo(${t.id})" title="Delete">×</button>
      </li>
    `).join('');
  }

  const pending = getPendingCount();
  const countLabel = document.getElementById('countLabel');
  if (countLabel) {
    countLabel.textContent = `${pending} task${pending !== 1 ? 's' : ''} left`;
  }
}

function addTodo() {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();
  if (!text) return;
  addTodoItem(text);
  input.value = '';
  input.focus();
}

function clearDone() {
  clearCompleted();
}

function setFilter(f, el) {
  filter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  render();
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Keyboard shortcut ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('todoInput');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') addTodo();
    });
  }
  render();
});

// ─── Export for Node.js tests ─────────────────────────────────────────────────
if (typeof module !== 'undefined') {
  module.exports = { createTodo, addTodoItem, toggleTodo, deleteTodo, clearCompleted, getFiltered, getPendingCount };
}
