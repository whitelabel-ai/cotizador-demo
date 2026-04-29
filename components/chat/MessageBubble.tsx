"use client";

import React from "react";
import { Bot, User } from "lucide-react";
import { cn, formatTime } from "@/lib/utils";
import type { Message } from "@/data/conversations";

interface MessageBubbleProps {
  message: Message;
}

export function TypingIndicator() {
  return (
    <div className="message-in flex items-end gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--status-ai-solid)] text-[var(--text-inverse)] shadow-[var(--shadow-subtle)]">
        <Bot className="h-4 w-4" />
      </div>
      <div className="ui-surface-raised flex items-center gap-1 rounded-[var(--radius-16)] rounded-bl-[8px] px-4 py-3">
        <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-[var(--text-muted)]" />
        <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-[var(--text-muted)]" />
        <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-[var(--text-muted)]" />
      </div>
    </div>
  );
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isCustomer = message.role === "customer";
  const isSystem = message.role === "system";

  if (isSystem) {
    return (
      <div className="message-in flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--status-ai-border)] bg-[var(--status-ai-surface)] px-3 py-1.5 text-xs text-[var(--status-ai-text)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--status-ai-solid)]" />
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("message-in flex items-end gap-3", isCustomer && "flex-row-reverse")}>
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full shadow-[var(--shadow-subtle)]",
          isCustomer
            ? "bg-[var(--surface-inverse)] text-[var(--text-inverse)]"
            : "bg-[var(--status-ai-solid)] text-[var(--text-inverse)]"
        )}
      >
        {isCustomer ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className={cn("flex max-w-[78%] flex-col gap-1.5", isCustomer && "items-end")}>
        <div
          className={cn(
            "rounded-[var(--radius-16)] border px-4 py-3",
            isCustomer
              ? "rounded-br-[8px] border-[color:var(--chat-user-border)] bg-[image:var(--chat-user-surface)] text-[var(--chat-user-text)] shadow-[var(--chat-user-shadow)]"
              : "rounded-bl-[8px] border-[color:var(--border-default)] bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-[var(--shadow-subtle)]"
          )}
        >
          <p
            className={cn(
              "text-sm leading-[1.65]",
              isCustomer ? "text-[var(--chat-user-text)]" : "text-[var(--text-secondary)]"
            )}
          >
            <MessageText content={message.content} isCustomer={isCustomer} />
          </p>
        </div>
        <span className="ui-body-sm px-1 text-[var(--text-muted)]">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
}

function MessageText({ content, isCustomer }: { content: string; isCustomer: boolean }) {
  const parts = content.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }

        if (part.startsWith("*") && part.endsWith("*")) {
          return (
            <em
              key={index}
              className={isCustomer ? "text-[var(--chat-user-text-subtle)]" : "text-[var(--text-muted)]"}
            >
              {part.slice(1, -1)}
            </em>
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </>
  );
}
