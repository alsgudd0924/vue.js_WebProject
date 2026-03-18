import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePostsStore = defineStore('posts', () => {
  const posts = ref([])
  const currentPost = ref(null)
  const comments = ref([])
  const loading = ref(false)

  const API = 'http://localhost:3000/api'

  async function fetchPosts() {
    loading.value = true
    const res = await fetch(`${API}/posts`)
    posts.value = await res.json()
    loading.value = false
  }

  async function fetchPost(id) {
    loading.value = true
    const res = await fetch(`${API}/posts/${id}`)
    currentPost.value = await res.json()
    loading.value = false
  }

  async function createPost(data) {
    const res = await fetch(`${API}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await res.json()
  }

  async function deletePost(id) {
    await fetch(`${API}/posts/${id}`, { method: 'DELETE' })
    posts.value = posts.value.filter(p => p.id !== id)
  }

async function likePost(id) {
  const res = await fetch(`${API}/posts/${id}/like`, { method: 'POST' })
  const data = await res.json()
  if (currentPost.value) currentPost.value.likes = data.likes
}

  async function fetchComments(postId) {
    const res = await fetch(`${API}/posts/${postId}/comments`)
    comments.value = await res.json()
  }

  async function createComment(postId, data) {
    const res = await fetch(`${API}/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await res.json()
  }
  
  async function updatePost(id, data) {
  await fetch(`${API}/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (currentPost.value) {
    currentPost.value.title = data.title
    currentPost.value.content = data.content
  }
}

  return {
    posts, currentPost, comments, loading,
    fetchPosts, fetchPost, createPost, deletePost,
    likePost, fetchComments, createComment, updatePost
  }
})