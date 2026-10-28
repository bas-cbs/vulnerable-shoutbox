import { useState } from "react";

export function Posts({ postData, deletePost, editPost }) {
  const [editPostId, setEditPostId] = useState(null);

  function handleEdit({ id, e }) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const postContent = formData.get("post");

    if (postContent) {
      editPost({ id: id, content: postContent });
      setEditPostId(null);
    }
  }

  return (
    <ul>
      {postData.map(({ id, user, content }) => (
        <li key={id}>
          <div className="rounded border border-gray-200 space-y-4 p-4">
            {editPostId === id ? (
              <div>
                <b>{user}</b>:
                <form onSubmit={(e) => handleEdit({ id: id, e: e })}>
                  <input
                    type="text"
                    id="post"
                    name="post"
                    defaultValue={content}
                  />
                  <input type="submit" value="Submit" />
                </form>
                <button onClick={() => setEditPostId(null)}>cancel edit</button>
              </div>
            ) : (
              <div>
                <p>
                  <b>{user}</b>: {content}
                </p>
                <button onClick={() => setEditPostId(id)}>edit</button>
                <button onClick={() => deletePost({ id: id })}>delete</button>
              </div>
            )}
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
