import { useEffect, useRef, useState } from "react";
import type { Article } from "../../../models/Article";
import Quill from "quill";
import {
  uploadTempImage,
  finalizeTempImage,
} from "../../../services/admin/adminArticleService";
import { useNewsletterStore } from "../../../store/useNewsletterStore";

interface Props {
  article?: Article | null;
  onSave: (
    articleData: Omit<Article, "id" | "createdAt" | "updatedAt"> & {
      id?: string;
    },
    onSaved?: (id: string) => void
  ) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  resetTrigger?: number;
}

export default function ArticleForm({
  article,
  onSave,
  onCancel,
  isSubmitting = false,
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
    } else {
      if (resetTrigger === previousResetTrigger.current) {
        clearForm();
      }
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
      if (quillRef.current) {
        quillRef.current.off("text-change");
      }
    };
  }, []);

  useEffect(() => {
    if (quillRef.current && article?.content !== undefined) {
      const currentContent = quillRef.current.root.innerHTML;
      const newContent = article.content || "";

      if (currentContent !== newContent) {
        if (newContent === "") {
          quillRef.current.setContents([]);
          quillRef.current.root.innerHTML = "";
        } else {
          quillRef.current.root.innerHTML = newContent;
        }
        setContent(newContent);
      }
    }
  }, [article?.content]);

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
      const uploadedPath = await uploadTempImage(file);
      setImageUrl(uploadedPath);
      const blobUrl = URL.createObjectURL(file);
      setPreviewUrl(blobUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const latestContent = quillRef.current?.root.innerHTML || content;
    const sanitizedContent = latestContent
      .replace(/<p><br><\/p>/g, "")
      .replace(/<p>\s*<\/p>/g, "")
      .trim();

    if (!sanitizedContent || sanitizedContent === "<p></p>") {
      alert("Article content cannot be empty");
      return;
    }

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    if (!description.trim()) {
      alert("Description is required");
      return;
    }

    const articleData = {
      id: article?.id,
      title: title.trim(),
      description: description.trim(),
      content: sanitizedContent,
      imageUrl,
      isPublished: true,
      publishedAt: article?.publishedAt || new Date().toISOString(),
    };

    const isTemp = imageUrl?.includes("temp-");

    try {
      let savedId: string | undefined;
      await onSave(articleData, (id) => {
        savedId = id;
      });

      if (isTemp && savedId && imageUrl) {
        try {
          const finalImageUrl = await finalizeTempImage(imageUrl, savedId);
          console.log("Image finalized:", finalImageUrl);
        } catch (error) {
          console.error("Failed to finalize image:", error);
        }
      }

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      if (savedId) {
        await sendNewsletter(Number(savedId));
        alert("Newsletter sent successfully.");
      }
    } catch (error) {
      console.error("Failed to save article or send newsletter:", error);
      alert("Failed to complete action. Please try again.");
    }
  };

  const handlePublish = async () => {
    const latestContent = quillRef.current?.root.innerHTML || content;
    const sanitizedContent = latestContent
      .replace(/<p><br><\/p>/g, "")
      .replace(/<p>\s*<\/p>/g, "")
      .trim();

    if (!sanitizedContent || sanitizedContent === "<p></p>") {
      alert("Article content cannot be empty");
      return;
    }

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    if (!description.trim()) {
      alert("Description is required");
      return;
    }

    const confirmPublish = window.confirm(
      "Are you sure you want to publish this article and send it as a newsletter?"
    );

    if (!confirmPublish) return;

    const articleData = {
      id: article?.id,
      title: title.trim(),
      description: description.trim(),
      content: sanitizedContent,
      imageUrl,
      isPublished: true,
      publishedAt: new Date().toISOString(),
    };

    const isTemp = imageUrl?.includes("temp-");

    try {
      let savedId: string | undefined;
      await onSave(articleData, (id) => {
        savedId = id;
      });

      if (isTemp && savedId && imageUrl) {
        try {
          const finalImageUrl = await finalizeTempImage(imageUrl, savedId);
          console.log("Image finalized:", finalImageUrl);
        } catch (error) {
          console.error("Failed to finalize image:", error);
        }
      }

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      if (savedId) {
        await sendNewsletter(Number(savedId));
        alert("Newsletter sent successfully.");
      }
    } catch (error) {
      console.error("Failed to publish article or send newsletter:", error);
      alert("Failed to complete action. Please try again.");
    }
  };

  const handleImageClick = () => {
    if (!isUploadingImage && !isSubmitting) {
      fileInputRef.current?.click();
    }
  };

  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (onCancel) {
      onCancel();
    }
  };

  const resolvedImageUrl = previewUrl
    ? previewUrl
    : imageUrl?.startsWith("http") || imageUrl?.startsWith("/")
    ? imageUrl
    : imageUrl
    ? `${import.meta.env.VITE_API_BASE_URL}/${imageUrl}`
    : "";

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl mx-auto p-8 rounded-xl bg-white shadow-lg"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image
            </label>
            <div
              className={`w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 relative cursor-pointer hover:opacity-90 transition ${
                isUploadingImage || isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={handleImageClick}
            >
              {resolvedImageUrl ? (
                <img
                  src={resolvedImageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <svg
                    className="w-12 h-12 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm">
                    {isUploadingImage ? "Uploading..." : "Click to upload"}
                  </span>
                </div>
              )}
              {isUploadingImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <div className="flex items-center space-x-2 text-white">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Uploading...</span>
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                hidden
                disabled={isUploadingImage || isSubmitting}
              />
            </div>
            {uploadError && (
              <p className="mt-2 text-sm text-red-600">{uploadError}</p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isSubmitting}
                maxLength={100}
                placeholder="Title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *{" "}
                <span className="text-gray-500 text-xs font-normal">
                  ({description.length}/250)
                </span>
              </label>
              <textarea
                className="w-full border border-gray-300 p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={description}
                onChange={(e) => {
                  if (e.target.value.length <= 250) {
                    setDescription(e.target.value);
                  }
                }}
                required
                rows={4}
                maxLength={250}
                disabled={isSubmitting}
                placeholder="Description"
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {description.length}/250
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
            <div
              ref={editorRef}
              className="bg-white min-h-[50vh] max-h-[50vh] overflow-y-auto"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex justify-end gap-4">
          {onCancel && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handlePublish}
            disabled={isSubmitting || isUploadingImage}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {isSubmitting ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>
    </form>
  );
}
