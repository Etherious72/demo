const CATEGORY_KEY = 'categories';
const ITEM_KEY = 'items';

function now() {
  return Date.now();
}

export function getCategories() {
  try {
    return wx.getStorageSync(CATEGORY_KEY) || [];
  } catch (e) {
    console.error('读取分类失败', e);
    return [];
  }
}

export function saveCategories(list) {
  try {
    wx.setStorageSync(CATEGORY_KEY, list);
  } catch (e) {
    console.error('保存分类失败', e);
  }
}

export function addCategory(name) {
  const list = getCategories();
  const id = 'c_' + now();
  const ts = now();
  list.push({ id, name, createTime: ts, updateTime: ts });
  saveCategories(list);
  return list;
}

export function updateCategory(id, name) {
  const list = getCategories();
  const ts = now();
  const updated = list.map(c =>
    c.id === id ? { ...c, name, updateTime: ts } : c
  );
  saveCategories(updated);
  return updated;
}

export function deleteCategory(id) {
  const list = getCategories().filter(c => c.id !== id);
  saveCategories(list);

  // 同时删除该分类下的项目
  const items = getItems().filter(item => item.categoryId !== id);
  saveItems(items);
  return list;
}

export function getItems() {
  try {
    return wx.getStorageSync(ITEM_KEY) || [];
  } catch (e) {
    console.error('读取项目失败', e);
    return [];
  }
}

export function saveItems(list) {
  try {
    wx.setStorageSync(ITEM_KEY, list);
  } catch (e) {
    console.error('保存项目失败', e);
  }
}

export function getItemsByCategory(categoryId) {
  return getItems().filter(item => item.categoryId === categoryId);
}

export function addItem(data) {
  const list = getItems();
  const id = 'i_' + now();
  const ts = now();
  list.push({
    id,
    categoryId: data.categoryId,
    name: data.name,
    image: data.image || '',
    note: data.note || '',
    address: data.address || '',
    sourceLink: data.sourceLink || '',
    status: data.status || 'todo',
    createTime: ts,
    updateTime: ts
  });
  saveItems(list);
  return list;
}

export function updateItem(id, data) {
  const list = getItems();
  const ts = now();
  const updated = list.map(item =>
    item.id === id
      ? {
          ...item,
          ...data,
          updateTime: ts
        }
      : item
  );
  saveItems(updated);
  return updated;
}

export function deleteItem(id) {
  const list = getItems().filter(item => item.id !== id);
  saveItems(list);
  return list;
}

export function getItemById(id) {
  return getItems().find(item => item.id === id);
}

