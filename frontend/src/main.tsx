import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import RootLayout from './routes/RootLayout'
import HomePage from './routes/HomePage'
import ArticlePage from './routes/ArticlePage'
import ApiDocsPage from './routes/ApiDocsPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'articles/:id', element: <ArticlePage /> },
    ],
  },
  {
    path: '/docs',
    element: <ApiDocsPage />,
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)