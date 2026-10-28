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

export function CreatePost({ createPost }) {
  function handleNewPost(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const postContent = formData.get("post");

    if (postContent) {
      createPost({ user: "anonymous", body: postContent });
    }
  }

  return (
    <form
      onSubmit={handleNewPost}
      className="flex flex-col gap-3 w-full max-w-md"
    >
      <input
        type="text"
        id="post"
        name="post"
        className="px-4 py-2 border border-gray-300 rounded-lg"
      />
      <input
        type="submit"
        value="Post Shout"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg"
      />
    </form>
  );
}
