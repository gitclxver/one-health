export function getSubscribers(): string[] {
  return JSON.parse(localStorage.getItem("subscribers") || "[]");
}

export function subscribeToNewsletter(email: string) {
  const subscribers = getSubscribers();
  if (!subscribers.includes(email)) {
    subscribers.push(email);
    localStorage.setItem("subscribers", JSON.stringify(subscribers));
  }
}

export function unsubscribeFromNewsletter(email: string) {
  const subscribers = getSubscribers();
  const index = subscribers.indexOf(email);
  if (index !== -1) {
    subscribers.splice(index, 1);
    localStorage.setItem("subscribers", JSON.stringify(subscribers));
  }
}