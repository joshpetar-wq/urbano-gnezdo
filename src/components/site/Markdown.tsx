import ReactMarkdown from "react-markdown";

export default function Markdown({ children, className = "" }: { children: string; className?: string }) {
  if (!children?.trim()) return null;
  return (
    <div className={`prose-ug ${className}`}>
      <ReactMarkdown
        components={{
          a: ({ href, children }) => {
            const external = href?.startsWith("http");
            return (
              <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {children}
              </a>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
