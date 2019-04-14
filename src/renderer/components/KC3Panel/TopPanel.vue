<template>
    <div class="top_panel">
        <admiral></admiral>
        <resources></resources>
    </div>
</template>

<script>
  import Admiral from './TopPanel/Admiral'
  import Resources from './TopPanel/Resources'
  export default {
    name: 'TopPanel',
    components: {Resources, Admiral}
  }
</script>
