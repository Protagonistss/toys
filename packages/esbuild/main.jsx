import React from 'react'
import { createRoot } from 'react-dom/client'

const root = document.getElementById('root')
const app = createRoot(root)
app.render(
  <h1>Hello React</h1>
)