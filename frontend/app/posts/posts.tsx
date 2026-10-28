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
    <form onSubmit={handleNewPost}>
      <div className="flex gap-2">
        <input
          type="text"
          id="post"
          name="post"
          className="border border-gray-300"
        />
        <button type="submit">
          <Send />
        </button>
      </div>
    </form>
  );
}
