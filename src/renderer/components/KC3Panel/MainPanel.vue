<template>
    <div class="main_panel">
        <panel-selector></panel-selector>
        <battle-panel v-show="uiCurrentPanel==='battle'"></battle-panel>
        <fleet-panel v-show="uiCurrentPanel==='fleet'"></fleet-panel>
        <quests-panel v-show="uiCurrentPanel==='quests'"></quests-panel>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import PanelSelector from './MainPanel/PanelSelector'
  import FleetPanel from './MainPanel/FleetPanel'
  import BattlePanel from './MainPanel/BattlePanel'
  import QuestsPanel from './MainPanel/QuestsPanel'

  export default {
    name: 'MainPanel',
    computed: {
      ...mapGetters(['uiCurrentPanel'])
    },
    components: {BattlePanel, FleetPanel, PanelSelector, QuestsPanel}
  }
</script>
