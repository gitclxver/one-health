// data/api.ts

const users: { email: string; password: string }[] = [];
const newsletterSubscribers: string[] = [];

export function addUser(user: { email: string; password: string }) {
  users.push(user);
}

export function addToNewsletter(email: string) {
  if (!newsletterSubscribers.includes(email)) {
    newsletterSubscribers.push(email);
  }
}

export function isUserLoggedIn(): boolean {
  return !!localStorage.getItem("user");
}
