function between(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
const constant = 20;
const app = Vue.createApp({
  data() {
    return {
      playerHealth: { total: 300, current: 300 },
      monsterHealth: { total: 800, current: 800 },
      monsterStrength: { total: 2.5, current: 2.5, tCurrent: 2.5 },
      playerStrength: { total: Math.floor(5 / constant + 1), current: 1.5 },
      playerHasAttacked: false,
      playerPower: false,
      timing: { total: 500, current: 500 },
      delay: 150,
      tRef: null,
      restful: 0,
      dRef: null,
      enforcement: 100 / constant,
      powerUp: false,
      attack(strength) {
        if (strength <= 0) return 0;
        let max = 12;
        let min = 5;
        min *= Math.floor((max - min) * strength);
        return Math.round(between(min, max));
      },
      healthStyles(bool) {
        const health = bool ? this.monsterHealth : this.playerHealth;
        return {
          width:
            (health.current > 0 ? (health.current / health.total) * 100 : 0) +
            '%',
          // backgroundColor: health.current > 0 ? '#00a876' : 'red',
          backgroundColor: !this.playerPower || !bool ? '#00a876' : 'red',
        };
      },
      attDel(strength, health, player) {
        function reduce() {
          if (
            strength.current >
            strength.current - strength.current / constant
          ) {
            strength.current -= strength.current / constant;
          }
        }
        if (player) {
          this.playerHasAttacked = true;
          clearTimeout(this.tRef);
          clearTimeout(this.dRef);
          if (this.playerPower) {
            strength.current +=
              strength.total /
              (strength.current + 1) /
              constant /
              (100 / this.enforcement);
            // const offset = Math.abs(strength.current * this.timing.total);
            console.log(1 - constant / (1 / constant));
            this.timing.current = between(
              this.timing.total * (1 - constant / (1 / constant)),
              this.timing.total * (1 + constant / (1 / constant))
            );
          } else {
            reduce();
          }
          this.tRef = setTimeout(() => {
            if (this.playerHasAttacked) this.playerPower = true;
          }, this.timing.current);
          this.dRef = setTimeout(() => {
            this.playerHasAttacked = !this.playerHasAttacked;
            this.playerPower = false;
          }, this.delay + this.timing.current);
          if (this.playerHasAttacked) this.playerPower = false;
        }
      },
    };
  },
  computed: {
    specialEnabled() {
      return !(this.restful > constant);
    },
  },
  methods: {
    attackMonster() {
      // if (this.restful <= constant) this.powerUp = true;
      if (this.powerUp) {
        this.playerStrength.total /= constant + 1 - 1 / constant;
        this.enforcement /= constant + 1 - 1 / constant;
        this.monsterStrength.current = this.monsterStrength.tCurrent;
        this.powerUp = false;
      }
      if (this.monsterHealth.current <= 0 || this.playerHealth.current <= 0) {
        return;
      }
      if (!this.playerPower) this.attackPlayer();
      else if (this.restful <= constant + 1) this.restful++;
      this.attDel(this.playerStrength, this.playerHealth.current, true);
      const attack = this.attack(this.playerStrength.current);
      this.monsterHealth.current -= attack;
      // this.monsterStrength.current -= attack/this.playerStrength.current;
      // this.monsterStrength.current += attack/this.playerHealth.current;
    },

    attackPlayer() {
      if (this.restful > 0 - constant) this.restful -= 1;
      if (this.monsterHealth.current <= 0 || this.playerHealth.current <= 0) {
        return;
      }
      // this.attDel(this.monsterStrength, this.monsterHealth.current);
      const attack = this.attack(this.monsterStrength.current);
      this.playerHealth.current -= attack;
    },
    special() {
      if (!this.powerUp) {
        this.playerStrength.total *= constant + 1 - 1 / constant;
        this.enforcement *= constant + 1 - 1 / constant;
        this.monsterStrength.current = 0;
        // this.restful += this.enforcement / constant / constant;
        this.powerUp = true;
      }
    },
    heal() {
      if (this.playerHealth.current + between()) {
      }
    },
  },
});
app.mount('#game');
