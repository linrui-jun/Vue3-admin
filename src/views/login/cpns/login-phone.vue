<template>
  <div class="login-phone">
    <el-form label-width="60px">
      <el-form-item label="手机号" prop="number">
        <el-input v-model="phone.number"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <div class="get-code">
          <el-input v-model="phone.code"></el-input>
          <el-button class="get-btn">获取验证码</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  setup() {
    const phone = reactive({
      number: '',
      code: ''
    })
    //点击立即登录之后在login-phone模块操作
    // const loginphoneAction = (isKeepPassword: boolean) => {
    //   console.log('点击立即登录之后在login-phone模块操作')
    // }
    return {
      phone
      // loginphoneAction
    }
  }
})
</script>

<style scoped>
.get-code {
  display: flex;
}
.get-btn {
  margin-left: 8px;
}
</style>
