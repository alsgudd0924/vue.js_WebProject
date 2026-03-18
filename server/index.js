const express = require('express')
const cors = require('cors')
const db = require('./db')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// 게시글 목록
app.get('/api/posts', (req, res) => {
  const posts = db.prepare(`
    SELECT p.*, COUNT(c.id) as comment_count 
    FROM posts p 
    LEFT JOIN comments c ON p.id = c.post_id 
    GROUP BY p.id 
    ORDER BY p.created_at DESC
  `).all()
  res.json(posts)
})

// 게시글 상세
app.get('/api/posts/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id)
  if (!post) return res.status(404).json({ message: '게시글 없음' })
  db.prepare('UPDATE posts SET views = views + 1 WHERE id = ?').run(req.params.id)
  res.json(post)
})

// 게시글 작성
app.post('/api/posts', (req, res) => {
  const { title, content, author } = req.body
  if (!title || !content || !author) return res.status(400).json({ message: '필드 누락' })
  const result = db.prepare(
    'INSERT INTO posts (title, content, author) VALUES (?, ?, ?)'
  ).run(title, content, author)
  res.json({ id: result.lastInsertRowid })
})

// 게시글 삭제
app.delete('/api/posts/:id', (req, res) => {
  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id)
  res.json({ message: '삭제 완료' })
})

// 게시글 수정
app.put('/api/posts/:id', (req, res) => {
  const { title, content } = req.body
  db.prepare('UPDATE posts SET title = ?, content = ? WHERE id = ?')
    .run(title, content, req.params.id)
  res.json({ message: '수정 완료' })
})

// 댓글 목록
app.get('/api/posts/:id/comments', (req, res) => {
  const comments = db.prepare(
    'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC'
  ).all(req.params.id)
  res.json(comments)
})

// 댓글 작성
app.post('/api/posts/:id/comments', (req, res) => {
  const { content, author } = req.body
  const result = db.prepare(
    'INSERT INTO comments (post_id, content, author) VALUES (?, ?, ?)'
  ).run(req.params.id, content, author)
  res.json({ id: result.lastInsertRowid })
})

// 좋아요
app.post('/api/posts/:id/like', (req, res) => {
  db.prepare('UPDATE posts SET likes = likes + 1 WHERE id = ?').run(req.params.id)
  const post = db.prepare('SELECT likes FROM posts WHERE id = ?').get(req.params.id)
  res.json({ likes: post.likes })
})

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`)
})