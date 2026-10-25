import axios from "axios";

// One place for the API address. Set VITE_API_URL in .env to change it
// (e.g. to your deployed Azure URL) without touching any component.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5267/api",
});

// Attach the JWT saved at login to every request.
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") ?? "null");
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

// A 401 on a request that carried a token means the session expired (or the token
// was tampered with): clear it and go to /login. A wrong password at login is also a
// 401, but that request has no token yet, so it is left for LoginPage to show.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && error.config?.headers?.Authorization) {
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Turns any failed request into one readable sentence for an alert or an error <p>.
export function getErrorMessage(error, fallback = "Something went wrong") {
  if (!error.response) return "Cannot reach the server. Is the API running?";
  const data = error.response.data;
  if (data?.message) return data.message;                                   // our 400/401/404/409 bodies
  if (data?.errors) return Object.values(data.errors).flat()[0] ?? fallback; // ASP.NET validation errors
  return fallback;
}
