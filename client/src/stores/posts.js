import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePostsStore = defineStore('posts', () => {
  const posts = ref([])
  const currentPost = ref(null)
  const comments = ref([])
  const loading = ref(false)

  const API = 'https://vuejswebproject-production.up.railway.app/api'

  function getToken() {
    return localStorage.getItem('token')
  }

  function authHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    }
  }

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
      headers: authHeaders(),
      body: JSON.stringify(data)
    })
    return await res.json()
  }

  async function updatePost(id, data) {
    await fetch(`${API}/posts/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data)
    })
    if (currentPost.value) {
      currentPost.value.title = data.title
      currentPost.value.content = data.content
    }
  }

  async function deletePost(id) {
    await fetch(`${API}/posts/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    })
    posts.value = posts.value.filter(p => p.id !== id)
  }

  async function likePost(id) {
    const res = await fetch(`${API}/posts/${id}/like`, {
      method: 'POST',
      headers: authHeaders()
    })
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
      headers: authHeaders(),
      body: JSON.stringify(data)
    })
    return await res.json()
  }

  return {
    posts, currentPost, comments, loading,
    fetchPosts, fetchPost, createPost, updatePost, deletePost,
    likePost, fetchComments, createComment
  }
})