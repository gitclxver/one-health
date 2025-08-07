// src/components/admin/ArticleForm.tsx
import { useEffect, useRef, useState } from "react";
import type { Article } from "../../../components/ArticleCard";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface Props {
  article?: Article | null;
  onSave: (article: Article) => void;
  onCancel?: () => void;
}

export default function ArticleForm({ article, onSave, onCancel }: Props) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");
  const [fullContent, setFullContent] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

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
        bounds: editorRef.current,
      });

      // Update fullContent state when editor content changes
      quillRef.current.on("text-change", () => {
        const content = quillRef.current?.root.innerHTML || "";
        setFullContent(content);
      });

      if (article) {
        setTitle(article.title);
        setAuthor(article.author);
        setImageUrl(article.imageUrl);
        setSummary(article.summary);
        setTags(article.tags.join(", "));
        setFullContent(article.fullContent);
        quillRef.current.root.innerHTML = article.fullContent;
      }
    }

    return () => {
      if (quillRef.current) {
        quillRef.current.off("text-change");
      }
    };
  }, [article]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newArticle: Article = {
      id: isEdit ? article!.id : Date.now().toString(),
      title,
      author,
      date: new Date().toLocaleDateString(),
      imageUrl,
      summary,
      fullContent, // Using the state we've been tracking
      tags: tags.split(",").map((t) => t.trim()),
    };

    onSave(newArticle);
    resetForm();
  }

  function resetForm() {
    setTitle("");
    setAuthor("");
    setImageUrl("");
    setSummary("");
    setTags("");
    setFullContent("");
    if (quillRef.current) {
      quillRef.current.setContents([]);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg p-6 shadow-md mb-6 max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-6">
        {isEdit ? "Edit Article" : "Add New Article"}
      </h2>

      {/* Header Image Upload */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Header Image</label>
        <div
          className="w-full h-40 border-2 border-dashed rounded flex items-center justify-center text-gray-400 hover:border-blue-500 transition cursor-pointer relative overflow-hidden bg-gray-50"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setImageUrl(reader.result as string);
              };
              reader.readAsDataURL(file);
            }
          }}
          onClick={() => {
            const fileInput = document.getElementById(
              "imageUpload"
            ) as HTMLInputElement;
            fileInput?.click();
          }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Preview"
              className="object-cover w-full h-full rounded"
            />
          ) : (
            <span>Drag & drop or click to upload image</span>
          )}
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setImageUrl(reader.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
            className="hidden"
          />
        </div>
      </div>

      {/* Title and Author in one line */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
      </div>

      {/* Fixed height summary */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Summary</label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="w-full border rounded px-3 py-2 h-32 resize-none"
          style={{ minHeight: "8rem" }}
        />
      </div>

      {/* Article content with Quill editor */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Article Content</label>
        <div
          ref={editorRef}
          className="bg-white rounded border"
          style={{ height: "200px" }}
        />
      </div>

      {/* Tags (simple text input) */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Tags (comma-separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Tag 1, Tag 2, Tag 3"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {isEdit ? "Update" : "Add Article"}
        </button>
      </div>
    </form>
  );
}
