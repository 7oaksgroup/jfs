<template>
  <div>
    <p class="italics">Just For Stylists Backbar</p>
    <hr/>
    <div>
      <div class="personal">
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
      <hr/>
      <div v-if="leaderboard.length > 0" class="leaderboard">
        <table>
          <thead>
            <tr>
              <th class="italics">+5 List</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="leader in leaderboard" :key="leader.name">
              <td><img :src="leader.avatar_url" class="rank"/>{{leader.name}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'Backbar',
  props: ['stylists', 'leaderboard'],
  data() {
    return {
      awards: [1, 5],
      plural: {
        1: 'Stylist',
        5: 'Stylists'
      },
      showPersonal: true,
      showLeaderboard: false
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
    },
    toggleMenu: function(showPersonal) {
      this.showPersonal = showPersonal
      this.showLeaderboard = !showPersonal
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
  border: 2px solid #e6d878;
  width: 8px;
  height: 8px;
  border-radius: 100%;
  vertical-align: middle;
  margin: 0 1px;
}
.dot.full {
  border: 5px solid #e6d878;
  width: 0px;
  height: 0px;
}
.personal li {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;
}
.leaderboard table {
  margin: auto;
}
.leaderboard tbody {
  text-align: left;
}
.leaderboard td {
  padding: 5px 25px;
}
.leaderboard th {
  padding: 10px 25px;
}
.leaderboard .rank {
  display: inline-block;
  border-radius: 100%;
  margin-right: 25px;
}
hr {
  border-color: #e6d878;
  border-style: solid;
  width: 100px;
  margin: 25px auto;
}
</style>
