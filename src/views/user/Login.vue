<template>
  <div class="main">
    <a-form id="formLogin" ref="formLogin" :form="form" class="user-layout-login">
      <a-tabs
        :active-key="customActiveKey"
        :tab-bar-style="{ textAlign: 'center', borderBottom: 'unset' }"
      >
        <a-tab-pane key="tab1" tab="账号密码登陆">
          <a-form-item>
            <a-input
              v-decorator="['username',validatorRules.username]"
              size="large"
              type="text"
              placeholder="请输入用户名"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input
              v-decorator="['password',validatorRules.password]"
              size="large"
              type="password"
              autocomplete="false"
              placeholder="请输入密码"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>
          <div>
            <a-row :gutter="0">
              <a-col :span="14">
                <a-form-item>
                  <a-input
                    v-decorator="['inputCode',validatorRules.inputCode]"
                    size="large"
                    type="text"
                    placeholder="请输入验证码"
                    @change="inputCodeChange"
                  >
                    <a-icon
                      v-if=" inputCodeContent==verifiedCode "
                      slot="prefix"
                      type="smile"
                      :style="{ color: 'rgba(0,0,0,.25)' }"
                    />
                    <a-icon
                      v-else
                      slot="prefix"
                      type="frown"
                      :style="{ color: 'rgba(0,0,0,.25)' }"
                    />
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="10">
                <j-graphic-code style="float: right" @success="generateCode"></j-graphic-code>
              </a-col>
            </a-row>
          </div>
        </a-tab-pane>
      </a-tabs>
      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          html-type="submit"
          class="login-button"
          :loading="loginBtn"
          :disabled="loginBtn"
          @click.stop.prevent="handleSubmit"
        >确定</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import JGraphicCode from '@/components/unicom/JGraphicCode'
export default {
  components: {
    JGraphicCode
  },
  data() {
    return {
      customActiveKey: 'tab1',
      loginBtn: false,
      form: this.$form.createForm(this),
      formLogin: {
        username: '',
        password: ''
      },
      validatorRules: {
        username: {
          rules: [
            { required: true, message: '请输入用户名!', validator: 'click' }
          ]
        },
        password: {
          rules: [
            { required: true, message: '请输入密码!', validator: 'click' }
          ]
        },
        inputCode: {
          rules: [
            { required: true, message: '请输入验证码!' },
            { validator: this.validateInputCode }
          ]
        }
      },
      verifiedCode: '',
      inputCodeContent: '',
      inputCodeNull: true
    }
  },
  created() {
    Vue.ls.remove(ACCESS_TOKEN)
  },
  mounted() {},
  methods: {
    inputCodeChange(e) {
      this.inputCodeContent = e.target.value
      if (!e.target.value || e.target.value === 0) {
        this.inputCodeNull = true
      } else {
        this.inputCodeContent = this.inputCodeContent.toLowerCase()
        this.inputCodeNull = false
      }
    },
    generateCode(value) {
      this.verifiedCode = value.toLowerCase()
    },
    validateMobile(rule, value, callback) {
      if (
        !value ||
        new RegExp(
          /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
        ).test(value)
      ) {
        callback()
      } else {
        const str = '您的手机号码格式不正确!'
        callback(str)
      }
    },
    validateInputCode(rule, value, callback) {
      if (!value || this.verifiedCode === this.inputCodeContent) {
        callback()
      } else {
        const str = '您输入的验证码不正确!'
        callback(str)
      }
    },
    handleSubmit() {}
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }
}
</style>
<style>
.valid-error .ant-select-selection__placeholder {
  color: #f5222d;
}
</style>
