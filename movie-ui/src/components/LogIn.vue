<template>
  <div class="hello">
    <!-- <h1> Hey! Welcome, {{ msg }}</h1> -->
    <h1>hello everyone there.</h1>

     <div class="columns">
        <b-button v-on:click="getUserDetails" type="is-primary">User Info</b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LogIn',
  props: {
    msg: String
  },
  methods: {
      getUserDetails() {
      console.log("checking for auth!!");
      const url = `http://localhost:8080/api/user`;
      // const url = `/auth/facebook`
      this.$http.get(url,  {withCredentials: true}).then((res) => {
        console.log("after the auth call");
        console.log(res);
      });
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: black;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.hello{
    height: 200px;
    color: white;
    width: 100%;
}
</style>