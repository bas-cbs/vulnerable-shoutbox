export function Welcome() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
		<h1>Shoutbox</h1>
        </header>
        <div className="max-w-[800px] w-full space-y-6 px-4">
          <nav className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
            <h1>Posts</h1> 
            <ul>
              {resources.map(({ text, user }) => (
                <li>
                    {user}: {text}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </main>
  );
}

const resources = [
  {
    text: "something",
    user: "user1"
  },
  {
    text: "another",
    user: "user2"
  },
];
