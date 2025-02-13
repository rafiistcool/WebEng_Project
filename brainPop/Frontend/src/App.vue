<script setup>
import { RouterLink, RouterView} from 'vue-router';

</script>

<template>
  <body class="main-body">
    <div class="main-background">
      <div class="header-main-background">
        <h1>BRAINPOP</h1>
      </div>
      <div class="sidebar-page-wrapper">
        <div class="sidebar-background">
          <div class="sidebar-content">
            <div class="router-links">
              <div class="home-link">
                <router-link to="/">
                  <button class="home-link">
                    suii
                  </button>
                </router-link>
              </div>
              <div class="card-link">
                <router-link to="/card">
                  <button>
                    suiiiii
                  </button>
                </router-link>
              </div>

            </div>
          </div>

        </div>
        <div class="page-content">
          <router-view />
        </div>
      </div>
    </div>

  </body>
</template>

<style scoped>
@import '../src/assets/styles/app_styles.css';
</style>