const API_URL = "https://chat-app-vhb2.onrender.com"; // Backend URL

export const api = {
  login: async (username, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data;
  },

  signup: async (userData) => {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data;
  },

  logout: async () => {
    const res = await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    return res.json();
  },

  getUsers: async () => {
    const res = await fetch(`${API_URL}/api/users`, { credentials: "include" });
    return res.json();
  },

  getMessages: async (userId) => {
    const res = await fetch(`${API_URL}/api/messages/${userId}`, { credentials: "include" });
    return res.json();
  },

  sendMessage: async (receiverId, message) => {
    const res = await fetch(`${API_URL}/api/messages/send/${receiverId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ message }),
    });
    return res.json();
  },

  deleteMessage: async (messageId) => {
    const res = await fetch(`${API_URL}/api/messages/delete/${messageId}`, {
      method: "DELETE",
      credentials: "include",
    });
    return res.json();
  },
};
