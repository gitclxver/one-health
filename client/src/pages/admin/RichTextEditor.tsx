// components/admin/RichTextEditor.tsx
import { useEffect, useRef, useCallback } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  // Memoize the change handler to prevent unnecessary effect re-runs
  const handleChange = useCallback(() => {
    if (quillRef.current) {
      onChange(quillRef.current.root.innerHTML);
    }
  }, [onChange]);

  useEffect(() => {
    if (containerRef.current && !quillRef.current) {
      const editorContainer = containerRef.current;
      const editor = document.createElement("div");
      editorContainer.appendChild(editor);

      quillRef.current = new Quill(editor, {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
          ],
        },
      });

      // Set initial content
      if (value) {
        quillRef.current.root.innerHTML = value;
      }

      // Add event listener
      quillRef.current.on("text-change", handleChange);

      // Cleanup function
      return () => {
        // Remove event listener first
        if (quillRef.current) {
          quillRef.current.off("text-change", handleChange);
        }

        // Clear the container using the saved reference
        editorContainer.replaceChildren();
        quillRef.current = null;
      };
    }
  }, [value, handleChange]); // Proper dependencies

  return (
    <div
      ref={containerRef}
      className="bg-white border border-gray-300 rounded min-h-[200px] p-1"
    />
  );
}
