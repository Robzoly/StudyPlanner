import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Plus, Pencil, Trash2, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { getTasks, createTask, updateTask, deleteTask, type Task, type CreateTaskInput } from '../lib/tasks';
import { updateUserExperience, updateUserStreak, unlockAchievement } from '../lib/achievements';

export default function Dashboard() {
  const [isCreating, setIsCreating] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await getTasks();
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsCreating(false);
      reset();

      // Update experience and check achievements
      await updateUserExperience(10);
      await updateUserStreak();
      await unlockAchievement('first-task-achievement-id');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) =>
      updateTask(id, updates),
    onSuccess: async (_, { updates }) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setEditingTask(null);
      reset();

      if (updates.status === 'completed') {
        // Award experience for completing a task
        await updateUserExperience(20);
        await updateUserStreak();
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const { register, handleSubmit, reset } = useForm<CreateTaskInput>();

  const onSubmit = async (data: CreateTaskInput) => {
    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, updates: data });
    } else {
      createMutation.mutate(data);
    }
  };

  const taskCategories = ['Homework', 'Study', 'Exam', 'Project', 'Reading', 'Other'];

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  const completedTasks = tasks.filter((task) => task.status === 'completed').length;
  const totalTasks = tasks.length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <span className="font-medium">Progress: {completedTasks}/{totalTasks} Tasks</span>
          </div>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Tasks</h2>
        {!isCreating && !editingTask && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        )}
      </div>

      {(isCreating || editingTask) && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-card p-6 rounded-lg mb-6">
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                {...register('title')}
                defaultValue={editingTask?.title}
                className="w-full px-3 py-2 border rounded-md"
                maxLength={100}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                {...register('description')}
                defaultValue={editingTask?.description || ''}
                className="w-full px-3 py-2 border rounded-md"
                maxLength={500}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input
                  {...register('due_date')}
                  type="datetime-local"
                  defaultValue={editingTask?.due_date?.split('.')[0] || ''}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  {...register('category')}
                  defaultValue={editingTask?.category || ''}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select category</option>
                  {taskCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  {...register('priority')}
                  defaultValue={editingTask?.priority || ''}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  {...register('status')}
                  defaultValue={editingTask?.status || 'pending'}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingTask(null);
                reset();
              }}
              className="px-4 py-2 border rounded-md hover:bg-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
            >
              {editingTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {tasks.map((task: Task) => (
          <div
            key={task.id}
            className="bg-card p-4 rounded-lg border flex items-center justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{task.title}</h3>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    task.priority === 'high'
                      ? 'bg-red-100 text-red-700'
                      : task.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {task.priority}
                </span>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    task.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {task.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{task.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{task.category}</span>
                <span>Due: {format(new Date(task.due_date), 'PPp')}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditingTask(task)}
                className="p-2 hover:bg-accent rounded-md"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => deleteMutation.mutate(task.id)}
                className="p-2 hover:bg-accent rounded-md"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() =>
                  updateMutation.mutate({
                    id: task.id,
                    updates: { status: task.status === 'completed' ? 'pending' : 'completed' },
                  })
                }
                className="p-2 hover:bg-accent rounded-md"
              >
                {task.status === 'completed' ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}