import { useState } from "react";
import { Pencil, Trash, X, Check, Send } from "lucide-react";

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
              <div className="flex justify-between items-center">
                <form onSubmit={(e) => handleEdit({ id: id, e: e })}>
                  <span>
                    <b>{user}</b>:&nbsp;
                    <input
                      type="text"
                      id="post"
                      name="post"
                      defaultValue={content}
                    />
                  </span>
                </form>
                <span>
                  <button type="submit">
                    <Check />
                  </button>
                  <button onClick={() => setEditPostId(null)}>
                    <X />
                  </button>
                </span>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span>
                  <b>{user}</b>: {content}
                </span>
                <span>
                  <button onClick={() => setEditPostId(id)}>
                    <Pencil />
                  </button>
                  <button onClick={() => deletePost({ id: id })}>
                    <Trash />
                  </button>
                </span>
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
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg"
      >
        <Send />
      </button>
    </form>
  );
}
