import { useState } from "react";
import ArticleForm from "./articles/ArticleForm";
import type { Article } from "../../models/Article";

interface Props {
  article?: Article | null;
  onDone: () => void;
  saving: boolean;
  onCancel?: () => void;
  onSave: (
    article: Omit<Article, "id" | "createdAt" | "updatedAt"> & { id?: string },
    onSaved?: (id: string) => void
  ) => Promise<void>;
  resetTrigger?: number;
}

export default function ArticleFormContainer({
  article,
  onDone,
  saving,
  onCancel,
  onSave,
  resetTrigger = 0,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (
    articleData: Omit<Article, "id" | "createdAt" | "updatedAt"> & {
      id?: string;
    }
  ) => {
    setIsSubmitting(true);
    try {
      await onSave(articleData);
      onDone();
    } catch (error) {
      console.error("Failed to save article:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ArticleForm
      article={article}
      onSave={handleSave}
      onCancel={onCancel}
      isSubmitting={isSubmitting || saving}
      resetTrigger={resetTrigger}
    />
  );
}
