const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('./db')

const app = express()
const PORT = 3000
const SECRET = 'board_secret_key'

app.use(cors())
app.use(express.json())

// JWT 인증 미들웨어
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: '로그인 필요' })
  try {
    req.user = jwt.verify(token, SECRET)
    next()
  } catch {
    res.status(401).json({ message: '토큰 만료' })
  }
}

// 회원가입
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ message: '항목 누락' })
  const exists = db.prepare('SELECT id FROM users WHERE username = ?').get(username)
  if (exists) return res.status(400).json({ message: '이미 존재하는 아이디' })
  const hashed = await bcrypt.hash(password, 10)
  db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hashed)
  res.json({ message: '회원가입 완료' })
})

// 로그인
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username)
  if (!user) return res.status(400).json({ message: '아이디 없음' })
  const match = await bcrypt.compare(password, user.password)
  if (!match) return res.status(400).json({ message: '비밀번호 틀림' })
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '7d' })
  res.json({ token, username: user.username })
})

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
app.post('/api/posts', auth, (req, res) => {
  const { title, content } = req.body
  if (!title || !content) return res.status(400).json({ message: '필드 누락' })
  const result = db.prepare(
    'INSERT INTO posts (title, content, author, user_id) VALUES (?, ?, ?, ?)'
  ).run(title, content, req.user.username, req.user.id)
  res.json({ id: result.lastInsertRowid })
})

// 게시글 수정
app.put('/api/posts/:id', auth, (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id)
  if (!post) return res.status(404).json({ message: '게시글 없음' })
  if (post.user_id !== req.user.id) return res.status(403).json({ message: '권한 없음' })
  const { title, content } = req.body
  db.prepare('UPDATE posts SET title = ?, content = ? WHERE id = ?').run(title, content, req.params.id)
  res.json({ message: '수정 완료' })
})

// 게시글 삭제
app.delete('/api/posts/:id', auth, (req, res) => {
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id)
  if (!post) return res.status(404).json({ message: '게시글 없음' })
  if (post.user_id !== req.user.id) return res.status(403).json({ message: '권한 없음' })
  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id)
  res.json({ message: '삭제 완료' })
})

// 좋아요
app.post('/api/posts/:id/like', auth, (req, res) => {
  db.prepare('UPDATE posts SET likes = likes + 1 WHERE id = ?').run(req.params.id)
  const post = db.prepare('SELECT likes FROM posts WHERE id = ?').get(req.params.id)
  res.json({ likes: post.likes })
})

// 댓글 목록
app.get('/api/posts/:id/comments', (req, res) => {
  const comments = db.prepare(
    'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC'
  ).all(req.params.id)
  res.json(comments)
})

// 댓글 작성
app.post('/api/posts/:id/comments', auth, (req, res) => {
  const { content } = req.body
  const result = db.prepare(
    'INSERT INTO comments (post_id, content, author, user_id) VALUES (?, ?, ?, ?)'
  ).run(req.params.id, content, req.user.username, req.user.id)
  res.json({ id: result.lastInsertRowid })
})

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`)
})