let token = '';

async function createPost() {
  const content = document.getElementById("postContent").value;
  await fetch("http://localhost:3000/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({ content })
  });
  loadPosts();
}

async function loadPosts() {
  const res = await fetch("http://localhost:3000/api/posts", {
    headers: {
      "Authorization": token
    }
  });
  const posts = await res.json();
  const postDiv = document.getElementById("posts");
  postDiv.innerHTML = '';
  posts.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${p.author.username}</strong><p>${p.content}</p>${p.image ? `<img src="${p.image}" width="200"/>` : ""}<div><button onclick="toggleLike('${p._id}')">❤️ ${p.likes.length} Likes</button></div>`;
    postDiv.appendChild(div);
  });
}


async function loadPosts() {
  const res = await fetch(`${API_URL}/api/posts`, {
    headers: { Authorization: token }
  });
  const posts = await res.json();
  const postDiv = document.getElementById("posts");
  postDiv.innerHTML = "";

  posts.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${p.author.username}</strong>
      <p>${p.content}</p>${p.image ? `<img src="${p.image}" width="200"/>` : ""}<div><button onclick="toggleLike('${p._id}')">❤️ ${p.likes.length} Likes</button></div>
      <div><em>Comments:</em> ${
        p.comments.map(c => `<div><b>${c.user.username}:</b> ${c.comment}</div>`).join('')
      }</div>
      <input placeholder="Add comment" id="comment-${p._id}" />
      <button onclick="addComment('${p._id}')">Comment</button>
    `;
    postDiv.appendChild(div);
  });
}

async function addComment(postId) {
  const comment = document.getElementById(`comment-${postId}`).value;
  await fetch(`${API_URL}/api/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ comment })
  });
  loadPosts();
}


async function toggleLike(postId) {
  await fetch(`${API_URL}/api/posts/${postId}/like`, {
    method: "POST",
    headers: { Authorization: token }
  });
  loadPosts();
}


document.getElementById("post-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const content = document.getElementById("post-content").value;
  const imageFile = document.getElementById("post-image").files[0];
  const formData = new FormData();
  formData.append("content", content);
  if (imageFile) formData.append("image", imageFile);

  await fetch(`${API_URL}/api/posts`, {
    method: "POST",
    headers: { Authorization: token },
    body: formData
  });

  document.getElementById("post-form").reset();
  loadPosts();
});

async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  if (res.ok) {
    alert("Registration successful! Please log in.");
  } else {
    alert("Registration failed. Please try again.");
  }
}

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  if (res.ok) {
    const data = await res.json();
    token = `Bearer ${data.token}`;
    document.getElementById("auth").style.display = "none";
    document.getElementById("postForm").style.display = "block";
    loadPosts();
  } else {
    alert("Login failed. Please check your credentials.");
  }
}
