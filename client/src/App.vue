<template>
  <div id="app">
    <header>
      <nav>
        <router-link to="/" class="logo">📋 게시판</router-link>
        <router-link to="/write" class="write-btn">글쓰기</router-link>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #0d1117;
  color: #e6edf3;
  font-family: 'Segoe UI', sans-serif;
}

#app {
  min-height: 100vh;
}

header {
  background: #161b22;
  border-bottom: 1px solid #30363d;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

nav {
  max-width: 900px;
  margin: 0 auto;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 1.2rem;
  font-weight: 700;
  color: #e6edf3;
  text-decoration: none;
}

.write-btn {
  background: #238636;
  color: #fff;
  padding: 6px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.write-btn:hover {
  background: #2ea043;
}

main {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
</style>