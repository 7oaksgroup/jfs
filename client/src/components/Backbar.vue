<template>
  <div>
    <p class="italics">Just For Stylists Backbar</p>
        <hr/>
    <ul>
      <li v-for="award in availableAwards" :key="award">
        <div>Invite {{award}} {{plural[award]}}</div>
        <div>
          <span v-for="d in award" :key="d" class="dot" :class="{full: matchMore(d)}"></span>
        </div>
        <div>({{stylists > award ? award : stylists}}/{{award}})</div>
      </li>
    </ul>
  </div>
</template>


<script>
export default {
  name: 'Backbar',
  props: ['stylists'],
  data() {
    return {
      awards: [1, 5],
      plural: {
        1: 'Stylist',
        5: 'Stylists'
      }
    }
  },
  computed: {
    availableAwards: function() {
      let available = []
      this.awards.reduce((canAdd, current) => {
        if (!canAdd) {
          return false
        }
        available.push(current)
        if (this.stylists < current) {
          return false
        }
        return true
      }, true)
      return available
    }
  },
  methods: {
    matchMore: function(m) {
      return this.stylists >= m
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.italics {
  font-family: Palatino, 'Palatino Linotype', 'Palatino LT STD', 'Book Antiqua',
    Georgia, serif;
  font-style: italic;
  font-size: 24px;
}
.dot {
  display: inline-block;
  border: 1px solid #ff69b4;
  width: 8px;
  height: 8px;
  border-radius: 100%;
  vertical-align: middle;
}
.dot.full {
  border: 5px solid #ff69b4;
  width: 0px;
  height: 0px;
}
li {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;
}
hr {
  border-color: #ff69b4;
  border-style: solid;
  width: 100px;
}
</style>
