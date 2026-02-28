<template>
  <div class="page-wrapper">
    <t-card class="section" bordered>
      <template #title>
        <div class="card-title-meta">
          <span class="page-title">{{ isEdit ? '编辑内容' : '新增内容' }}</span>
          <span class="page-subtitle">信息越清晰，随机越省心</span>
        </div>
      </template>

      <t-form label-width="80" class="form-edit">
        <t-form-item label="名称" required>
          <t-input
            v-model="form.name"
            placeholder="例如：某某咖啡店 / 某某火锅"
            clearable
          />
        </t-form-item>

        <t-form-item label="备注">
          <t-textarea
            v-model="form.note"
            placeholder="可记录特色、推荐菜、适合场景等"
            :autosize="{ minRows: 3, maxRows: 6 }"
          />
        </t-form-item>

        <t-form-item label="地址">
          <t-input
            v-model="form.address"
            placeholder="如：XX路XX号 / 某某商场内"
            clearable
          />
        </t-form-item>

        <t-form-item label="来源链接">
          <t-input
            v-model="form.sourceLink"
            placeholder="小红书 / 大众点评等链接"
            clearable
          />
        </t-form-item>

        <t-form-item label="状态">
          <t-radio-group v-model="form.status">
            <t-radio value="todo">未做</t-radio>
            <t-radio value="done">已做</t-radio>
            <t-radio value="repeat">可再选</t-radio>
          </t-radio-group>
        </t-form-item>
      </t-form>
    </t-card>

    <div class="fixed-bottom">
      <div class="fixed-bottom-inner">
        <t-space size="small" style="width: 100%;">
          <t-button theme="default" variant="outline" shape="round" block @click="router.back()">
            取消
          </t-button>
          <t-button theme="primary" shape="round" block :icon="CheckIcon" @click="onSubmit">
            {{ isEdit ? '保存' : '保存' }}
          </t-button>
        </t-space>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDataStore } from '../store/dataStore';
import { MessagePlugin } from 'tdesign-vue-next';
import { CheckIcon } from 'tdesign-icons-vue-next';

const route = useRoute();
const router = useRouter();
const store = useDataStore();

const id = route.params.id;
const categoryIdParam = route.params.categoryId;

const isEdit = computed(() => !!id);

const form = reactive({
  name: '',
  note: '',
  address: '',
  sourceLink: '',
  status: 'todo'
});

let categoryId = categoryIdParam;

if (id) {
  const item = store.getItemById(id);
  if (item) {
    form.name = item.name;
    form.note = item.note;
    form.address = item.address;
    form.sourceLink = item.sourceLink;
    form.status = item.status || 'todo';
    categoryId = item.categoryId;
  }
}

function onSubmit() {
  if (!form.name.trim()) {
    MessagePlugin.warning('请输入名称');
    return;
  }
  if (!categoryId) {
    MessagePlugin.warning('分类信息缺失');
    return;
  }

  const payload = {
    categoryId,
    name: form.name.trim(),
    note: form.note?.trim() || '',
    address: form.address?.trim() || '',
    sourceLink: form.sourceLink?.trim() || '',
    status: form.status
  };

  if (isEdit.value) {
    store.updateItem(id, payload);
  } else {
    store.addItem(payload);
  }

  MessagePlugin.success('已保存');
  router.back();
}
</script>

<style scoped>
.form-edit :deep(.t-form-item) {
  margin-bottom: 20px;
}

.form-edit :deep(.t-form-item:last-child) {
  margin-bottom: 0;
}
</style>
