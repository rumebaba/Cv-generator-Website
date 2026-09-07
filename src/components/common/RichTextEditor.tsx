import Blockquote from '@tiptap/extension-blockquote';
import Code from '@tiptap/extension-code';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Strike from '@tiptap/extension-strike';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect, forwardRef, useImperativeHandle, useRef, useState } from 'react';

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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const linkInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: false,
          codeBlock: false,
          strike: false,
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
        Strike,
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

    // Focus link input when modal opens
    useEffect(() => {
      if (showLinkModal && linkInputRef.current) {
        linkInputRef.current.focus();
      }
    }, [showLinkModal]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        editor.chain().focus().setImage({ src: reader.result as string }).run();
      };
      reader.readAsDataURL(file);

      // Reset input so same file can be selected again
      e.target.value = '';
    };

    const handleLinkSubmit = () => {
      if (!editor || !linkUrl.trim()) return;

      let url = linkUrl.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      editor.chain().focus().setLink({ href: url }).run();
      setLinkUrl('');
      setShowLinkModal(false);
    };

    const handleLinkRemove = () => {
      if (!editor) return;
      editor.chain().focus().unsetLink().run();
      setLinkUrl('');
      setShowLinkModal(false);
    };

    const btnClass = (active = false) =>
      `rounded p-1.5 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-700 ${active ? 'bg-slate-200 dark:bg-slate-700' : ''}`;

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
            {required && (
              <span className="ml-1 text-red-500" aria-hidden="true">*</span>
            )}
          </label>
        )}
        <div className="relative">
          <div className="flex flex-wrap items-center gap-1 rounded-t-lg border border-b-0 border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800">
            {/* Bold */}
            <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()}
              disabled={disabled || !editor?.can().toggleBold()}
              className={btnClass(editor?.isActive('bold'))} title="Bold (Ctrl+B)" aria-label="Bold">
              <svg className="h-4 w-4 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h2.5v9H10v-9zm3.5 9H10v-9h3.5v9z" />
              </svg>
            </button>

            {/* Italic */}
            <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()}
              disabled={disabled || !editor?.can().toggleItalic()}
              className={btnClass(editor?.isActive('italic'))} title="Italic (Ctrl+I)" aria-label="Italic">
              <svg className="h-4 w-4 text-slate-600 dark:text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
              </svg>
            </button>

            {/* Strikethrough */}
            <button type="button" onClick={() => editor?.chain().focus().toggleStrike().run()}
              disabled={disabled || !editor?.can().toggleStrike()}
              className={btnClass(editor?.isActive('strike'))} title="Strikethrough" aria-label="Strikethrough">
              <svg className="h-4 w-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 12H7m10-6H9a4 4 0 000 8h6a4 4 0 010 8H7" />
              </svg>
            </button>

            {/* Underline */}
            <button type="button" onClick={() => editor?.chain().focus().toggleUnderline().run()}
              disabled={disabled || !editor?.can().toggleUnderline()}
              className={btnClass(editor?.isActive('underline'))} title="Underline (Ctrl+U)" aria-label="Underline">
              <svg className="h-4 w-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v7a5 5 0 0010 0V4M5 21h14" />
              </svg>
            </button>

            {/* Inline Code */}
            <button type="button" onClick={() => editor?.chain().focus().toggleCode().run()}
              disabled={disabled || !editor?.can().toggleCode()}
              className={btnClass(editor?.isActive('code'))} title="Inline Code" aria-label="Inline Code">
              <svg className="h-4 w-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </button>

            <div className="flex-1" />

            {/* Align Left */}
            <button type="button" onClick={() => editor?.chain().focus().setTextAlign('left').run()}
              disabled={disabled || !editor?.can().setTextAlign('left')}
              className={btnClass(editor?.isActive({ textAlign: 'left' }))} title="Align Left" aria-label="Align Left">
              <svg className="h-4 w-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 12h12M3 18h16" />
              </svg>
            </button>

            {/* Align Center */}
            <button type="button" onClick={() => editor?.chain().focus().setTextAlign('center').run()}
              disabled={disabled || !editor?.can().setTextAlign('center')}
              className={btnClass(editor?.isActive({ textAlign: 'center' }))} title="Align Center" aria-label="Align Center">
              <svg className="h-4 w-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M6 12h12M3 18h18" />
              </svg>
            </button>

            {/* Align Right */}
            <button type="button" onClick={() => editor?.chain().focus().setTextAlign('right').run()}
              disabled={disabled || !editor?.can().setTextAlign('right')}
              className={btnClass(editor?.isActive({ textAlign: 'right' }))} title="Align Right" aria-label="Align Right">
              <svg className="h-4 w-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M9 12h12M5 18h16" />
              </svg>
            </button>

            {/* Bullet List */}
            <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()}
              disabled={disabled || !editor?.can().toggleBulletList()}
              className={btnClass(editor?.isActive('bulletList'))} title="Bullet List" aria-label="Bullet List">
              <svg className="h-4 w-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
            </button>

            {/* Numbered List */}
            <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              disabled={disabled || !editor?.can().toggleOrderedList()}
              className={btnClass(editor?.isActive('orderedList'))} title="Numbered List" aria-label="Numbered List">
              <svg className="h-4 w-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 6h13M7 12h13M7 18h13M3 6V4m0 2a1 1 0 110 2 1 1 0 010-2zm0 5v2m0-2a1 1 0 110 2 1 1 0 010-2zm0 5v2m0-2a1 1 0 110 2 1 1 0 010-2z" />
              </svg>
            </button>

            {/* Add Link */}
            <button type="button" onClick={() => {
              if (!editor) return;
              const prevUrl = editor.getAttributes('link').href || '';
              setLinkUrl(prevUrl);
              setShowLinkModal(true);
            }}
              disabled={disabled}
              className={btnClass(editor?.isActive('link'))} title="Add Link" aria-label="Add Link">
              <svg className="h-4 w-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </button>

            {/* Add Image (file upload) */}
            <button type="button" onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className={btnClass()} title="Add Image from Device" aria-label="Add Image">
              <svg className="h-4 w-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

            {/* Blockquote */}
            <button type="button" onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              disabled={disabled || !editor?.can().toggleBlockquote()}
              className={btnClass(editor?.isActive('blockquote'))} title="Quote" aria-label="Quote">
              <svg className="h-4 w-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>

          <EditorContent editor={editor} />

          {error && (
            <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>
          )}
          {helperText && !error && (
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{helperText}</p>
          )}
        </div>

        {/* Link Modal */}
        {showLinkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowLinkModal(false)}>
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
              <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Add Link</h3>
              <input
                ref={linkInputRef}
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleLinkSubmit(); if (e.key === 'Escape') setShowLinkModal(false); }}
                placeholder="https://example.com"
                className="mb-4 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              />
              <div className="flex justify-end gap-2">
                {editor?.isActive('link') && (
                  <button onClick={handleLinkRemove}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                    Remove Link
                  </button>
                )}
                <button onClick={() => setShowLinkModal(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
                  Cancel
                </button>
                <button onClick={handleLinkSubmit}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                  {editor?.isActive('link') ? 'Update' : 'Add'} Link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
