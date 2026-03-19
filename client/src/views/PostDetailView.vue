<template>
  <div v-if="loading" class="loading">불러오는 중...</div>

  <div v-else-if="currentPost">
    <div class="post-card">
      <div class="post-header">
        <button @click="router.back()" class="back-btn">← 뒤로가기</button>
        <div class="post-actions-top" v-if="isOwner">
          <button @click="startEdit" class="edit-btn">수정</button>
          <button @click="handleDelete" class="delete-btn">삭제</button>
        </div>
      </div>

      <div v-if="isEditing" class="edit-form">
        <input v-model="editTitle" type="text" class="edit-input" />
        <textarea v-model="editContent" rows="10" class="edit-textarea" />
        <div class="edit-actions">
          <button @click="cancelEdit" class="cancel-btn">취소</button>
          <button @click="submitEdit" class="submit-btn">저장</button>
        </div>
      </div>

      <div v-else>
        <h1>{{ currentPost.title }}</h1>
        <div class="post-info">
          <span>✍️ {{ currentPost.author }}</span>
          <span>👁 {{ currentPost.views }}</span>
          <span>{{ formatDate(currentPost.created_at) }}</span>
        </div>
        <div class="post-content">{{ currentPost.content }}</div>
        <div class="post-likes">
          <button @click="handleLike" class="like-btn">❤️ 좋아요 {{ currentPost.likes }}</button>
        </div>
      </div>
    </div>

    <div class="comments-section">
      <h2>댓글 {{ comments.length }}개</h2>

      <div class="comment-form" v-if="auth.isLoggedIn()">
        <textarea v-model="commentContent" placeholder="댓글을 입력하세요" rows="3" />
        <button @click="submitComment" class="submit-btn">댓글 등록</button>
      </div>
      <p v-else class="login-notice">댓글을 작성하려면 <router-link to="/login">로그인</router-link>하세요.</p>

      <div class="comment-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="comment-header">
            <span class="comment-author">{{ comment.author }}</span>
            <span class="comment-date">{{ formatDate(comment.created_at) }}</span>
          </div>
          <p class="comment-content">{{ comment.content }}</p>
        </div>
        <div v-if="comments.length === 0" class="empty">첫 댓글을 남겨보세요!</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePostsStore } from '../stores/posts'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const store = usePostsStore()
const auth = useAuthStore()
const { currentPost, comments, loading } = storeToRefs(store)

const commentContent = ref('')
const isEditing = ref(false)
const editTitle = ref('')
const editContent = ref('')

const isOwner = computed(() => {
  return auth.isLoggedIn() && currentPost.value?.author === auth.username
})

onMounted(async () => {
  await store.fetchPost(route.params.id)
  await store.fetchComments(route.params.id)
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('ko-KR')
}

function startEdit() {
  editTitle.value = currentPost.value.title
  editContent.value = currentPost.value.content
  isEditing.value = true
}

function cancelEdit() { isEditing.value = false }

async function submitEdit() {
  if (!editTitle.value.trim() || !editContent.value.trim()) return alert('입력해주세요!')
  await store.updatePost(route.params.id, { title: editTitle.value, content: editContent.value })
  isEditing.value = false
}

async function handleLike() { await store.likePost(route.params.id) }

async function handleDelete() {
  if (!confirm('정말 삭제하시겠어요?')) return
  await store.deletePost(route.params.id)
  router.push('/')
}

async function submitComment() {
  if (!commentContent.value.trim()) return alert('댓글 내용을 입력해주세요!')
  await store.createComment(route.params.id, { content: commentContent.value })
  commentContent.value = ''
  await store.fetchComments(route.params.id)
}
</script>

<style scoped>
.loading { text-align: center; color: #8b949e; padding: 4rem 0; }

.post-card {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.back-btn {
  background: transparent;
  border: 1px solid #30363d;
  color: #8b949e;
  padding: 5px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.back-btn:hover { border-color: #58a6ff; color: #58a6ff; }

.post-actions-top { display: flex; gap: 0.5rem; }

.edit-btn {
  background: transparent;
  border: 1px solid #58a6ff;
  color: #58a6ff;
  padding: 4px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
}

.delete-btn {
  background: transparent;
  border: 1px solid #f85149;
  color: #f85149;
  padding: 4px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
}

h1 { font-size: 1.4rem; color: #e6edf3; margin-bottom: 1rem; }

.post-info {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #8b949e;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #30363d;
}

.post-content { color: #e6edf3; line-height: 1.8; white-space: pre-wrap; margin-bottom: 1.5rem; }

.like-btn {
  background: transparent;
  border: 1px solid #30363d;
  color: #e6edf3;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.like-btn:hover { border-color: #f85149; color: #f85149; }

.edit-form { display: flex; flex-direction: column; gap: 0.75rem; }

.edit-input, .edit-textarea {
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 0.75rem;
  color: #e6edf3;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
}

.edit-textarea { resize: vertical; }
.edit-actions { display: flex; justify-content: flex-end; gap: 0.75rem; }

.cancel-btn {
  background: transparent;
  border: 1px solid #30363d;
  color: #8b949e;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.submit-btn {
  background: #238636;
  border: none;
  color: #fff;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  align-self: flex-end;
}

.comments-section h2 { font-size: 1.1rem; margin-bottom: 1rem; color: #e6edf3; }

.comment-form {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.login-notice { color: #8b949e; margin-bottom: 1rem; font-size: 0.9rem; }
.login-notice a { color: #58a6ff; text-decoration: none; }

textarea {
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 0.6rem;
  color: #e6edf3;
  font-size: 0.9rem;
  font-family: inherit;
  outline: none;
}

.comment-list { display: flex; flex-direction: column; gap: 0.75rem; }

.comment-item {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 1rem;
}

.comment-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
.comment-author { font-weight: 600; font-size: 0.9rem; color: #58a6ff; }
.comment-date { font-size: 0.8rem; color: #8b949e; }
.comment-content { color: #e6edf3; font-size: 0.9rem; line-height: 1.6; }
.empty { text-align: center; color: #8b949e; padding: 2rem 0; }
</style>