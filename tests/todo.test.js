
const { createTodo, toggleTodo } = require('../app.js');

test('createTodo creates task with correct text', () => {
  const todo = createTodo('Buy groceries');
  expect(todo.text).toBe('Buy groceries');
});

test('createTodo sets done to false by default', () => {
  const todo = createTodo('Walk the dog');
  expect(todo.done).toBe(false);
});

test('createTodo throws error on empty string', () => {
  expect(() => createTodo('')).toThrow('Todo text cannot be empty');
});

test('toggleTodo marks task as done', () => {
  const todo = createTodo('Test task');
  todo.done = true;
  expect(todo.done).toBe(true);
});
