<script setup lang="ts">

</script>

<template>
  <body>
  <div class="login-container">
    <h2>Login</h2>
    <form>
      <div class="input-group">
        <label for="email">E-Mail</label>
        <input type="text" id="email" name="email" required>
      </div>
      <div class="input-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required>
      </div>
      <button type="submit" class="login-button">Login</button>
      <button type="button" class="register-button">Register</button>
    </form>
    <a href="#" style="color: #6fB98F" class="forgot-password">Forgot Password?</a>
  </div>
  </body>
</template>

<style scoped>
@import "../assets/styles/login.css";
</style>