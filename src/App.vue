<template>
  <a-locale-provider :locale="locale">
    <a-config-provider :get-popup-container="triggerNode => triggerNode.parentNode">
      <div id="app">
        <router-view />
      </div>
    </a-config-provider>
  </a-locale-provider>
</template>
<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

export default {
  data() {
    return {
      locale: zhCN
    }
  }
}
</script>
<style>
#app {
  height: 100%;
}
</style>
