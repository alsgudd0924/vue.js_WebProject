<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>로그인</h1>
      <div class="field">
        <input v-model="username" type="text" placeholder="아이디" />
      </div>
      <div class="field">
        <input v-model="password" type="password" placeholder="비밀번호" />
      </div>
      <button @click="submit" class="submit-btn">로그인</button>
      <p class="link">계정이 없으신가요? <router-link to="/register">회원가입</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const username = ref('')
const password = ref('')

async function submit() {
  if (!username.value || !password.value) return alert('입력해주세요!')
  const result = await auth.login({ username: username.value, password: password.value })
  if (result.token) router.push('/')
  else alert(result.message)
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.auth-card {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h1 {
  font-size: 1.4rem;
  color: #e6edf3;
  text-align: center;
}

.field input {
  width: 100%;
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 0.75rem;
  color: #e6edf3;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.field input:focus {
  border-color: #58a6ff;
}

.submit-btn {
  background: #238636;
  border: none;
  color: #fff;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.submit-btn:hover {
  background: #2ea043;
}

.link {
  text-align: center;
  color: #8b949e;
  font-size: 0.9rem;
}

.link a {
  color: #58a6ff;
  text-decoration: none;
}
</style>