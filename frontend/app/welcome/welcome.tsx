export function Welcome({ postData }) {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <h1>Shoutbox</h1>
        </header>
        <div className="max-w-[800px] w-full space-y-6 px-4">
          <nav className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
            <ul>
              {postData.map(({ user, content }) => (
                <li>
                  <div className="rounded border border-gray-200 space-y-4 p-4">
                    <b>{user}</b>: {content}
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </main>
  );
}
