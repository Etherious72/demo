import {
  getCategories,
  getItemsByCategory
} from '../../utils/storage';

Page({
  data: {
    categoryId: '',
    category: {},
    items: [],
    displayItems: [],
    statusFilter: 'all',
    todoCount: 0,
    randomResult: null
  },

  onLoad(options) {
    const { id } = options;
    this.setData({ categoryId: id || '' });
  },

  onShow() {
    this.refreshData();
  },

  refreshData() {
    const { categoryId, statusFilter } = this.data;
    const categories = getCategories();
    const category = categories.find(c => c.id === categoryId) || {};
    const items = getItemsByCategory(categoryId).sort(
      (a, b) => b.createTime - a.createTime
    );
    const todoCount = items.filter(i => i.status === 'todo').length;
    const displayItems = this.filterByStatus(items, statusFilter);
    this.setData({
      category,
      items,
      displayItems,
      todoCount
    });
  },

  filterByStatus(list, status) {
    if (status === 'all') return list;
    return list.filter(i => i.status === status);
  },

  changeStatusFilter(e) {
    const status = e.currentTarget.dataset.status;
    const displayItems = this.filterByStatus(this.data.items, status);
    this.setData({
      statusFilter: status,
      displayItems
    });
  },

  handleRandom() {
    const { items } = this.data;
    if (!items.length) {
      wx.showToast({
        title: '该分类下暂无内容',
        icon: 'none'
      });
      return;
    }

    // 默认优先从未做中随机
    const todoList = items.filter(i => i.status === 'todo');
    let candidate = todoList;

    if (!todoList.length) {
      // 未做为空时，从可再选中选择
      const repeatList = items.filter(i => i.status === 'repeat');
      if (!repeatList.length) {
        wx.showToast({
          title: '没有可随机的内容',
          icon: 'none'
        });
        return;
      }
      candidate = repeatList;
      wx.showToast({
        title: '未做为空，已从可再选中抽取',
        icon: 'none'
      });
    }

    const idx = Math.floor(Math.random() * candidate.length);
    this.setData({
      randomResult: candidate[idx]
    });
  },

  addItem() {
    const { categoryId } = this.data;
    wx.navigateTo({
      url: `/pages/item-edit/item-edit?categoryId=${categoryId}`
    });
  },

  goItemDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/item-detail/item-detail?id=${id}`
    });
  }
});

