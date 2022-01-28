<template>
  <v-app color="primary">
    <div class="align-center d-flex h-full justify-center">
      <div class="absolute bordered center d-flex flex-column">
        <FormulateForm
          v-if="!newUser"
          v-model="input"
          class="ma-auto w-full px-2"
          :schema="schema"
        >
          <v-btn
            class="w-full"
            type="submit"
            :loading="loading"
            color="primary"
            @click="login"
          >
            Intră
            <template #loader>
              <span class="custom-loader">
                <v-icon color="white">mdi-cached</v-icon>
              </span>
            </template>
          </v-btn>
        </FormulateForm>

        <FormulateForm
          v-else
          v-model="newUserInput"
          :schema="newLoginSchema"
        >
          <v-btn
            class="w-full"
            type="submit"
            :loading="loading"
            color="primary"
            @click="login"
          >
            Intră
            <template #loader>
              <span class="custom-loader">
                <v-icon color="white">mdi-cached</v-icon>
              </span>
            </template>
          </v-btn>
        </FormulateForm>

        <v-alert
          v-if="$store.getters.GET_LOGIN_ERROR.length"
          class="mx-2 mt-2 mb-0"
          dense
          outlined
          type="error"
        >
          {{ $store.getters.GET_LOGIN_ERROR }}
        </v-alert>
      </div>

      <canvas
        id="nokey"
        width="800"
        height="800"
      >Your Browser Don't Support Canvas, Please Download Chrome ^_^</canvas>
    </div>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      schema: [
        {
          type: 'text',
          name: 'login',
          label: 'Login sau email',
          placeholder: 'Login sau email',
          validation: 'required',
          validationMessages: {
            required: 'Login sau email invalid'
          }
        },
        {
          type: 'password',
          name: 'password',
          label: 'Parola',
          placeholder: 'Parola',
          validation: 'required',
          validationMessages: {
            required: 'Parola este invalidă'
          }
        }
      ],
      newLoginSchema: [
        {
          component: 'i',
          id: 'msg',
          children: 'Introduceți parola nouă'
        },
        {
          component: 'p',
          children: ''
        },
        {
          type: 'password',
          name: 'password',
          label: 'Parola',
          placeholder: '',
          validation: '^required|min:4',
          validationMessages: {
            required: 'Parola este invalidă',
            min: 'Minim 4 caractere'
          }
        }
      ],
      app: null,
      input: {},
      newUserInput: {},
      newUser: false,
      loading: false
    };
  },
  beforeMount() {
    const theme = this.$cookies.get('theme');
    this.$vuetify.theme.dark = theme === 'dark';
  },
  mounted() {
    this.setup();
  },
  methods: {
    async login() {
      if (this.newUser) {
        this.handleNewUser();
      } else {
        this.loading = true;
        await this.$store.dispatch('LOGIN', {
          login: this.input.login,
          password: this.input.password
        });

        const { is_new } = this.$store.getters.GET_USER;
        this.loading = false;

        if (is_new) {
          this.newUser = true;
          this.input = {};
        } else {
          this.$router.push('/');
        }
      }
    },
    async handleNewUser() {
      this.loading = true;

      const success = await this.$store.dispatch('RESET_PASSWORD', {
        password: this.newUserInput.password
      });
      this.loading = false;

      if (success) {
        this.$router.push('/');
      }
    },
    setup() {
      /* eslint-disable */
      let canvas = document.getElementById('nokey'),
        can_w = parseInt(canvas.getAttribute('width')),
        can_h = parseInt(canvas.getAttribute('height')),
        ctx = canvas.getContext('2d');

      let ball_color = {
        r: 0,
        g: 183,
        b: 73
      },
        R = 5,
        balls = [],
        alpha_f = 0.02,
        alpha_phase = 0,
        link_line_width = 1,
        dis_limit = 400,
        add_mouse_point = true,
        mouse_in = false,
        mouse_ball = {
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          r: 0,
          type: 'mouse'
        };

      function getRandomSpeed(pos) {
        let min = -1,
          max = 1;
        switch (pos) {
          case 'top':
            return [randomNumFrom(min, max), randomNumFrom(0.1, max)];
          case 'right':
            return [randomNumFrom(min, -0.1), randomNumFrom(min, max)];
          case 'bottom':
            return [randomNumFrom(min, max), randomNumFrom(min, -0.1)];
          case 'left':
            return [randomNumFrom(0.1, max), randomNumFrom(min, max)];
          default:
            return;
        }
      }
      function randomArrayItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
      }
      function randomNumFrom(min, max) {
        return Math.random() * (max - min) + min;
      }
      function getRandomBall() {
        let pos = randomArrayItem(['top', 'right', 'bottom', 'left']);
        switch (pos) {
          case 'top':
            return {
              x: randomSidePos(can_w),
              y: -R,
              vx: getRandomSpeed('top')[0],
              vy: getRandomSpeed('top')[1],
              r: R,
              alpha: 1,
              phase: randomNumFrom(0, 10)
            };
          case 'right':
            return {
              x: can_w + R,
              y: randomSidePos(can_h),
              vx: getRandomSpeed('right')[0],
              vy: getRandomSpeed('right')[1],
              r: R,
              alpha: 1,
              phase: randomNumFrom(0, 10)
            };
          case 'bottom':
            return {
              x: randomSidePos(can_w),
              y: can_h + R,
              vx: getRandomSpeed('bottom')[0],
              vy: getRandomSpeed('bottom')[1],
              r: R,
              alpha: 1,
              phase: randomNumFrom(0, 10)
            };
          case 'left':
            return {
              x: -R,
              y: randomSidePos(can_h),
              vx: getRandomSpeed('left')[0],
              vy: getRandomSpeed('left')[1],
              r: R,
              alpha: 1,
              phase: randomNumFrom(0, 10)
            };
        }
      }
      function randomSidePos(length) {
        return Math.ceil(Math.random() * length);
      }
      function renderBalls() {
        Array.prototype.forEach.call(balls, function (b) {
          if (!b.hasOwnProperty('type')) {
            ctx.fillStyle =
              'rgba(' +
              ball_color.r +
              ',' +
              ball_color.g +
              ',' +
              ball_color.b +
              ',' +
              b.alpha +
              ')';
            ctx.beginPath();
            ctx.arc(b.x, b.y, R, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
          }
        });
      }
      function updateBalls() {
        let new_balls = [];
        Array.prototype.forEach.call(balls, function (b) {
          b.x += b.vx;
          b.y += b.vy;

          if (b.x > -50 && b.x < can_w + 50 && b.y > -50 && b.y < can_h + 50) {
            new_balls.push(b);
          }
          b.phase += alpha_f;
          b.alpha = Math.abs(Math.cos(b.phase));
        });

        balls = new_balls.slice(0);
      }
      function renderLines() {
        let fraction, alpha;
        for (let i = 0; i < balls.length; i++) {
          for (let j = i + 1; j < balls.length; j++) {
            fraction = getDisOf(balls[i], balls[j]) / dis_limit;

            if (fraction < 1) {
              alpha = (1 - fraction).toString();

              ctx.strokeStyle = 'rgba(150,150,150,' + alpha + ')';
              ctx.lineWidth = link_line_width;

              ctx.beginPath();
              ctx.moveTo(balls[i].x, balls[i].y);
              ctx.lineTo(balls[j].x, balls[j].y);
              ctx.stroke();
              ctx.closePath();
            }
          }
        }
      }
      function getDisOf(b1, b2) {
        let delta_x = Math.abs(b1.x - b2.x),
          delta_y = Math.abs(b1.y - b2.y);

        return Math.sqrt(delta_x * delta_x + delta_y * delta_y);
      }
      function addBallIfy() {
        if (balls.length < 20) {
          balls.push(getRandomBall());
        }
      }
      function render() {
        ctx.clearRect(0, 0, can_w, can_h);
        renderBalls();
        renderLines();
        updateBalls();
        addBallIfy();
        window.requestAnimationFrame(render);
      }
      function initBalls(num) {
        for (var i = 1; i <= num; i++) {
          balls.push({
            x: randomSidePos(can_w),
            y: randomSidePos(can_h),
            vx: getRandomSpeed('top')[0],
            vy: getRandomSpeed('top')[1],
            r: R,
            alpha: 1,
            phase: randomNumFrom(0, 10)
          });
        }
      }
      function initCanvas() {
        canvas.setAttribute('width', window.innerWidth);
        canvas.setAttribute('height', window.innerHeight);
        can_w = parseInt(canvas.getAttribute('width'));
        can_h = parseInt(canvas.getAttribute('height'));
      }
      window.addEventListener('resize', function (e) {
        initCanvas();
      });
      function goMovie() {
        initCanvas();
        initBalls(30);
        window.requestAnimationFrame(render);
      }
      goMovie();
      canvas.addEventListener('mouseenter', function () {
        mouse_in = true;
        balls.push(mouse_ball);
      });
      canvas.addEventListener('mouseleave', function () {
        mouse_in = false;
        var new_balls = [];
        Array.prototype.forEach.call(balls, function (b) {
          if (!b.hasOwnProperty('type')) {
            new_balls.push(b);
          }
        });
        balls = new_balls.slice(0);
      });
      canvas.addEventListener('mousemove', function (e) {
        var e = e || window.event;
        mouse_ball.x = e.pageX;
        mouse_ball.y = e.pageY;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
canvas {
  background-color: #282c34;
}

.center {
  background-color: white;
  width: 300px;
  padding: 20px 10px;
  display: flex;
}

.w-full {
  width: 100% !important;
}
</style>
