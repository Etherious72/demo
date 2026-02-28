import {
  getItemById,
  updateItem,
  deleteItem
} from '../../utils/storage';

Page({
  data: {
    id: '',
    item: null
  },

  onLoad(options) {
    const { id } = options;
    this.setData({ id: id || '' });
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    const { id } = this.data;
    const item = getItemById(id);
    if (!item) {
      wx.showToast({
        title: '数据不存在',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 600);
      return;
    }
    this.setData({ item });
  },

  changeStatus(e) {
    const status = e.currentTarget.dataset.status;
    const { id, item } = this.data;
    if (item.status === status) return;
    updateItem(id, { status });
    this.refresh();
  },

  handleEdit() {
    const { id } = this.data;
    wx.navigateTo({
      url: `/pages/item-edit/item-edit?id=${id}`
    });
  },

  handleDelete() {
    const { id } = this.data;
    wx.showModal({
      title: '删除确认',
      content: '确定删除该内容吗？',
      success: res => {
        if (res.confirm) {
          deleteItem(id);
          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 400);
        }
      }
    });
  }
});

