export function Posts({ postData }) {
  return (
    <ul>
      {postData.map(({ user, content }) => (
        <li>
          <div className="rounded border border-gray-200 space-y-4 p-4">
            <b>{user}</b>: {content}
          </div>
        </li>
      ))}
    </ul>
  );
}
