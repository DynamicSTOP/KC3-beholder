<template>
    <div class="panel_selector" :class="uiCurrentPanel">
        <div class="battle" :class="{active:uiCurrentPanel==='battle'}" @click="switchPanel('battle')">battle</div>
        <div class="fleet" :class="{active:uiCurrentPanel==='fleet'}" @click="switchPanel('fleet')">fleet</div>
        <div class="port" :class="{active:uiCurrentPanel==='port'}" @click="switchPanel('port')">port</div>
        <div class="quests" :class="{active:uiCurrentPanel==='quests'}" @click="switchPanel('quests')">quests</div>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: 'PanelSelector',
    computed: {
      ...mapGetters(['uiCurrentPanel'])
    },
    methods: {
      switchPanel (tabName) {
        this.$store.dispatch('UI_SWITCH_PANEL', tabName)
      }
    }
  }
</script>
