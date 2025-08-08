import { useEffect, useRef, useState } from "react";
import type { Article } from "../../../models/Article";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface Props {
  article?: Article | null;
  onSave: (
    article: Omit<Article, "id" | "createdAt" | "updatedAt"> & { id?: string }
  ) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export default function ArticleForm({
  article,
  onSave,
  onCancel,
  isSubmitting = false,
}: Props) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const tagsInputRef = useRef<HTMLInputElement>(null);

  const isEdit = Boolean(article);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write your article content here...",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ header: [1, 2, 3, false] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        },
      });

      quillRef.current.on("text-change", () => {
        const html = quillRef.current?.root.innerHTML || "";
        setContent(html);
      });

      if (article) {
        setTitle(article.title);
        setAuthor(article.author);
        setFeaturedImage(article.featuredImage || "");
        setExcerpt(article.excerpt);
        setTags(article.tags);
        setContent(article.content);
        setIsFeatured(article.isFeatured);
        setIsPublished(article.isPublished);
        quillRef.current.root.innerHTML = article.content;
      }
    }

    return () => {
      if (quillRef.current) {
        quillRef.current.off("text-change");
      }
    };
  }, [article]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const articleData = {
      id: article?.id,
      title,
      author,
      content,
      excerpt,
      featuredImage,
      tags,
      isFeatured,
      isPublished,
      ...(isPublished &&
        !article?.publishedAt && { publishedAt: new Date().toISOString() }),
    };

    onSave(articleData);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagsInputRef.current?.value.trim()) {
      e.preventDefault();
      const newTag = tagsInputRef.current.value.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      tagsInputRef.current.value = "";
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg p-6 shadow-md mb-6 max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6">
        {isEdit ? "Edit Article" : "Create New Article"}
      </h2>

      {/* Featured Image */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Featured Image</label>
        <div
          className="w-full h-40 border-2 border-dashed rounded flex items-center justify-center text-gray-400 hover:border-blue-500 transition cursor-pointer relative overflow-hidden bg-gray-50"
          onClick={() =>
            document.getElementById("featuredImageUpload")?.click()
          }
        >
          {featuredImage ? (
            <img
              src={featuredImage}
              alt="Preview"
              className="object-cover w-full h-full"
            />
          ) : (
            <span>Click to upload image</span>
          )}
          <input
            id="featuredImageUpload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setFeaturedImage(reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
            className="hidden"
          />
        </div>
      </div>

      {/* Title and Author */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block font-medium mb-2">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Author *</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
      </div>

      {/* Excerpt */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Excerpt *</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="w-full border rounded px-3 py-2 h-32"
          required
        />
      </div>

      {/* Content Editor */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Content *</label>
        <div ref={editorRef} className="bg-white rounded border h-64" />
      </div>

      {/* Tags */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Tags</label>
        <div className="border rounded p-2">
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 px-2 py-1 rounded flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            ref={tagsInputRef}
            type="text"
            onKeyDown={handleTagKeyDown}
            placeholder="Type a tag and press Enter"
            className="w-full border-0 focus:ring-0"
          />
        </div>
      </div>

      {/* Status Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="rounded text-blue-600"
          />
          <span>Featured Article</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="rounded text-blue-600"
          />
          <span>Publish Article</span>
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-400"
          disabled={isSubmitting || !title || !author || !excerpt || !content}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin mr-2">↻</span>
              {isEdit ? "Updating..." : "Creating..."}
            </span>
          ) : isEdit ? (
            "Update Article"
          ) : (
            "Create Article"
          )}
        </button>
      </div>
    </form>
  );
}
