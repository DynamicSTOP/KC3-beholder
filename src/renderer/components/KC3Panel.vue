<template>
    <div class="kc3_panel">
        <top-panel></top-panel>
        <main-panel></main-panel>
        <info-panel></info-panel>
    </div>
</template>

<script>
  import TopPanel from './KC3Panel/TopPanel'
  import MainPanel from './KC3Panel/MainPanel'
  import InfoPanel from './KC3Panel/InfoPanel'
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/background.js')
      .then(function (reg) {
        // registration worked
        console.log('Registration succeeded. Scope is ' + reg.scope)
      }).catch(function (error) {
        // registration failed
        console.log('Registration failed with ' + error)
      })
  }

  export default {
    name: 'KC3Panel',
    components: {InfoPanel, MainPanel, TopPanel}
  }
</script>
