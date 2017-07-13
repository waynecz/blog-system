<template>
  <div class="sign">
    <section class="sign__section"></section>
    <section class="sign__section" layout="column center-center">

      <!-- 登录-->
      <transition name="fade-left" mode="in-out">
        <div v-if="booked" class="sign__box">
          <h5 class="sign__title grey--text darken-4--text" layput="row center-left">
            <span class="sign__title--inner">waynebo</span>
          </h5>

          <div class="sign__field">
            <v-text-field
              name="username"
              v-model="form.username"
              label="room"
              prepend-icon="account_balance"
              required
            ></v-text-field>
          </div>

          <div class="sign__field">
            <v-text-field
              name="password"
              v-model="form.password"
              label="key"
              required
              min="8"
              hint="At least 8 characters"
              prepend-icon="vpn_key"
              :append-icon="e ? 'visibility' : 'visibility_off'"
              :append-icon-cb="() => (e = !e)"
              :type="e ? 'password' : 'text'"
            ></v-text-field>
          </div>

          <div class="sign__field" layout="row center-right">
            <v-btn secondary block dark @click.native="signIn">open the door</v-btn>
          </div>
          <v-btn secondary block outline @click.native="changeSign">no room ? go booking</v-btn>


        </div>
      </transition>

      <!-- 注册-->
      <transition name="fade-left" mode="in-out">
        <div v-if="!booked" class="sign__box">
          <h5 class="sign__title blue--text" layput="row center-left">
            <span class="sign__title--inner">booking</span>
          </h5>

          <div class="sign__field">
            <v-text-field
              name="name_"
              v-model="signupForm.name"
              label="name"
              prepend-icon="perm_contact_calendar"
              required
            ></v-text-field>
          </div>

          <div class="sign__field">
            <v-text-field
              name="username_"
              v-model="signupForm.username"
              label="room"
              prepend-icon="home"
              required
            ></v-text-field>
          </div>

          <div class="sign__field">
            <v-text-field
              name="password_"
              v-model="signupForm.password"
              label="key"
              prepend-icon="fingerprint"
              required
            ></v-text-field>
          </div>

          <div class="sign__field" layout="row center-right">
            <v-btn primary dark block @click.native="signUp">booking!</v-btn>
          </div>
          <v-btn primary outline block @click.native="changeSign">enter room</v-btn>

        </div>
      </transition>

    </section>
  </div>
</template>
<script>
  export default {
    name: 'sign',
    props: {},
    data() {
      return {
        e: true,
        form: {
          username: '',
          password: ''
        },
        signupForm: {
          username: '',
          password: '',
          name: ''
        },
        booked: true,
      };
    },
    methods: {
      async signIn () {
        if (this.loading) return;

        this.loading = true;
        let res = await this.api.signin(this.form);

        if (res.success) {
          this.$router.push('/home/articles');
        }

        this.loading = false;
      },
      changeSign () {
        this.booked = !this.booked;
      },
      async signUp () {
        if (this.loading) return;

        this.loading = true;

        let res = await this.api.signup(this.signupForm);

        if (res.success) {
          this.$router.push('/home/articles');
        }

        this.loading = false;
      }
    }
  };
</script>
