<script setup lang="ts">

</script>

<template>
  <body>
  <div class="login-container">
    <h2>Registrieren</h2>
    <form>
      <div class="input-group">
        <label for="email">E-Mail</label>
        <input type="text" id="email" name="email" required>
      </div>
      <div class="input-group">
        <label for="password">Passwort</label>
        <input type="password" id="password" name="password" required>
      </div>
      <div class="input-group">
        <label for="password">Passwort wiederholen</label>
        <input type="password" id="password" name="password" required>
      </div>
      <button type="submit" class="register-button">Registrieren</button>
    </form>
  </div>
  </body>
</template>

<style scoped>
@import "../assets/styles/register.css";
</style>