import { ReactNode } from 'react'

export default function Card({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition hover:bg-gray-50 dark:border-white/10 dark:bg-gray-900 dark:hover:bg-white/5"
    >
      {children}
    </div>
  )
}