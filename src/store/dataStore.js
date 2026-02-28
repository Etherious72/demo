import { reactive, computed } from 'vue';

const CATEGORY_KEY = 'chwl_categories';
const ITEM_KEY = 'chwl_items';

function now() {
  return Date.now();
}

function load(key, fallback) {
  try {
    const text = localStorage.getItem(key);
    if (!text) return fallback;
    return JSON.parse(text);
  } catch (e) {
    console.error('load error', e);
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('save error', e);
  }
}

const state = reactive({
  categories: load(CATEGORY_KEY, []),
  items: load(ITEM_KEY, [])
});

function persist() {
  save(CATEGORY_KEY, state.categories);
  save(ITEM_KEY, state.items);
}

export function useDataStore() {
  const categoriesWithStats = computed(() =>
    state.categories.map((c) => {
      const inCat = state.items.filter((i) => i.categoryId === c.id);
      const todoCount = inCat.filter((i) => i.status === 'todo').length;
      return {
        ...c,
        count: inCat.length,
        todoCount
      };
    })
  );

  function addCategory(name) {
    const ts = now();
    state.categories.push({
      id: 'c_' + ts,
      name,
      createTime: ts,
      updateTime: ts
    });
    persist();
  }

  function updateCategory(id, name) {
    const ts = now();
    state.categories = state.categories.map((c) =>
      c.id === id ? { ...c, name, updateTime: ts } : c
    );
    persist();
  }

  function deleteCategory(id) {
    state.categories = state.categories.filter((c) => c.id !== id);
    state.items = state.items.filter((i) => i.categoryId !== id);
    persist();
  }

  function addItem(payload) {
    const ts = now();
    state.items.push({
      id: 'i_' + ts,
      createTime: ts,
      updateTime: ts,
      status: 'todo',
      ...payload
    });
    persist();
  }

  function updateItem(id, payload) {
    const ts = now();
    state.items = state.items.map((i) =>
      i.id === id ? { ...i, ...payload, updateTime: ts } : i
    );
    persist();
  }

  function deleteItem(id) {
    state.items = state.items.filter((i) => i.id !== id);
    persist();
  }

  function getCategoryById(id) {
    return state.categories.find((c) => c.id === id);
  }

  function getItemsByCategory(id) {
    return state.items
      .filter((i) => i.categoryId === id)
      .sort((a, b) => b.createTime - a.createTime);
  }

  function getItemById(id) {
    return state.items.find((i) => i.id === id);
  }

  function randomPickInCategory(categoryId) {
    const items = getItemsByCategory(categoryId);
    if (!items.length) return null;
    const todo = items.filter((i) => i.status === 'todo');
    let pool = todo;
    if (!pool.length) {
      const repeat = items.filter((i) => i.status === 'repeat');
      pool = repeat;
      if (!pool.length) return null;
    }
    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
  }

  function quickRandomTodo() {
    const pool = state.items.filter((i) => i.status === 'todo');
    if (!pool.length) return null;
    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
  }

  return {
    state,
    categoriesWithStats,
    addCategory,
    updateCategory,
    deleteCategory,
    addItem,
    updateItem,
    deleteItem,
    getCategoryById,
    getItemsByCategory,
    getItemById,
    randomPickInCategory,
    quickRandomTodo
  };
}

