<template>
  <div class="nav-header">
    <el-icon :size="30">
      <component
        class="fold-menu"
        :is="iconName"
        @click="handleFoldClick"
      ></component>
    </el-icon>
    <div class="content">
      <my-breadcrumb :breadcrumbs="breadcrumbs"></my-breadcrumb>
      <user-info></user-info>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import UserInfo from './user-info.vue'

import MyBreadcrumb from '../../../base-ui/breadcrumb/index'

import { pathMapBreadcrumbs } from '../../../utils/map-menus'
import { useStore } from '../../../store'
import { useRoute } from 'vue-router'

export default defineComponent({
  components: {
    UserInfo,
    MyBreadcrumb
  },

  emits: ['foldChange'],
  setup(props, { emit }) {
    let iconName = ref('Fold')
    const isFold = ref(false)
    const handleFoldClick = () => {
      isFold.value = !isFold.value
      if (isFold.value == false) {
        iconName.value = 'Expand'
      } else {
        iconName.value = 'Fold'
      }
      emit('foldChange', isFold.value)
    }

    //面包屑的数据: [[name: , path:]]
    const store = useStore()

    const breadcrumbs = computed(() => {
      const userMenus = store.state.login.userMenus
      const route = useRoute()
      const currentPath = route.path
      return pathMapBreadcrumbs(userMenus, currentPath)
    })

    return {
      iconName,
      isFold,
      handleFoldClick,
      breadcrumbs
    }
  }
})
</script>

<style scoped lang="less">
.nav-header {
  display: flex;
  width: 100%;

  .fold-menu {
    cursor: pointer;
  }

  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    padding: 0 20px;
  }
}
</style>
