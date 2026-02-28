App({
  globalData: {},

  onLaunch() {
    // 初始化本地存储结构
    try {
      const categories = wx.getStorageSync('categories');
      const items = wx.getStorageSync('items');
      if (!categories) {
        wx.setStorageSync('categories', []);
      }
      if (!items) {
        wx.setStorageSync('items', []);
      }
    } catch (e) {
      console.error('初始化本地存储失败', e);
    }
  }
});

// app.js
App({})
