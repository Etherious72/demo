import Home from '../views/Home.vue';
import Category from '../views/Category.vue';
import ItemDetail from '../views/ItemDetail.vue';
import ItemEdit from '../views/ItemEdit.vue';

export default [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      title: '吃喝玩乐随机决策',
      subtitle: '分类管理 · 随机决定'
    }
  },
  {
    path: '/category/:id',
    name: 'category',
    component: Category,
    props: true,
    meta: {
      title: '分类',
      subtitle: '筛选 · 随机 · 新增'
    }
  },
  {
    path: '/item/:id',
    name: 'item-detail',
    component: ItemDetail,
    props: true,
    meta: {
      title: '内容详情',
      subtitle: '状态管理 · 快速操作'
    }
  },
  {
    path: '/item/new/:categoryId',
    name: 'item-new',
    component: ItemEdit,
    props: true,
    meta: {
      title: '新增内容',
      subtitle: '完善信息，方便下次随机'
    }
  },
  {
    path: '/item/:id/edit',
    name: 'item-edit',
    component: ItemEdit,
    props: true,
    meta: {
      title: '编辑内容',
      subtitle: '更新信息与状态'
    }
  }
];

