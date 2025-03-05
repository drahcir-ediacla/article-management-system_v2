"use client"

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Underline from "@tiptap/extension-underline";
import ImageResize from "tiptap-extension-resize-image";
import CodeBlock from "@tiptap/extension-code-block";
import HardBreak from "@tiptap/extension-hard-break";
import {
    Heading1,
    Heading2,
    Heading3,
    Code,
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    AlignCenter,
    AlignLeft,
    AlignRight,
    Highlighter,
    Upload,
    List,
    ListOrdered
} from "lucide-react";

const TipTapEditor = () => {

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: false,  // Disable StarterKit's default BulletList
                orderedList: false, // Disable StarterKit's default OrderedList
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Underline,
            BulletList,  // Add Bullet List support
            OrderedList, // Add Ordered List support
            ImageResize,
        ],
        content: "<p>Hello, this is a TipTap editor!</p>",
        editorProps: {
            attributes: {
                spellcheck: "false", // Ensures consistent rendering
                suppressHydrationWarning: "true", // Prevents mismatches
            },
        },
        immediatelyRender: false,

    });

    if (!editor) return null;

    const addImage = () => {
        const url = window.prompt("URL");
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };


    return (
        <div>
            {editor && (
                <div className="flex gap-[1px] p-[10px] border rounded-[4px] border-solid border-[#bcbcbc] mb-1 items-center">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`flex items-center justify-center h-[30px] w-[30px] rounded ${editor.isActive("heading", { level: 1 }) ? "bg-gray-600 text-white" : "bg-none"
                            }`}
                    >
                        <Heading1 className="size-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`flex items-center justify-center h-[30px] w-[30px] rounded ${editor.isActive("heading", { level: 2 }) ? "bg-gray-600 text-white" : "bg-none"
                            }`}
                    >
                        <Heading2 className="size-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={`flex items-center justify-center h-[30px] w-[30px] rounded ${editor.isActive("heading", { level: 3 }) ? "bg-gray-600 text-white" : "bg-none"
                            }`}
                    >
                        <Heading3 className="size-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`flex items-center justify-center h-[30px] w-[30px] rounded ${editor.isActive("bold") ? "bg-gray-600 text-white" : "bg-none"
                            }`}
                    >
                        <Bold className="size-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`flex items-center justify-center h-[30px] w-[30px] rounded ${editor.isActive("italic") ? "bg-gray-600 text-white" : "bg-none"
                            }`}
                    >
                        <Italic className="size-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`flex items-center justify-center h-[30px] w-[30px] rounded ${editor.isActive("underline") ? "bg-gray-600 text-white" : "bg-none"
                            }`}
                    >
                        <UnderlineIcon className="size-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign("left").run()}
                        className={`flex items-center justify-center h-[30px] w-[30px] rounded ${editor.isActive({ textAlign: "left" }) ? "bg-gray-600 text-white" : "bg-none"
                            }`}
                    >
                        <AlignLeft className="size-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign("center").run()}
                        className={`flex items-center justify-center h-[30px] w-[30px] rounded ${editor.isActive({ textAlign: "center" }) ? "bg-gray-600 text-white" : "bg-none"
                            }`}
                    >
                        <AlignCenter className="size-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign("right").run()}
                        className={`flex items-center justify-center h-[30px] w-[30px] rounded ${editor.isActive({ textAlign: "right" }) ? "bg-gray-600 text-white" : "bg-none"
                            }`}
                    >
                        <AlignRight className="size-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`flex items-center justify-center h-[30px] w-[30px] rounded ${editor.isActive("bulletList") ? "bg-gray-600 text-white" : "bg-none"
                            }`}
                    >
                        <List className="size-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`flex items-center justify-center h-[30px] w-[30px] rounded ${editor.isActive("orderedList") ? "bg-gray-600 text-white" : "bg-none"
                            }`}
                    >
                        <ListOrdered className="size-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={`flex items-center justify-center h-[30px] w-[30px] rounded ${editor.isActive("strike") ? "bg-gray-600 text-white" : "bg-none"
                            }`}
                    >
                        <Strikethrough className="size-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={`flex items-center justify-center h-[30px] w-[30px] rounded ${editor.isActive("codeBlock") ? "bg-gray-600 text-white" : "bg-none"
                            }`}
                    >
                        <Code className="size-4" />
                    </button>
                    <button
                        type="button"
                        onClick={addImage}
                        className={`flex items-center justify-center h-[30px] w-[30px] rounded ${editor.isActive("image") ? "bg-gray-600 text-white" : "bg-none"
                            }`}
                    >
                        <Upload className="size-4" />
                    </button>
                </div>
            )}
            <EditorContent editor={editor} />
        </div>
    );
};

export default TipTapEditor;
