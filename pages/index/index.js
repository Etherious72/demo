import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getItems
} from '../../utils/storage';

Page({
  data: {
    categories: [],
    randomResult: null
  },

  onShow() {
    this.refreshCategories();
  },

  refreshCategories() {
    const categories = getCategories();
    const items = getItems();
    const withCount = categories.map(c => {
      const inCat = items.filter(i => i.categoryId === c.id);
      const todoCount = inCat.filter(i => i.status === 'todo').length;
      return {
        ...c,
        count: inCat.length,
        todoCount
      };
    });
    this.setData({ categories: withCount });
  },

  handleAddCategory() {
    wx.showModal({
      title: '新增分类',
      editable: true,
      placeholderText: '请输入分类名称，如：🍜 吃饭',
      success: res => {
        if (res.confirm && res.content) {
          addCategory(res.content.trim());
          this.refreshCategories();
        }
      }
    });
  },

  onCategoryActions(e) {
    const { id, name } = e.currentTarget.dataset;
    wx.showActionSheet({
      itemList: ['重命名', '删除'],
      success: res => {
        if (res.tapIndex === 0) {
          // 重命名
          wx.showModal({
            title: '重命名分类',
            editable: true,
            placeholderText: '请输入新的分类名称',
            content: name,
            success: modalRes => {
              if (modalRes.confirm && modalRes.content) {
                updateCategory(id, modalRes.content.trim());
                this.refreshCategories();
              }
            }
          });
        } else if (res.tapIndex === 1) {
          // 删除
          wx.showModal({
            title: '删除确认',
            content: '删除分类会同时删除该分类下的所有项目，确定删除？',
            success: modalRes => {
              if (modalRes.confirm) {
                deleteCategory(id);
                this.refreshCategories();
              }
            }
          });
        }
      }
    });
  },

  goCategory(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/category/category?id=${id}`
    });
  },

  quickRandom() {
    const items = getItems().filter(i => i.status === 'todo');
    if (!items.length) {
      wx.showToast({
        title: '还没有未做项目',
        icon: 'none'
      });
      return;
    }
    const idx = Math.floor(Math.random() * items.length);
    const picked = items[idx];
    const categories = getCategories();
    const cat = categories.find(c => c.id === picked.categoryId);
    this.setData({
      randomResult: {
        ...picked,
        categoryName: cat ? cat.name : '未分类'
      }
    });
  },

  goItemDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/item-detail/item-detail?id=${id}`
    });
  }
});

// index.js
Page({})
