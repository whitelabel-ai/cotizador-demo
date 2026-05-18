import type { Quote } from "@/data/quotes";
import type { Message } from "@/data/conversations";

const QUOTES_KEY = "quoteai_quotes";
const MESSAGES_KEY = "quoteai_messages";

function isClient(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function saveQuotes(quotes: Quote[]): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
  } catch (error) {
    console.error("[Storage] Error saving quotes:", error);
  }
}

export function loadQuotes(): Quote[] {
  if (!isClient()) return [];
  try {
    const data = localStorage.getItem(QUOTES_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error("[Storage] Error loading quotes:", error);
    return [];
  }
}

export function saveMessages(quoteId: string, messages: Message[]): void {
  if (!isClient()) return;
  try {
    const allMessages = loadAllMessages();
    allMessages[quoteId] = messages;
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMessages));
  } catch (error) {
    console.error("[Storage] Error saving messages:", error);
  }
}

export function loadMessages(quoteId: string): Message[] {
  if (!isClient()) return [];
  try {
    const allMessages = loadAllMessages();
    return allMessages[quoteId] || [];
  } catch (error) {
    console.error("[Storage] Error loading messages:", error);
    return [];
  }
}

export function loadAllMessages(): Record<string, Message[]> {
  if (!isClient()) return {};
  try {
    const data = localStorage.getItem(MESSAGES_KEY);
    if (!data) return {};
    return JSON.parse(data);
  } catch (error) {
    console.error("[Storage] Error loading all messages:", error);
    return {};
  }
}

export function deleteQuote(quoteId: string): void {
  if (!isClient()) return;
  try {
    const quotes = loadQuotes();
    const filtered = quotes.filter((q) => q.id !== quoteId);
    saveQuotes(filtered);

    const allMessages = loadAllMessages();
    delete allMessages[quoteId];
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMessages));
  } catch (error) {
    console.error("[Storage] Error deleting quote:", error);
  }
}

export function duplicateQuote(quoteId: string): Quote | null {
  if (!isClient()) return null;
  try {
    const quotes = loadQuotes();
    const original = quotes.find((q) => q.id === quoteId);
    if (!original) return null;

    const newQuote: Quote = {
      ...original,
      id: `quote-${Date.now()}`,
      number: `Q-2024-${String(quotes.length + 1).padStart(3, "0")}`,
      status: "draft",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      lastIntent: "Cotización duplicada",
    };

    saveQuotes([newQuote, ...quotes]);

    const messages = loadMessages(quoteId);
    if (messages.length > 0) {
      saveMessages(newQuote.id, [
        {
          id: `msg-${Date.now()}`,
          role: "ai",
          type: "text",
          content: `Cotización duplicada de ${original.number}.`,
          timestamp: new Date().toISOString(),
        },
      ]);
    }

    return newQuote;
  } catch (error) {
    console.error("[Storage] Error duplicating quote:", error);
    return null;
  }
}

export function clearAll(): void {
  if (!isClient()) return;
  try {
    localStorage.removeItem(QUOTES_KEY);
    localStorage.removeItem(MESSAGES_KEY);
  } catch (error) {
    console.error("[Storage] Error clearing all:", error);
  }
}

export function hasData(): boolean {
  if (!isClient()) return false;
  const quotes = loadQuotes();
  return quotes.length > 0;
}
