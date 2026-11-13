import { useState } from "react";
import { Pencil, Trash, X, Check, Send } from "lucide-react";
import { Link } from "react-router";
import { useContext } from "react";
import { UserContext } from "../context";
import { getPosts } from "../getters";
import { API_URL } from "../config";

export function Posts({ postData, setPosts }) {
  const [editPostId, setEditPostId] = useState(null);
  const { user, token } = useContext(UserContext);

  async function deletePost({ id }) {
    await fetch(`${API_URL}/posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setPosts(await getPosts());
  }

  async function editPost({ id, content }) {
    await fetch(`${API_URL}/posts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: content }),
    });

    setPosts(await getPosts());
  }

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
      {postData.map(({ id, username, content }) => (
        <li key={id}>
          <div className="rounded border border-gray-200 space-y-4 p-4">
            {editPostId === id ? (
              <form onSubmit={(e) => handleEdit({ id: id, e: e })}>
                <div className="flex justify-between items-center">
                  <span>
                    <Link to={`/profile/${username}`}>
                      <b>{username}</b>
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
                  <Link to={`/profile/${username}`}>
                    <b>{username}</b>
                  </Link>
                  : {content}
                </span>
                {user == username && (
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

export function CreatePost({ setPosts }) {
  const { token } = useContext(UserContext);

  async function createPost({ body }) {
    await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: body }),
    });

    setPosts(await getPosts());
  }

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
