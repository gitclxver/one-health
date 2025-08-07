import type { Article } from "../components/ArticleCard";

const ARTICLE_KEY = "articles";

export function getArticles(): Article[] {
  return JSON.parse(localStorage.getItem(ARTICLE_KEY) || "[]");
}

export function saveArticles(articles: Article[]) {
  localStorage.setItem(ARTICLE_KEY, JSON.stringify(articles));
}

export function addArticle(article: Article) {
  const current = getArticles();
  saveArticles([...current, article]);
}

export function updateArticle(updated: Article) {
  const current = getArticles().map((a) =>
    a.id === updated.id ? updated : a
  );
  saveArticles(current);
}

export function deleteArticle(id: string) {
  const current = getArticles().filter((a) => a.id !== id);
  saveArticles(current);
}
