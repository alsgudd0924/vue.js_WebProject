<template>
  <div>
    <div class="board-header">
      <h1>전체 게시글</h1>
      <span class="post-count">총 {{ posts.length }}개</span>
    </div>

    <div v-if="loading" class="loading">불러오는 중...</div>

    <div v-else-if="posts.length === 0" class="empty">
      첫 번째 게시글을 작성해보세요!
    </div>

    <div v-else class="post-list">
      <router-link
        v-for="post in posts"
        :key="post.id"
        :to="`/post/${post.id}`"
        class="post-item"
      >
        <div class="post-main">
          <h2 class="post-title">{{ post.title }}</h2>
          <p class="post-preview">{{ post.content.slice(0, 80) }}{{ post.content.length > 80 ? '...' : '' }}</p>
        </div>
        <div class="post-meta">
          <span>✍️ {{ post.author }}</span>
          <span>👁 {{ post.views }}</span>
          <span>❤️ {{ post.likes }}</span>
          <span>💬 {{ post.comment_count }}</span>
          <span class="post-date">{{ formatDate(post.created_at) }}</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePostsStore } from '../stores/posts'

const store = usePostsStore()
const { posts, loading } = storeToRefs(store)

onMounted(() => store.fetchPosts())

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ko-KR')
}
</script>

<style scoped>
.board-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.board-header h1 {
  font-size: 1.4rem;
  color: #e6edf3;
}

.post-count {
  color: #8b949e;
  font-size: 0.9rem;
}

.loading, .empty {
  text-align: center;
  color: #8b949e;
  padding: 4rem 0;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.post-item {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 1.25rem;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s;
}

.post-item:hover {
  border-color: #58a6ff;
}

.post-title {
  font-size: 1rem;
  font-weight: 600;
  color: #e6edf3;
  margin-bottom: 0.4rem;
}

.post-preview {
  font-size: 0.85rem;
  color: #8b949e;
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.post-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #8b949e;
}

.post-date {
  margin-left: auto;
}
</style>