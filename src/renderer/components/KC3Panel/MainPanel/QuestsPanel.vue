<template>
    <div class="quests_panel">
        <div v-for="(quest,index) in questsActive" :key="'quest_'+index">
            <div>{{quest.api_title}}</div>
        </div>
    </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'QuestsPanel',
    computed: {
      ...mapGetters(['questsActive'])
    }
  }
</script>
