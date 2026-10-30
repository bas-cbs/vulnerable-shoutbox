import { useState } from "react";
import { Pencil, Trash, X, Check, Send } from "lucide-react";
import { Link } from "react-router";

export function Posts({ postData, deletePost, editPost, userInfo }) {
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
    <ul className="space-y-3">
      {postData.map(({ id, user, content }) => (
        <li key={id}>
          <div className="rounded border border-gray-200 space-y-4 p-4">
            {editPostId === id ? (
              <form onSubmit={(e) => handleEdit({ id: id, e: e })}>
                <div className="flex justify-between items-center">
                  <span>
                    <Link to={`/profile/${user}`}>
                      <b>{user}</b>
                    </Link>
                    {": "}
                    <input
                      type="text"
                      id="post"
                      name="post"
                      defaultValue={content}
                    />
                  </span>
                  <span>
                    <button type="submit">
                      <Check />
                    </button>
                    <button onClick={() => setEditPostId(null)}>
                      <X />
                    </button>
                  </span>
                </div>
              </form>
            ) : (
              <div className="flex justify-between items-center">
                <span>
                  <Link to={`/profile/${user}`}>
                    <b>{user}</b>
                  </Link>
                  : {content}
                </span>
                {userInfo.username == user && (
                  <span>
                    <button onClick={() => setEditPostId(id)}>
                      <Pencil />
                    </button>
                    <button onClick={() => deletePost({ id: id })}>
                      <Trash />
                    </button>
                  </span>
                )}
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
      createPost({ body: postContent });
    }
  }

  return (
    <form onSubmit={handleNewPost}>
      <div className="flex gap-2">
        <input
          type="text"
          id="post"
          name="post"
          placeholder="msg text"
          className="border border-gray-300 y-2 p-2"
        />
        <button type="submit">
          <Send />
        </button>
      </div>
    </form>
  );
}
