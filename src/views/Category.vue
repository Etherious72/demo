<template>
  <div class="page-wrapper" v-if="category">
    <t-card class="section" bordered>
      <template #title>
        <div class="card-title-row">
          <div class="card-title-meta">
            <span class="page-title">{{ category.name }}</span>
            <span class="page-subtitle">共 {{ items.length }} 项 · 未做 {{ todoCount }}</span>
          </div>
          <t-button theme="primary" shape="round" size="small" variant="outline" :icon="DiceIcon" @click="onRandom">
            随机
          </t-button>
        </div>
      </template>

      <t-space size="small" style="flex-wrap: wrap; margin-bottom: 12px;">
        <t-check-tag
          v-for="s in statusOptions"
          :key="s.value"
          :checked="statusFilter === s.value"
          size="medium"
          @change="() => (statusFilter = s.value)"
        >
          {{ s.label }}
        </t-check-tag>
      </t-space>

      <div class="mt-16">
        <template v-if="displayItems.length">
          <t-list split>
            <t-list-item
              v-for="item in displayItems"
              :key="item.id"
              class="list-item-clickable"
              @click="goItemDetail(item.id)"
            >
              <template #content>
                <div class="flex-between">
                  <div>
                    <div class="list-item-title">{{ item.name }}</div>
                    <div class="list-item-desc">{{ item.note || '暂无备注' }}</div>
                  </div>
                  <t-tag v-if="item.status === 'todo'" theme="warning" variant="light" size="small">
                    未做
                  </t-tag>
                  <t-tag v-else-if="item.status === 'done'" theme="success" variant="light" size="small">
                    已做
                  </t-tag>
                  <t-tag v-else theme="primary" variant="light" size="small">
                    可再选
                  </t-tag>
                </div>
              </template>
            </t-list-item>
          </t-list>
        </template>
        <template v-else>
          <t-empty description="该分类下还没有内容，点击下方按钮新增吧～" />
        </template>
      </div>
    </t-card>

    <t-drawer
      v-model:visible="randomDrawerVisible"
      placement="bottom"
      :size="320"
      :footer="false"
      :show-overlay="true"
    >
      <template #header>
        <div class="flex-between" style="width: 100%;">
          <span class="page-title" style="margin: 0;">本次随机结果</span>
          <t-button size="small" variant="outline" :icon="RefreshIcon" @click="onRandom">
            再来一次
          </t-button>
        </div>
      </template>
      <div v-if="randomResult" class="highlight-card">
        <div class="list-item-title" style="font-size: 18px; margin-bottom: 6px;">
          {{ randomResult.name }}
        </div>
        <div class="list-item-desc" style="margin-bottom: 12px;">
          {{ randomResult.note || '暂无备注' }}
        </div>
        <t-tag theme="warning" variant="light" size="small">{{ randomPickTip }}</t-tag>
        <t-space class="mt-16" direction="vertical" style="width: 100%;">
          <t-button theme="primary" shape="round" block :icon="BrowseIcon" @click="goItemDetail(randomResult.id)">
            查看详情
          </t-button>
          <t-button theme="default" variant="outline" shape="round" block @click="randomDrawerVisible = false">
            先不决定
          </t-button>
        </t-space>
      </div>
    </t-drawer>

    <div class="fixed-bottom">
      <div class="fixed-bottom-inner">
        <t-button theme="primary" shape="round" block :icon="AddIcon" @click="onAddItem">
          新增内容
        </t-button>
      </div>
    </div>
  </div>
  <div v-else class="page-wrapper">
    <t-empty description="分类不存在或已被删除" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDataStore } from '../store/dataStore';
import { MessagePlugin } from 'tdesign-vue-next';
import { AddIcon, BrowseIcon, DiceIcon, RefreshIcon } from 'tdesign-icons-vue-next';

const route = useRoute();
const router = useRouter();
const store = useDataStore();

const categoryId = route.params.id;

const category = computed(() => store.getCategoryById(categoryId));
const items = computed(() => store.getItemsByCategory(categoryId));
const todoCount = computed(() => items.value.filter((i) => i.status === 'todo').length);

const statusOptions = [
  { value: 'all', label: '全部' },
  { value: 'todo', label: '未做' },
  { value: 'done', label: '已做' },
  { value: 'repeat', label: '可再选' }
];

const statusFilter = ref('all');
const randomResult = ref(null);
const randomDrawerVisible = ref(false);
const randomPickTip = ref('优先从未做抽取');

const displayItems = computed(() => {
  if (statusFilter.value === 'all') return items.value;
  return items.value.filter((i) => i.status === statusFilter.value);
});

function onRandom() {
  const all = items.value || [];
  if (!all.length) {
    MessagePlugin.warning('该分类下暂无内容');
    randomResult.value = null;
    randomDrawerVisible.value = false;
    return;
  }

  const todo = all.filter((i) => i.status === 'todo');
  if (todo.length) {
    randomPickTip.value = '优先从未做抽取';
    randomResult.value = todo[Math.floor(Math.random() * todo.length)];
  } else {
    const repeat = all.filter((i) => i.status === 'repeat');
    if (!repeat.length) {
      MessagePlugin.warning('没有可随机的内容（未做/可再选为空）');
      randomResult.value = null;
      randomDrawerVisible.value = false;
      return;
    }
    randomPickTip.value = '未做为空：已从可再选抽取';
    randomResult.value = repeat[Math.floor(Math.random() * repeat.length)];
    MessagePlugin.info('未做为空，已从可再选中抽取');
  }

  randomDrawerVisible.value = true;
}

function onAddItem() {
  router.push({ name: 'item-new', params: { categoryId } });
}

function goItemDetail(id) {
  router.push({ name: 'item-detail', params: { id } });
}
</script>
