import { TodoBoard } from '@/features/todo-dashboard'

export default function TodosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Todos</h1>
        <p className="text-muted-foreground">
          Manage your tasks and action items
        </p>
      </div>
      <TodoBoard />
    </div>
  )
}