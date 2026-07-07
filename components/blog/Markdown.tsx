import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Renderiza Markdown con estilos afinados para fondo oscuro (bg-ink).
// Se usa en el artículo público y en la vista previa del editor.
export default function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...p }) => <h2 className="mb-4 mt-10 font-display text-[1.9rem] font-semibold text-white" {...p} />,
        h2: ({ node, ...p }) => <h2 className="mb-3 mt-9 font-display text-[1.5rem] font-semibold text-white" {...p} />,
        h3: ({ node, ...p }) => <h3 className="mb-2 mt-7 font-display text-[1.2rem] font-semibold text-white" {...p} />,
        p: ({ node, ...p }) => <p className="mb-5 leading-[1.85] text-neutral-300" {...p} />,
        a: ({ node, ...p }) => <a className="text-seal underline underline-offset-2 hover:text-seal-deep" {...p} />,
        ul: ({ node, ...p }) => <ul className="mb-5 ml-5 list-disc space-y-2 text-neutral-300" {...p} />,
        ol: ({ node, ...p }) => <ol className="mb-5 ml-5 list-decimal space-y-2 text-neutral-300" {...p} />,
        li: ({ node, ...p }) => <li className="leading-[1.7]" {...p} />,
        blockquote: ({ node, ...p }) => (
          <blockquote className="my-6 border-l-2 border-seal pl-5 italic text-neutral-400" {...p} />
        ),
        code: ({ node, ...p }) => <code className="rounded bg-white/10 px-1.5 py-0.5 text-[0.85em]" {...p} />,
        pre: ({ node, ...p }) => <pre className="my-6 overflow-x-auto rounded-lg bg-black/40 p-4 text-[0.85em]" {...p} />,
        img: ({ node, ...p }) => (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          <img className="my-6 w-full rounded-lg" {...p} />
        ),
        hr: () => <hr className="my-8 border-[var(--line)]" />,
        strong: ({ node, ...p }) => <strong className="font-semibold text-white" {...p} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
