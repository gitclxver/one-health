import { useEffect, useRef, useState } from "react";
import type { Article } from "../../../models/Article";
import Quill from "quill";
import { useArticlesStore } from "../../../store/useArticlesStore";
import { useNewsletterStore } from "../../../store/useNewsletterStore";

interface Props {
  article?: Article | null;
  onCancel?: () => void;
  resetTrigger?: number;
}

export default function ArticleForm({
  article,
  onCancel,
  resetTrigger = 0,
}: Props) {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const previousResetTrigger = useRef(resetTrigger);

  const { saveArticle, uploadArticleImage, saving, error } = useArticlesStore();
  const { sendNewsletter } = useNewsletterStore();

  const clearForm = () => {
    setTitle("");
    setImageUrl("");
    setDescription("");
    setContent("");
    setPreviewUrl(null);
    setUploadError(null);

    if (quillRef.current) {
      quillRef.current.setContents([]);
      quillRef.current.root.innerHTML = "";
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (resetTrigger > previousResetTrigger.current) {
      clearForm();
      previousResetTrigger.current = resetTrigger;
    }
  }, [resetTrigger]);

  useEffect(() => {
    if (article) {
      setTitle(article.title || "");
      setImageUrl(article.imageUrl || "");
      setDescription(article.description || "");
      setContent(article.content || "");
      setPreviewUrl(null);
      setUploadError(null);

      if (quillRef.current) {
        quillRef.current.root.innerHTML = article.content || "";
      }
    } else if (resetTrigger === previousResetTrigger.current) {
      clearForm();
    }
  }, [article, resetTrigger]);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ header: [1, 2, 3, false] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        },
        placeholder: "Write your article content here...",
      });

      quillRef.current = quill;

      quill.on("text-change", () => {
        const html = quill.root.innerHTML;
        setContent(html === "<p><br></p>" ? "" : html);
      });
    }

    return () => {
      quillRef.current?.off("text-change");
    };
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be less than 5MB");
      return;
    }

    setIsUploadingImage(true);
    setUploadError(null);

    try {
      setPreviewUrl(URL.createObjectURL(file));
    } catch (err) {
      console.error("Image preview failed:", err);
      setUploadError("Failed to process image. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (publish: boolean) => {
    const latestContent = quillRef.current?.root.innerHTML || content;
    const sanitizedContent = latestContent.replace(/<p><br><\/p>/g, "").trim();

    if (!sanitizedContent) {
      alert("Article content cannot be empty");
      return;
    }
    if (!title.trim() || !description.trim()) {
      alert("Title and description are required");
      return;
    }

    const articleData: Omit<Article, "id" | "createdAt" | "updatedAt"> & {
      id?: string;
      isPublished: boolean;
      publishedAt?: string;
    } = {
      id: article?.id,
      title: title.trim(),
      description: description.trim(),
      content: sanitizedContent,
      imageUrl,
      isPublished: publish,
      publishedAt: publish ? new Date().toISOString() : article?.publishedAt,
    };

    try {
      const savedArticle = await saveArticle(articleData);

      // Upload image after article is created/updated
      if (previewUrl && fileInputRef.current?.files?.[0] && savedArticle.id) {
        const file = fileInputRef.current.files[0];
        await uploadArticleImage(savedArticle.id, file);
      }

      if (previewUrl) URL.revokeObjectURL(previewUrl);

      if (publish && savedArticle.id) {
        await sendNewsletter(Number(savedArticle.id));
        alert("Article published and newsletter sent.");
      } else {
        alert("Article saved successfully.");
      }
    } catch (err) {
      console.error("Failed to save article:", err);
      alert("Failed to save. Please try again.");
    }
  };

  const resolvedImageUrl = previewUrl || imageUrl || "";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(!article);
      }}
      className="max-w-6xl mx-auto p-8 rounded-xl bg-white shadow-lg flex flex-col min-h-[60vh]"
    >
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image
            </label>
            <div
              className={`w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 relative cursor-pointer hover:opacity-90 transition ${
                isUploadingImage || saving
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={() =>
                !isUploadingImage && !saving && fileInputRef.current?.click()
              }
            >
              {resolvedImageUrl ? (
                <img
                  src={resolvedImageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  {isUploadingImage ? "Processing..." : "Click to upload"}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                hidden
                disabled={isUploadingImage || saving}
              />
            </div>
            {uploadError && (
              <p className="mt-2 text-sm text-red-600">{uploadError}</p>
            )}
          </div>

          <div className="space-y-4">
            <input
              className="w-full border border-gray-300 p-3 rounded-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              required
              disabled={saving}
            />
            <textarea
              className="w-full border border-gray-300 p-3 rounded-lg resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Description"
              maxLength={250}
              required
              disabled={saving}
            />
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-2 flex flex-col">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <div
            ref={editorRef}
            className="border-2 border-gray-300 rounded-lg bg-white flex-grow overflow-auto"
            style={{ minHeight: "300px", maxHeight: "40vh" }}
          />
        </div>
      </div>

      {/* Actions - Fixed at bottom */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-4 sticky bottom-0 bg-white py-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            disabled={saving}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={saving || isUploadingImage}
          className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${
            article
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {saving ? "Saving..." : article ? "Update" : "Publish"}
        </button>
      </div>
    </form>
  );
}
