<template>
    <div class="main_panel">
        <panel-selector></panel-selector>
        <fleet-panel></fleet-panel>
    </div>
</template>

<script>
  import PanelSelector from './MainPanel/PanelSelector'
  import FleetPanel from './MainPanel/FleetPanel'
  export default {
    name: 'MainPanel',
    components: {FleetPanel, PanelSelector}
  }
</script>
