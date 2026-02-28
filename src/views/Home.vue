<template>
  <div class="page-wrapper">
    <t-card class="section" bordered>
      <template #title>
        <div class="card-title-row">
          <div class="card-title-meta">
            <span class="page-title">我的分类</span>
            <span class="page-subtitle">整理你的吃喝玩乐收藏</span>
          </div>
          <t-button theme="primary" shape="round" size="small" :icon="AddIcon" @click="openAddDialog">
            新增分类
          </t-button>
        </div>
      </template>

      <template v-if="categoriesWithStats.length">
        <t-list split>
          <t-list-item
            v-for="c in categoriesWithStats"
            :key="c.id"
            class="list-item-clickable"
            @click="goCategory(c.id)"
          >
            <template #content>
              <div class="flex-between">
                <div>
                  <div class="list-item-title">{{ c.name }}</div>
                  <div class="list-item-desc">共 {{ c.count }} 项 · 未做 {{ c.todoCount }}</div>
                </div>
                <t-space size="small" @click.stop>
                  <t-button size="small" variant="text" :icon="Edit1Icon" @click.stop="openRenameDialog(c)">
                    重命名
                  </t-button>
                  <t-popconfirm
                    theme="danger"
                    content="删除分类会一并删除其下所有内容，确定删除？"
                    @confirm="onDelete(c)"
                  >
                    <t-button size="small" theme="danger" variant="text" :icon="DeleteIcon" @click.stop>
                      删除
                    </t-button>
                  </t-popconfirm>
                </t-space>
              </div>
            </template>
          </t-list-item>
        </t-list>
      </template>
      <template v-else>
        <t-empty description="还没有任何分类，先创建一个吧～" />
      </template>
    </t-card>

    <t-card class="section" bordered>
      <template #title>
        <div class="card-title-row">
          <div class="card-title-meta">
            <span class="page-title">快速随机</span>
            <span class="page-subtitle">从所有未做项目中抽一个</span>
          </div>
          <t-button theme="primary" variant="outline" shape="round" size="small" :icon="DiceIcon" @click="onQuickRandom">
            一键随机
          </t-button>
        </div>
      </template>

      <template v-if="randomResult">
        <div class="highlight-card list-item-clickable" @click="goItemDetail(randomResult.id)">
          <div class="flex-between">
            <div>
              <div class="list-item-title" style="font-size: 16px;">{{ randomResult.name }}</div>
              <div class="list-item-desc">{{ randomResult.categoryName }}</div>
            </div>
            <t-tag theme="warning" variant="light" size="small">未做</t-tag>
          </div>
        </div>
      </template>
      <template v-else>
        <p class="muted" style="margin: 0; padding: 8px 0; font-size: 13px;">
          还没有未做项目，先为分类添加一些内容吧。
        </p>
      </template>
    </t-card>

    <t-dialog
      v-model:visible="categoryDialog.visible"
      :header="categoryDialog.mode === 'add' ? '新增分类' : '重命名分类'"
      :confirm-btn="{ content: '保存' }"
      :cancel-btn="{ content: '取消' }"
      @confirm="submitCategoryDialog"
    >
      <t-form>
        <t-form-item label="分类名称" required>
          <t-input v-model="categoryDialog.name" placeholder="例如：🍜 吃饭 / ☕ 咖啡" />
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDataStore } from '../store/dataStore';
import { MessagePlugin } from 'tdesign-vue-next';
import { AddIcon, DeleteIcon, DiceIcon, Edit1Icon } from 'tdesign-icons-vue-next';

const router = useRouter();
const store = useDataStore();

const { categoriesWithStats, quickRandomTodo, addCategory, updateCategory, deleteCategory, state } =
  store;

const randomResult = ref(null);

function goCategory(id) {
  router.push({ name: 'category', params: { id } });
}

const categoryDialog = ref({
  visible: false,
  mode: 'add',
  id: '',
  name: ''
});

function openAddDialog() {
  categoryDialog.value = {
    visible: true,
    mode: 'add',
    id: '',
    name: ''
  };
}

function openRenameDialog(category) {
  categoryDialog.value = {
    visible: true,
    mode: 'rename',
    id: category.id,
    name: category.name
  };
}

function submitCategoryDialog() {
  const name = (categoryDialog.value.name || '').trim();
  if (!name) {
    MessagePlugin.warning('请输入分类名称');
    return false;
  }
  if (categoryDialog.value.mode === 'add') {
    addCategory(name);
    MessagePlugin.success('已新增分类');
  } else {
    updateCategory(categoryDialog.value.id, name);
    MessagePlugin.success('已更新分类名称');
  }
  categoryDialog.value.visible = false;
  return true;
}

function onDelete(category) {
  deleteCategory(category.id);
  MessagePlugin.success('已删除分类');
}

function onQuickRandom() {
  const picked = quickRandomTodo();
  if (!picked) {
    randomResult.value = null;
    MessagePlugin.warning('还没有未做项目，先添加一些吧～');
    return;
  }
  const cat = state.categories.find((c) => c.id === picked.categoryId);
  randomResult.value = {
    ...picked,
    categoryName: cat ? cat.name : '未分类'
  };
  MessagePlugin.success('已为你随机一个');
}

function goItemDetail(id) {
  router.push({ name: 'item-detail', params: { id } });
}
</script>
