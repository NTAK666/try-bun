import html from '@elysiajs/html';
import Elysia, { t } from 'elysia';
import * as elements from 'typed-html';
import { db } from './db';
import { Todo, todos } from './db/schema/todo';
import { eq } from 'drizzle-orm';

const app = new Elysia()
  .use(html)
  .get('/', ({ html }) =>
    html(
      <HomeLayout>
        <div
          class='flex flex-col items-center justify-center space-y-4 root-todos'
          hx-get='/todos'
          hx-trigger='load'
          hx-swap='innerHTML'
        ></div>
      </HomeLayout>
    )
  )
  .get('/todos', async () => {
    const data = await db.select().from(todos).all();
    return <TodoList todos={data} />;
  })
  .post(
    '/todos',
    async ({ body }) => {
      const { title } = body;
      const todo = await db.insert(todos).values({ title }).returning().get();
      return <TodoItem todo={todo} />;
    },
    {
      body: t.Object({
        title: t.String({ minLength: 1 }),
      }),
    }
  )
  .post(
    '/todos/toggle/:id',
    async ({ params }) => {
      const { id } = params;

      const todo = await db.select().from(todos).where(eq(todos.id, id)).get();

      if (todo) {
        const newTodo = await db
          .update(todos)
          .set({ completed: !todo.completed })
          .where(eq(todos.id, params.id))
          .returning()
          .get();
        return <TodoItem todo={newTodo} />;
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .delete(
    '/todos/:id',
    async ({ params }) => {
      const { id } = params;

      db.delete(todos).where(eq(todos.id, id)).execute();

      const data = await db.select().from(todos).all();

      return <TodoList todos={data} />;
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .listen(3000);

const HomeLayout = ({ children }: elements.Children) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://unpkg.com/htmx.org@1.9.5"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/hyperscript.org@0.9.11"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
      * {
        font-family: 'Inter', sans-serif;
      }
    </style>
    <title>BETH STACK</title>
  </head>
  <body class="h-screen w-screen flex flex-col gap-3 items-center justify-center">
    <span class='text-xl font-semibold'>BETH STACK</span>
    <div class='flex flex-col items-center justify-center  gap-2 mb-5'>
      <span class='text-neutral-500 font-semibold'>Bun 1.0</span>
      <span class='text-violet-500 font-semibold'>Elysia</span>
      <span class='text-lime-500 font-semibold'>Turso</span>
      <span class='text-sky-500 font-semibold'>Htmx</span>
    </div>
    ${children}
  </body>
  </html>
`;

const TodoItem = ({ todo }: { todo: Todo }) => {
  const { id, title, completed } = todo;
  return (
    <div class='grid grid-cols-[70%_13%_13%] gap-4 w-[500px] max-w-[500px]'>
      <span class='text-lg'>{title}</span>
      <input
        type='checkbox'
        checked={completed}
        hx-post={`/todos/toggle/${id}`}
        hx-swap='innerHTML'
        class='w-fit self-center'
      />
      <button
        hx-delete={`/todos/${id}`}
        class='bg-red-600 text-white px-2 py-1 rounded text-xs w-fit h-fit self-center'
        hx-target='.root-todos'
        hx-swap='innerHTML'
        _='on click toggle @disabled until htmx:afterSwap'
      >
        Delete
      </button>
    </div>
  );
};

const TodoList = ({ todos }: { todos: Todo[] }) => {
  return (
    <div class='space-y-2 flex flex-col gap-2'>
      <div class='h-[400px] w-full overflow-y-auto space-y-2 todos'>
        {todos.map((todo, index) => (
          <TodoItem todo={todo} />
        ))}
        <div class='insert-todo'></div>
      </div>
      <CreateTodoForm />
    </div>
  );
};

const CreateTodoForm = () => {
  return (
    <form
      class='flex items-center justify-between gap-4 w-full'
      hx-post='/todos'
      hx-swap='beforebegin'
      hx-target='.insert-todo'
      _='on htmx:afterRequest target.reset() go to .insert-todo'
    >
      <input
        type='text'
        name='title'
        class='border border-blue-300 px-4 py-2 rounded w-full ring-2 ring-transparent focus:ring-blue-300 focus:outline-none transition-all duration-200'
      />
    </form>
  );
};
