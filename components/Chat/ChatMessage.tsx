import { Message } from "@/types";
import { Content } from "next/font/google";
import { FC, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "../Markdown/CodeBlock";
import { IconTrash, IconRefresh, IconEdit } from "@tabler/icons-react";

interface Props {
  message: Message;
  lightMode: "light" | "dark";
  onChangeMessage: (type: "del" | "edit" | "regen", message: string) => void;
  messageIsStreaming: boolean;
}

export const ChatMessage: FC<Props> = ({ message, lightMode, onChangeMessage, messageIsStreaming }) => {

  const [isEditing, setIsEditing] = useState(false);

  // create ref to the textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleEditMessageContent = () => {
    !isEditing && setIsEditing(true);
  }

  const handleSubmmitMessageContent = () => {
    setIsEditing(false);
    onChangeMessage("edit", textareaRef.current?.value.trim() || message.content);
  }

  return (
    <div
      className={`group ${message.role === "assistant" ? "text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 bg-gray-50 dark:bg-[#444654]" : "text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 bg-white dark:bg-[#343541]"}`}
      style={{ overflowWrap: "anywhere" }}
    >
      <div className="relative text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
        {isEditing ? (<>
          <div className="font-bold min-w-[40px]">{message.role === "assistant" ? "AI:" : "You:"}</div>
          <div className="prose dark:prose-invert mt-[-2px] w-full">
            <textarea
              className="h-32 p-2 border border-gray-300 dark:border-gray-700 
              rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 
              focus:border-transparent
              dark:bg-gray-800 dark:text-gray-100
              w-full"
              ref={textareaRef}
              defaultValue={message.content}
            />

            <button
              className=" float-right
              w-24 h-10 bg-blue-600 text-white rounded-md 
              hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 
              focus:ring-opacity-50"
              onClick={handleSubmmitMessageContent}
            >
              Submit
            </button>
          </div>
        </>) :
          (<>
            <div className="font-bold min-w-[40px]">{message.role === "assistant" ? "AI:" : "You:"}</div>

            <div className="prose dark:prose-invert mt-[-2px]">
              {message.role === "user" ? (
                <div className="prose dark:prose-invert whitespace-pre-wrap">{message.content}</div>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <CodeBlock
                          key={Math.random()}
                          language={match[1]}
                          value={String(children).replace(/\n$/, "")}
                          lightMode={lightMode}
                          {...props}
                        />
                      ) : (
                        <code
                          className={className}
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    table({ children }) {
                      return <table className="border-collapse border border-black dark:border-white py-1 px-3">{children}</table>;
                    },
                    th({ children }) {
                      return <th className="border border-black dark:border-white break-words py-1 px-3 bg-gray-500 text-white">{children}</th>;
                    },
                    td({ children }) {
                      return <td className="border border-black dark:border-white break-words py-1 px-3">{children}</td>;
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
              <div className="group-hover:opacity-100 opacity-0 transition-opacity duration-300
              absolute bottom-2 right-0 bg-gray-200 dark:bg-gray-800 rounded-md p-2 flex items-center
              "
                style={{ display: messageIsStreaming ? "none" : "flex" }}
              >
                <button
                  className="mr-2"
                  onClick={handleEditMessageContent}
                >
                  <IconEdit size={20} />
                </button>
                <button
                  className="mr-2"
                  onClick={() => onChangeMessage("del", "")}
                >
                  <IconTrash size={20} />
                </button>
                <button
                  onClick={() => onChangeMessage("regen", "")}
                >
                  <IconRefresh size={20} />
                </button>
              </div>
            </div>
          </>)}
      </div>
    </div>
  );
};
