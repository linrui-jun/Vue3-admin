<template>
  <div>
    <div class="page-modal">
      <el-dialog
        v-model="centerDialogVisible"
        title="新建用户"
        width="30%"
        center
        destroy-on-close
      >
        <my-form v-bind="modalConfig" v-model="formData"> </my-form>
        <slot></slot>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleConfirmClick"
              >确定</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

import MyForm from '../../../base-ui/form'
import { useStore } from '../../../store'

export default defineComponent({
  props: {
    modalConfig: {
      type: Object,
      required: true
    },
    defaultInfo: {
      type: Object,
      default: () => ({})
    },
    otherInfo: {
      type: Object,
      default: () => ({})
    },
    pageName: {
      type: String,
      required: true
    }
  },
  components: {
    MyForm
  },
  setup(props) {
    const centerDialogVisible = ref(false)
    const formData = ref<any>({})

    watch(
      () => props.defaultInfo,
      (newValue) => {
        for (const item of props.modalConfig.formItems) {
          formData.value[`${item.field}`] = newValue[`${item.field}`]
        }
      }
    )

    //点击确定按钮的逻辑
    const store = useStore()
    const handleConfirmClick = () => {
      centerDialogVisible.value = false
      if (Object.keys(props.defaultInfo).length) {
        //编辑
        console.log('编辑用户')
        store.dispatch('system/editPageDataAction', {
          pageName: props.pageName,
          editData: { ...formData.value, ...props.otherInfo },
          id: props.defaultInfo.id
        })
      } else {
        //新建
        console.log('新建用户')
        store.dispatch('system/createPageDataAction', {
          pageName: props.pageName,
          newData: { ...formData.value, ...props.otherInfo }
        })
      }
    }

    return { centerDialogVisible, formData, handleConfirmClick }
  }
})
</script>

<style scoped></style>
