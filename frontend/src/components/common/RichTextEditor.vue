<template>
  <div class="rich-editor" :class="{ 'is-disabled': disabled, 'is-compact': compact }">
    <div class="d-flex flex-wrap gap-1 mb-2 rich-toolbar">
      <button
        type="button"
        class="btn btn-sm btn-outline-secondary"
        :class="{ active: editor?.isActive('bold') }"
        :disabled="!canEdit"
        title="Bold"
        @click="toggleBold"
      >
        <i class="bi bi-type-bold"></i>
      </button>
      <button
        type="button"
        class="btn btn-sm btn-outline-secondary"
        :class="{ active: editor?.isActive('italic') }"
        :disabled="!canEdit"
        title="Italic"
        @click="toggleItalic"
      >
        <i class="bi bi-type-italic"></i>
      </button>
      <button
        v-if="!compact"
        type="button"
        class="btn btn-sm btn-outline-secondary"
        :class="{ active: editor?.isActive('bulletList') }"
        :disabled="!canEdit"
        title="Bullet list"
        @click="toggleBulletList"
      >
        <i class="bi bi-list-ul"></i>
      </button>
      <button
        v-if="!compact"
        type="button"
        class="btn btn-sm btn-outline-secondary"
        :class="{ active: editor?.isActive('orderedList') }"
        :disabled="!canEdit"
        title="Ordered list"
        @click="toggleOrderedList"
      >
        <i class="bi bi-list-ol"></i>
      </button>
      <button
        type="button"
        class="btn btn-sm btn-outline-secondary"
        :class="{ active: editor?.isActive('link') }"
        :disabled="!canEdit"
        title="Link"
        @click="setLink"
      >
        <i class="bi bi-link-45deg"></i>
      </button>
      <button
        type="button"
        class="btn btn-sm btn-outline-secondary"
        :disabled="!canEdit || uploading"
        title="Upload image"
        @click="pickImage"
      >
        <i class="bi bi-image"></i>
      </button>
      <button
        type="button"
        class="btn btn-sm btn-outline-secondary"
        :disabled="!canEdit"
        title="Image URL"
        @click="insertImageByUrl"
      >
        <i class="bi bi-image-alt"></i>
      </button>
      <button
        v-if="!compact"
        type="button"
        class="btn btn-sm btn-outline-secondary"
        :disabled="!canEdit"
        title="Clear formatting"
        @click="clearFormatting"
      >
        <i class="bi bi-eraser"></i>
      </button>
      <span v-if="uploading" class="text-muted small d-flex align-items-center ms-1">
        <span class="spinner-border spinner-border-sm me-1"></span>
        Uploading...
      </span>
    </div>
    <div class="form-control rich-editor__content" :style="{ minHeight: minHeight }">
      <EditorContent :editor="editor" />
    </div>
    <input
      ref="fileInput"
      type="file"
      class="d-none"
      accept="image/png,image/jpeg,image/webp,image/gif"
      @change="onFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import api from "../../api";

const props = defineProps<{
  modelValue?: string | null;
  placeholder?: string;
  disabled?: boolean;
  compact?: boolean;
  minHeight?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MIN_IMAGE_SIZE = 40;

const ImageWithSize = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => element.getAttribute("width"),
        renderHTML: (attributes) =>
          attributes.width ? { width: attributes.width } : {},
      },
      height: {
        default: null,
        parseHTML: (element) => element.getAttribute("height"),
        renderHTML: (attributes) =>
          attributes.height ? { height: attributes.height } : {},
      },
    };
  },
  addNodeView() {
    return ({ node, getPos, editor }) => {
      let currentNode = node;
      const wrapper = document.createElement("div");
      wrapper.classList.add("tiptap-image-resize");
      wrapper.setAttribute("contenteditable", "false");

      const img = document.createElement("img");
      img.draggable = true;

      const handle = document.createElement("span");
      handle.classList.add("tiptap-image-resize__handle");

      wrapper.append(img, handle);

      const applyAttributes = (attrs: Record<string, unknown>) => {
        Object.entries(attrs).forEach(([key, value]) => {
          if (value === null || value === undefined || value === "") {
            img.removeAttribute(key);
          } else {
            img.setAttribute(key, String(value));
          }
        });
      };

      applyAttributes(currentNode.attrs);

      const updateNodeAttributes = (width: number, height: number) => {
        const pos = typeof getPos === "function" ? getPos() : null;
        if (typeof pos !== "number") return;
        const nextAttrs = {
          ...currentNode.attrs,
          width: String(width),
          height: String(height),
        };
        const tr = editor.state.tr.setNodeMarkup(pos, undefined, nextAttrs);
        editor.view.dispatch(tr);
      };

      const onPointerDown = (event: PointerEvent) => {
        if (!editor.isEditable) return;
        if (!wrapper.classList.contains("is-selected")) return;
        event.preventDefault();
        event.stopPropagation();
        const rect = img.getBoundingClientRect();
        const startWidth = rect.width || img.naturalWidth || 200;
        const startHeight = rect.height || img.naturalHeight || 200;
        const startX = event.clientX;
        const ratio = startHeight / startWidth || 1;

        const onPointerMove = (moveEvent: PointerEvent) => {
          const deltaX = moveEvent.clientX - startX;
          const nextWidth = Math.max(
            MIN_IMAGE_SIZE,
            Math.round(startWidth + deltaX)
          );
          const nextHeight = Math.max(
            MIN_IMAGE_SIZE,
            Math.round(nextWidth * ratio)
          );
          updateNodeAttributes(nextWidth, nextHeight);
        };

        const onPointerUp = () => {
          window.removeEventListener("pointermove", onPointerMove);
          window.removeEventListener("pointerup", onPointerUp);
          window.removeEventListener("pointercancel", onPointerUp);
        };

        window.addEventListener("pointermove", onPointerMove);
        window.addEventListener("pointerup", onPointerUp);
        window.addEventListener("pointercancel", onPointerUp);
      };

      handle.addEventListener("pointerdown", onPointerDown);

      return {
        dom: wrapper,
        update: (updatedNode) => {
          if (updatedNode.type.name !== currentNode.type.name) return false;
          currentNode = updatedNode;
          applyAttributes(updatedNode.attrs);
          return true;
        },
        selectNode: () => {
          wrapper.classList.add("is-selected");
        },
        deselectNode: () => {
          wrapper.classList.remove("is-selected");
        },
        destroy: () => {
          handle.removeEventListener("pointerdown", onPointerDown);
        },
      };
    };
  },
});

const editor = new Editor({
  content: props.modelValue ?? "",
  editable: !props.disabled,
  extensions: [
    StarterKit.configure({
      heading: false,
      blockquote: false,
      codeBlock: false,
      horizontalRule: false,
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
    }),
    ImageWithSize.configure({ allowBase64: false }),
    Placeholder.configure({
      placeholder: props.placeholder ?? "",
    }),
  ],
  onUpdate: ({ editor }) => {
    emit("update:modelValue", editor.getHTML());
  },
});

const canEdit = computed(() => !!editor && !props.disabled);
const minHeight = computed(() => props.minHeight || (props.compact ? "80px" : "140px"));

watch(
  () => props.modelValue,
  (value) => {
    if (!editor || editor.isDestroyed) return;
    const next = value ?? "";
    if (editor.getHTML() !== next) {
      editor.commands.setContent(next, false);
    }
  }
);

watch(
  () => props.disabled,
  (value) => {
    if (!editor || editor.isDestroyed) return;
    editor.setEditable(!value);
  }
);

onBeforeUnmount(() => {
  editor?.destroy();
});

function toggleBold() {
  editor?.chain().focus().toggleBold().run();
}

function toggleItalic() {
  editor?.chain().focus().toggleItalic().run();
}

function toggleBulletList() {
  editor?.chain().focus().toggleBulletList().run();
}

function toggleOrderedList() {
  editor?.chain().focus().toggleOrderedList().run();
}

function clearFormatting() {
  editor?.chain().focus().unsetAllMarks().clearNodes().run();
}

function setLink() {
  if (!editor) return;
  const previousUrl = editor.getAttributes("link").href as string | undefined;
  const url = window.prompt("Enter URL", previousUrl || "");
  if (url === null) return;
  const trimmed = url.trim();
  if (!trimmed) {
    editor.chain().focus().unsetLink().run();
    return;
  }
  if (!isAllowedLinkUrl(trimmed)) {
    alert("Only http(s) or mailto links are allowed.");
    return;
  }
  editor
    .chain()
    .focus()
    .extendMarkRange("link")
    .setLink({ href: trimmed, target: "_blank", rel: "noopener noreferrer" })
    .run();
}

function pickImage() {
  if (!fileInput.value || uploading.value) return;
  fileInput.value.click();
}

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (!file) return;
  if (!ALLOWED_MIME.has(file.type)) {
    alert("Only PNG, JPG, WEBP, or GIF images are allowed.");
    return;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    alert("Image size must be 2MB or less.");
    return;
  }
  uploading.value = true;
  try {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post("/uploads/images", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const url = data?.url;
    if (typeof url === "string" && url.length > 0) {
      editor?.chain().focus().setImage({ src: url }).run();
    } else {
      alert("Upload failed: missing URL.");
    }
  } catch (err: any) {
    alert(err?.response?.data?.message || err?.message || "Upload failed.");
  } finally {
    uploading.value = false;
  }
}

function insertImageByUrl() {
  if (!editor) return;
  const url = window.prompt("Image URL (http/https or /uploads/...)");
  if (!url) return;
  const trimmed = url.trim();
  if (!isAllowedImageUrl(trimmed)) {
    alert("Only http(s) or /uploads URLs are allowed.");
    return;
  }
  editor.chain().focus().setImage({ src: trimmed }).run();
}

function isAllowedLinkUrl(url: string): boolean {
  return /^(https?:\/\/|mailto:)/i.test(url);
}

function isAllowedImageUrl(url: string): boolean {
  return /^https?:\/\//i.test(url) || url.startsWith("/uploads/");
}
</script>

<style scoped>
.rich-editor__content {
  padding: 0.5rem 0.75rem;
}

.rich-editor__content :deep(.ProseMirror) {
  min-height: 100%;
  outline: none;
}

.rich-editor__content :deep(.ProseMirror p) {
  margin: 0 0 0.5rem;
}

.rich-editor__content :deep(.ProseMirror p:last-child) {
  margin-bottom: 0;
}

.rich-editor__content :deep(.tiptap-image-resize) {
  position: relative;
  display: inline-block;
  max-width: 100%;
}

.rich-editor__content :deep(.tiptap-image-resize img) {
  max-width: 100%;
  height: auto;
}

.rich-editor__content :deep(.tiptap-image-resize.is-selected) {
  outline: 2px solid rgba(13, 110, 253, 0.25);
  outline-offset: 2px;
}

.rich-editor__content :deep(.tiptap-image-resize__handle) {
  position: absolute;
  right: -6px;
  bottom: -6px;
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: #0d6efd;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
  cursor: nwse-resize;
  touch-action: none;
  display: none;
}

.rich-editor__content :deep(
    .tiptap-image-resize.is-selected .tiptap-image-resize__handle
  ) {
  display: block;
}

.rich-editor.is-disabled {
  opacity: 0.7;
}

.rich-toolbar .btn.active {
  background-color: rgba(13, 110, 253, 0.1);
  border-color: rgba(13, 110, 253, 0.35);
}
</style>
