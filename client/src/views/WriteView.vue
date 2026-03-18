<template>
  <div class="write-container">
    <h1>글쓰기</h1>

    <div class="form">
      <div class="field">
        <label>작성자</label>
        <input v-model="author" type="text" placeholder="이름을 입력하세요" />
      </div>

      <div class="field">
        <label>제목</label>
        <input v-model="title" type="text" placeholder="제목을 입력하세요" />
      </div>

      <div class="field">
        <label>내용</label>
        <textarea v-model="content" placeholder="내용을 입력하세요" rows="12" />
      </div>

      <div class="actions">
        <router-link to="/" class="cancel-btn">취소</router-link>
        <button @click="submit" class="submit-btn" :disabled="loading">
          {{ loading ? '등록 중...' : '등록하기' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePostsStore } from '../stores/posts'

const router = useRouter()
const store = usePostsStore()

const title = ref('')
const content = ref('')
const author = ref('')
const loading = ref(false)

async function submit() {
  if (!title.value.trim() || !content.value.trim() || !author.value.trim()) {
    alert('모든 항목을 입력해주세요!')
    return
  }
  loading.value = true
  const result = await store.createPost({
    title: title.value,
    content: content.value,
    author: author.value
  })
  loading.value = false
  router.push(`/post/${result.id}`)
}
</script>

<style scoped>
.write-container h1 {
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  color: #e6edf3;
}

.form {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-size: 0.85rem;
  color: #8b949e;
}

input, textarea {
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 0.75rem;
  color: #e6edf3;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}

input:focus, textarea:focus {
  border-color: #58a6ff;
}

textarea {
  resize: vertical;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.cancel-btn {
  padding: 8px 20px;
  border-radius: 6px;
  border: 1px solid #30363d;
  color: #8b949e;
  text-decoration: none;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.cancel-btn:hover {
  border-color: #8b949e;
}

.submit-btn {
  padding: 8px 20px;
  border-radius: 6px;
  background: #238636;
  border: none;
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #2ea043;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>