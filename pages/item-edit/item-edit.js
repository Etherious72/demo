import {
  addItem,
  getItemById,
  updateItem
} from '../../utils/storage';

Page({
  data: {
    isEdit: false,
    itemId: '',
    categoryId: '',
    form: {
      name: '',
      note: '',
      address: '',
      sourceLink: '',
      status: 'todo'
    },
    statusOptions: [
      { value: 'todo', label: '未做' },
      { value: 'done', label: '已做' },
      { value: 'repeat', label: '可再选' }
    ],
    statusIndex: 0
  },

  onLoad(options) {
    const { id, categoryId } = options;
    if (id) {
      const item = getItemById(id);
      if (item) {
        const statusIndex = this.data.statusOptions.findIndex(
          s => s.value === item.status
        );
        this.setData({
          isEdit: true,
          itemId: id,
          categoryId: item.categoryId,
          form: {
            name: item.name,
            note: item.note,
            address: item.address,
            sourceLink: item.sourceLink,
            status: item.status
          },
          statusIndex: statusIndex >= 0 ? statusIndex : 0
        });
        wx.setNavigationBarTitle({
          title: '编辑内容'
        });
      }
    } else if (categoryId) {
      this.setData({
        categoryId
      });
      wx.setNavigationBarTitle({
        title: '新增内容'
      });
    }
  },

  onInputChange(e) {
    const key = e.currentTarget.dataset.key;
    const value = e.detail.value;
    this.setData({
      form: {
        ...this.data.form,
        [key]: value
      }
    });
  },

  onStatusChange(e) {
    const index = Number(e.detail.value);
    const status = this.data.statusOptions[index].value;
    this.setData({
      statusIndex: index,
      form: {
        ...this.data.form,
        status
      }
    });
  },

  handleSubmit() {
    const { form, isEdit, itemId, categoryId } = this.data;
    if (!form.name.trim()) {
      wx.showToast({
        title: '请输入名称',
        icon: 'none'
      });
      return;
    }

    if (!categoryId) {
      wx.showToast({
        title: '分类信息缺失',
        icon: 'none'
      });
      return;
    }

    const payload = {
      ...form,
      name: form.name.trim(),
      categoryId
    };

    if (isEdit) {
      updateItem(itemId, payload);
    } else {
      addItem(payload);
    }

    wx.showToast({
      title: '已保存',
      icon: 'success'
    });

    setTimeout(() => {
      wx.navigateBack();
    }, 400);
  }
});

