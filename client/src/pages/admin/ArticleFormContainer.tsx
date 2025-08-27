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
  onCancel,
  resetTrigger = 0,
}: Props) {

  return (
    <ArticleForm
      article={article}
      onCancel={onCancel}
      resetTrigger={resetTrigger}
    />
  );
}
