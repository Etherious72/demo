<template>
  <div class="page-wrapper" v-if="item">
    <t-card class="section" bordered>
      <template #title>
        <div class="flex-between">
          <div class="card-title-meta">
            <span class="page-title">{{ item.name }}</span>
            <span class="page-subtitle">{{ item.address || '暂无地址信息' }}</span>
          </div>
          <t-tag v-if="item.status === 'todo'" theme="warning" variant="light" size="medium">
            未做
          </t-tag>
          <t-tag v-else-if="item.status === 'done'" theme="success" variant="light" size="medium">
            已做
          </t-tag>
          <t-tag v-else theme="primary" variant="light" size="medium">
            可再选
          </t-tag>
        </div>
      </template>

      <div class="detail-block">
        <div class="detail-label">备注</div>
        <div class="detail-value">{{ item.note || '暂无备注' }}</div>
      </div>

      <t-divider style="margin: 16px 0;" />

      <div class="detail-block flex-between" style="align-items: flex-start; gap: 12px;">
        <div>
          <div class="detail-label">来源链接</div>
          <div class="detail-value mono" style="word-break: break-all; margin-top: 4px;">
            {{ item.sourceLink || '暂无' }}
          </div>
        </div>
        <t-space size="small">
          <t-button size="small" variant="outline" :icon="CopyIcon" @click="copyLink" :disabled="!item.sourceLink">
            复制
          </t-button>
          <t-button size="small" theme="primary" variant="outline" :icon="JumpIcon" @click="openLink" :disabled="!item.sourceLink">
            打开
          </t-button>
        </t-space>
      </div>
    </t-card>

    <t-card class="section" bordered>
      <template #title>
        <span class="page-title">状态管理</span>
      </template>
      <t-space size="small" style="flex-wrap: wrap;">
        <t-check-tag
          value="todo"
          :checked="item.status === 'todo'"
          size="medium"
          @change="() => changeStatus('todo')"
        >
          标记为未做
        </t-check-tag>
        <t-check-tag
          value="done"
          :checked="item.status === 'done'"
          size="medium"
          @change="() => changeStatus('done')"
        >
          标记为已做
        </t-check-tag>
        <t-check-tag
          value="repeat"
          :checked="item.status === 'repeat'"
          size="medium"
          @change="() => changeStatus('repeat')"
        >
          标记为可再选
        </t-check-tag>
      </t-space>
    </t-card>

    <div class="fixed-bottom">
      <div class="fixed-bottom-inner">
        <t-space size="small" style="width: 100%;">
          <t-popconfirm
            theme="danger"
            content="确定要删除该内容吗？"
            @confirm="onDelete"
          >
            <t-button theme="danger" variant="outline" shape="round" block>
              删除
            </t-button>
          </t-popconfirm>
          <t-button theme="primary" shape="round" block :icon="Edit1Icon" @click="onEdit">
            编辑
          </t-button>
        </t-space>
      </div>
    </div>
  </div>
  <div v-else class="page-wrapper">
    <t-empty description="内容不存在或已被删除" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDataStore } from '../store/dataStore';
import { MessagePlugin } from 'tdesign-vue-next';
import { CopyIcon, Edit1Icon, JumpIcon } from 'tdesign-icons-vue-next';

const route = useRoute();
const router = useRouter();
const store = useDataStore();

const id = route.params.id;

const item = computed(() => store.getItemById(id));

function changeStatus(status) {
  if (!item.value || item.value.status === status) return;
  store.updateItem(id, { status });
}

function onEdit() {
  router.push({ name: 'item-edit', params: { id } });
}

function onDelete() {
  if (!item.value) return;
  const categoryId = item.value.categoryId;
  store.deleteItem(id);
  MessagePlugin.success('已删除');
  router.push({ name: 'category', params: { id: categoryId } });
}

async function copyLink() {
  if (!item.value?.sourceLink) return;
  try {
    await navigator.clipboard.writeText(item.value.sourceLink);
    MessagePlugin.success('已复制链接');
  } catch {
    MessagePlugin.warning('复制失败（浏览器权限限制）');
  }
}

function openLink() {
  if (!item.value?.sourceLink) return;
  window.open(item.value.sourceLink, '_blank');
}
</script>

<style scoped>
.detail-block {
  margin-bottom: 4px;
}

.detail-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 14px;
  color: var(--color-text);
  line-height: 1.55;
}
</style>
