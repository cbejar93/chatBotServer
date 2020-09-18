<template>
<div id="app">
  <section class="hero">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">Movie Chatbot</h1>
        <h2 class="subtitle">Data Entry Page for Malik :)</h2>
        <router-link to="/home">Go to Home</router-link>
      </div>
    </div>
  </section>
  <body>
    <router-view></router-view>

    <section class="section">
      <div class="container">
        <h1 class="title">Add new movie section</h1>
        <h2 class="subtitle">All fields required.</h2>
        <div class="tile is-parent">
          <article class="tile is-child notification">
            <div class="content">
              <form id="movieForm" @submit.prevent="processForm">
                <!-- Content -->
                <section>
                  <div class="columns">
                    <div class="column">
                      <b-field label="Movie Name">
                        <b-input v-model="formData.movieName" value="Enter Here"></b-input>
                      </b-field>
                    </div>
                    <div class="column">
                      <b-field label="Platform">
                        <b-select v-model="formData.platform" placeholder="Select a platform">
                          <option value="AmazonInstantVideo">Amazon</option>
                          <option value="Hulu">Hulu</option>
                          <option value="Netflix">Netflix</option>
                        </b-select>
                      </b-field>
                    </div>
                    <div class="column">
                      <b-field label="Genre">
                        <b-select v-model="formData.genre" placeholder="Select a genre">
                          <option value="Comedy">Comedy</option>
                          <option value="Horror">Horror</option>
                          <option value="Drama">Drama</option>
                          <option value="Documentary">Documentary</option>
                          <option value="Thriller">Thriller</option>
                        </b-select>
                      </b-field>
                    </div>
                    <div class="column">
                      <b-field label="Original">
                        <b-select v-model="formData.original" placeholder="Select Yes/No">
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </b-select>
                      </b-field>
                    </div>
                  </div>

                  <b-field label="Movie Recap">
                    <b-input v-model="formData.movieRecap" maxlength="200" type="textarea"></b-input>
                  </b-field>
                  <div class="columns">
                    <b-button v-on:click="processForm" type="is-primary">Submit</b-button>
                  </div>
                  <div class="columns">
                    <a href="http://localhost:8080/auth/facebook">Log In with Facebook</a>
                    <!-- <b-button v-on:click="authForm" type="is-primary">Facebook</b-button> -->
                  </div>
                  <div class="columns">
                    <b-button v-on:click="deleteRows" type="is-primary">Delete</b-button>
                  </div>
                  <!-- <button class="button is-medium is-success" @click="success">
                Launch notification (custom)
                  </button>-->
                </section>
              </form>
            </div>
          </article>
        </div>
      </div>
    </section>
    <section class="section">
      <b-table
        :data="tableData"
        :columns="columns"
        :checked-rows.sync="checkedRows"
        checkable
        :checkbox-position="checkboxPosition"
      ></b-table>
    </section>
  </body>
</div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: "App",
  created() {
    console.log("first lifecycle hook.");
    this.getMovies();
  },

  data: function () {
    return {
      formData: {
        movieName: "",
        movieRecap: "",
        genre: "",
        platform: "",
        original: "",
      },
      labelPosition: "on-label",
      tableData: [],
      checkboxPosition: "left",
      checkedRows: [],
      loading: false,
      defaultSortDirection: "asc",
      sortIcon: "arrow-up",
      sortIconSize: "is-small",
      columns: [
        {
          field: "movieName",
          label: "Name",
          searchable: true,
          sortable: true,
        },
        {
          field: "movieRecap",
          label: "Recap",
          centered: true,
        },
        {
          field: "genre",
          label: "Genre",
          searchable: true,
          sortable: true,
        },
        {
          field: "platform",
          label: "Platform",
          searchable: true,
          sortable: true,
        },
        {
          field: "original",
          label: "Original",
          searchable: true,
          sortable: true,
        },
      ],
    };
  },
  methods: {
    processForm: function () {
      let movieForm = {
        movieName: this.formData.movieName,
        platform: this.formData.platform,
        original: this.formData.original,
        genre: this.formData.genre,
        movieRecap: this.formData.movieRecap,
      };

      console.log("movie form.");
      console.log(movieForm);
      const url = `http://localhost:8080/new`;
      // const url = `/new`;

      this.$http.post(url, this.formData).then((res) => {
        console.log("hello in post");
        console.log(res.data);
        if (res.data.status === "success") {
          console.log("movie posted");
          this.success("is-success", "Movie Saved!");
        }
      });
    },
    success(typeVar, messageVar) {
      this.$buefy.notification.open({
        message: "Movie Saved!",
        type: typeVar,
        position: messageVar,
      });
    },

    getMovies() {
      const url = `http://localhost:8080/getAll`;
      // const url = `/getAll`;
      console.log("in the get all before.");
      this.$http.get(url, {withCredentials: true}).then((res) => {
        console.log("after get all movies.");
        console.log(res.data);
        res.data.forEach((movie) => {
          this.tableData.push(movie);
        });
      });
    },
    deleteRows() {
      console.log("in the delete rows aspect/");

      const url = `http://localhost:8080/deleteMany`;
      // const url = `/deleteMany`

      let idArray = [];
      this.checkedRows.forEach((row) => {
        console.log(row._id);
        idArray.push(row._id);
      });

      console.log(idArray);

      console.log("about to call delete func.");
      this.$http.post(url, idArray,  {withCredentials: true}).then((res) => {
        console.log("after multi delete");
        console.log(res);
      });
    },
    authForm() {
      console.log("checking for auth!!");
      const url = `http://localhost:8080/auth/facebook`;
      // const url = `/auth/facebook`
      this.$http.get(url).then((res) => {
        console.log("after the auth call");
        console.log(res);
      });
    },

    getUserDetails() {
      console.log("checking for auth!!");
      const url = `http://localhost:8080/api/user`;
      // const url = `/auth/facebook`
      this.$http.get(url).then((res) => {
        console.log("after the auth call");
        console.log(res);
      });
    },
  },
};
</script>

<style>
@import "~bulma/css/bulma.css";
.hero {
  background-color: #121212 !important;
}

.section {
  background-color: #121212 !important;
  background-color: rgba(0, 0, 0, 0.94) !important;
}

.label {
  color: white !important;
  opacity: 0.77 !important;
}

.input,
.taginput .taginput-container.is-focusable,
.textarea,
.select select {
  background-color: #212121 !important;
  border-color: #bb86fc !important;
  color: white !important;
  opacity: 0.77 !important;
}

.tile {
  background-color: #212121 !important;
  /* background-color: rgba(0, 0, 0, 0.91)!important; */
}

h1 {
  color: white !important;
  opacity: 0.87 !important;
}
</style>
