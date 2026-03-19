<template>
  <div id="app">
    <header>
      <nav>
        <router-link to="/" class="logo">📋 게시판</router-link>
        <div class="nav-right">
          <template v-if="auth.isLoggedIn()">
            <span class="username">{{ auth.username }}</span>
            <router-link to="/write" class="write-btn">글쓰기</router-link>
            <button @click="logout" class="logout-btn">로그아웃</button>
          </template>
          <template v-else>
            <router-link to="/login" class="login-btn">로그인</router-link>
            <router-link to="/register" class="write-btn">회원가입</router-link>
          </template>
        </div>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push('/')
}
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

.nav-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.username {
  color: #8b949e;
  font-size: 0.9rem;
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

.login-btn {
  color: #58a6ff;
  text-decoration: none;
  font-size: 0.9rem;
  padding: 6px 16px;
  border: 1px solid #58a6ff;
  border-radius: 6px;
  transition: all 0.2s;
}

.login-btn:hover {
  background: #58a6ff20;
}

.logout-btn {
  background: transparent;
  border: 1px solid #30363d;
  color: #8b949e;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.logout-btn:hover {
  border-color: #f85149;
  color: #f85149;
}

main {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
</style>