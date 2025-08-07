export interface User {
  name: string;
  email: string;
  password: string;
  role: "user" | "committee";
}

export function saveUser(user: User) {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
}

export function loginUser(email: string, password: string) {
  const users = JSON.parse(localStorage.getItem("users") || "[]") as User[];
  const found = users.find((u) => u.email === email && u.password === password);
  if (found) {
    localStorage.setItem("currentUser", JSON.stringify(found));
    return true;
  }
  return false;
}

export function getCurrentUser(): User | null {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
}

export function logoutUser() {
  localStorage.removeItem("currentUser");
}