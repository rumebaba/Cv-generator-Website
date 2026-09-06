import Blockquote from '@tiptap/extension-blockquote';
import Code from '@tiptap/extension-code';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  minHeight?: string;
}

export interface RichTextEditorRef {
  focus: () => boolean | undefined;
  getHTML: () => string;
  getText: () => string;
  clear: () => boolean | undefined;
}

export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  (
    {
      value,
      onChange,
      placeholder = 'Start writing...',
      label,
      error,
      helperText,
      fullWidth = true,
      required = false,
      disabled = false,
      autoFocus = false,
      minHeight = '150px',
    },
    ref
  ) => {
    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: false,
          codeBlock: false,
        }),
        Placeholder.configure({
          placeholder,
        }),
        Image.configure({
          HTMLAttributes: {
            class: 'rounded-lg max-w-full h-auto my-2',
          },
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-indigo-600 underline hover:text-indigo-800',
          },
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Underline,
        Code.configure({
          HTMLAttributes: {
            class: 'bg-slate-100 dark:bg-slate-800 px-1 rounded',
          },
        }),
        Blockquote.configure({
          HTMLAttributes: {
            class:
              'border-l-4 border-indigo-500 pl-4 italic text-slate-600 dark:text-slate-400 my-2',
          },
        }),
      ],
      content: value,
      editable: !disabled,
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
      editorProps: {
        attributes: {
          class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none p-4',
          style: `min-height: ${minHeight};`,
        },
      },
    });

    useImperativeHandle(ref, () => ({
      focus: () => editor?.commands.focus(),
      getHTML: () => editor?.getHTML() || '',
      getText: () => editor?.getText() || '',
      clear: () => editor?.commands.clearContent(),
    }));

    useEffect(() => {
      if (autoFocus && editor) {
        editor.commands.focus();
      }
    }, [autoFocus, editor]);

    const handleLinkAdd = () => {
      if (!editor) return;
      const url = window.prompt('Enter URL:');
      if (url) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    };

    const handleImageAdd = () => {
      if (!editor) return;
      const url = window.prompt('Enter image URL:');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    };

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
            {required && (
              <span className="ml-1 text-red-500" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
        <div className="relative">
          <div className="flex items-center gap-1 rounded-t-lg border border-b-0 border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              disabled={disabled || !editor?.can().toggleBold()}
              className="rounded p-1.5 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-700"
              title="Bold (Ctrl+B)"
              aria-label="Bold"
            >
              <svg
                className="h-4 w-4 text-slate-600 dark:text-slate-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h2.5v9H10v-9zm3.5 9H10v-9h3.5v9z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              disabled={disabled || !editor?.can().toggleItalic()}
              className="rounded p-1.5 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-700"
              title="Italic (Ctrl+I)"
              aria-label="Italic"
            >
              <svg
                className="h-4 w-4 text-slate-600 dark:text-slate-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              disabled={disabled || !editor?.can().toggleStrike()}
              className="rounded p-1.5 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-700"
              title="Strikethrough"
              aria-label="Strikethrough"
            >
              <svg
                className="h-4 w-4 text-slate-600 dark:text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              disabled={disabled || !editor?.can().toggleUnderline()}
              className="rounded p-1.5 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-700"
              title="Underline (Ctrl+U)"
              aria-label="Underline"
            >
              <svg
                className="h-4 w-4 text-slate-600 dark:text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 4v16M4 18h16M10 4v16"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleCode().run()}
              disabled={disabled || !editor?.can().toggleCode()}
              className="rounded p-1.5 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-700"
              title="Inline Code"
              aria-label="Inline Code"
            >
              <svg
                className="h-4 w-4 text-slate-600 dark:text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </button>
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => editor?.chain().focus().setTextAlign('left').run()}
              disabled={disabled || !editor?.can().setTextAlign('left')}
              className="rounded p-1.5 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-700"
              title="Align Left"
              aria-label="Align Left"
            >
              <svg
                className="h-4 w-4 text-slate-600 dark:text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M3 14h18M3 18h18"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().setTextAlign('center').run()}
              disabled={disabled || !editor?.can().setTextAlign('center')}
              className="rounded p-1.5 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-700"
              title="Align Center"
              aria-label="Align Center"
            >
              <svg
                className="h-4 w-4 text-slate-600 dark:text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 002 2h2a2 2 0 002-2z"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().setTextAlign('right').run()}
              disabled={disabled || !editor?.can().setTextAlign('right')}
              className="rounded p-1.5 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-700"
              title="Align Right"
              aria-label="Align Right"
            >
              <svg
                className="h-4 w-4 text-slate-600 dark:text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M3 14h18M3 18h18"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              disabled={disabled || !editor?.can().toggleBulletList()}
              className="rounded p-1.5 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-700"
              title="Bullet List"
              aria-label="Bullet List"
            >
              <svg
                className="h-4 w-4 text-slate-600 dark:text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012 2v12a2 2 0 01-2 2H9m9-12a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2h10"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              disabled={disabled || !editor?.can().toggleOrderedList()}
              className="rounded p-1.5 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-700"
              title="Numbered List"
              aria-label="Numbered List"
            >
              <svg
                className="h-4 w-4 text-slate-600 dark:text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleLinkAdd}
              disabled={disabled}
              className="rounded p-1.5 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-700"
              title="Add Link"
              aria-label="Add Link"
            >
              <svg
                className="h-4 w-4 text-slate-600 dark:text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleImageAdd}
              disabled={disabled}
              className="rounded p-1.5 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-700"
              title="Add Image"
              aria-label="Add Image"
            >
              <svg
                className="h-4 w-4 text-slate-600 dark:text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              disabled={disabled || !editor?.can().toggleBlockquote()}
              className="rounded p-1.5 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-700"
              title="Quote"
              aria-label="Quote"
            >
              <svg
                className="h-4 w-4 text-slate-600 dark:text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>
          </div>
          <EditorContent editor={editor} />
          {error && (
            <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}
          {helperText && !error && (
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{helperText}</p>
          )}
        </div>
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
