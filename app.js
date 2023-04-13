function between(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
const constant = 5;
const app = Vue.createApp({
  data() {
    return {
      playerHealth: { total: 300, current: 300 },
      monsterHealth: { total: 800, current: 800 },
      monsterStrength: { total: 2.5, current: 2.5, tCurrent: 2.5 },
      playerStrength: { total: 5, current: 1.5 },
      playerHasAttacked: false,
      playerPower: false,
      timing: { total: 500, current: between(200, 400) },
      delay: 150,
      tRef: null,
      restful: 0,
      dRef: null,
      enforcement: 100,
      powerOff: false,
      powerUp: false,
      attack(strength) {
        if (strength <= 0) return 0;
        let max = 12;
        let min = 5;
        max *= strength;
        min *= Math.floor((12 - min) * strength);
        return between(min, max);
      },
      healthStyles(bool) {
        const health = bool ? this.monsterHealth : this.playerHealth;
        return {
          width:
            (health.current > 0 ? (health.current / health.total) * 100 : 0) +
            '%',
          // backgroundColor: health.current > 0 ? '#00a876' : 'red',
          backgroundColor: !this.playerPower ? '#00a876' : 'red',
        };
      },
      attDel(strength, health, player) {
        function reduce() {
          if (strength.current > strength.current - strength.current / 5) {
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
            const offset = 0;
            this.timing.current = between(
              this.timing.total - offset,
              this.timing.total + offset
            );
          } else {
            reduce();
          }
          this.tRef = setTimeout(() => {
            if (this.playerHasAttacked) this.playerPower = true;
          }, this.timing.total);
          this.dRef = setTimeout(() => {
            this.playerHasAttacked = !this.playerHasAttacked;
            this.playerPower = false;
          }, this.delay + this.timing.total);
          if (this.playerHasAttacked) this.playerPower = false;
        }
      },
    };
  },
  methods: {
    attackMonster() {
      if (this.powerOff) {
        this.powerUp = false;
        this.playerStrength.total *= 2 - 1 / constant;
        this.enforcement /= 2 - 1 / constant;
        this.monsterStrength.current = this.monsterStrength.tCurrent;
      }
      if (this.monsterHealth.current <= 0 || this.playerHealth.current <= 0) {
        return;
      }
      if (!this.playerPower) this.attackPlayer();
      else this.restful++;
      this.attDel(this.playerStrength, this.playerHealth.current, true);
      const attack = this.attack(this.playerStrength.current);
      this.monsterHealth.current -= attack;
      // this.monsterStrength.current -= attack/this.playerStrength.current;
      // this.monsterStrength.current += attack/this.playerHealth.current;
    },

    attackPlayer() {
      if (this.resful <= 2) this.powerOff = true;
      this.restful -= 1;
      if (this.monsterHealth.current <= 0 || this.playerHealth.current <= 0) {
        return;
      }
      // this.attDel(this.monsterStrength, this.monsterHealth.current);
      const attack = this.attack(this.monsterStrength.current);
      this.playerHealth.current -= attack;
    },
    special() {
      if (!this.powerUp) {
        this.playerStrength.total *= 2 - 1 / constant;
        this.enforcement *= 2 - 1 / constant;
        this.monsterStrength.current = 0;
        this.restful + this.enforcement / constant / 2;
        this.powerUp = true;
      }
    },
  },
});
app.mount('#game');
