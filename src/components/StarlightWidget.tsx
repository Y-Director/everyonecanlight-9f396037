import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { RotateCcw, X } from "lucide-react";
import starlight from "@/assets/starlight.png.asset.json";
import { cn } from "@/lib/utils";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
const ThinkingIndicator = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2 text-sm text-muted-foreground">
    <span className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-[#ddff35] animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
    <span className="animate-pulse">{label}</span>
  </div>
);

const FAQS = [
  "What light should I start with?",
  "How do I light a talking head video?",
  "Why does my video look dark?",
  "What is CRI and does it matter?",
  "Softbox or umbrella first?",
  "How do I rent equipment here?",
  "What is the Shift The Light Masterclass?",
];

const PAGE_LABELS: Record<string, string> = {
  "/": "the home page",
  "/rent-equipment": "the Rent Equipment page (rental catalogue, gear list, props, booking)",
  "/lighting-equipment": "the Equipment Database",
  "/control-apps": "the Control Apps page",
  "/learn": "the Learn page",
  "/courses": "the Learn page",
  "/articles": "the Articles page",
  "/masterclass": "the Shift The Light Masterclass page",
};

const describePage = (pathname: string) => {
  if (PAGE_LABELS[pathname]) return PAGE_LABELS[pathname];
  if (pathname.startsWith("/articles/")) return "an article page in Learn";
  if (pathname.startsWith("/lighting-equipment/")) return "an equipment detail page in the Equipment Database";
  return "the Everyone Can Light website";
};

const StarlightWidget = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [input, setInput] = useState("");
  const panelRef = useRef<HTMLDivElement | null>(null);
  const focusInput = () =>
    panelRef.current?.querySelector<HTMLTextAreaElement>("textarea")?.focus();

  const { messages, sendMessage, setMessages, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/starlight-chat`,
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        "Content-Type": "application/json",
      },
    }),
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => focusInput(), 120);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (open && status === "ready") focusInput();
  }, [open, status]);

  const ask = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    setInput("");
    sendMessage({ text: value }, { body: { pageContext: describePage(pathname) } });
  };

  const handleSubmit = (message: PromptInputMessage) => {
    ask(message.text ?? input);
  };

  const MASCOT = 64;

  const startDrag = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    dragRef.current = { moved: false };

    const move = (ev: PointerEvent) => {
      if (
        !dragRef.current.moved &&
        Math.abs(ev.clientX - e.clientX) < 4 &&
        Math.abs(ev.clientY - e.clientY) < 4
      )
        return;
      dragRef.current.moved = true;
      setDragging(true);
      setHovered(false);
      const x = Math.min(
        Math.max(ev.clientX - offsetX, 8),
        window.innerWidth - MASCOT - 8,
      );
      const y = Math.min(
        Math.max(ev.clientY - offsetY, 8),
        window.innerHeight - MASCOT - 8,
      );
      setPos({ x, y });
    };

    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      setDragging(false);
      if (!dragRef.current.moved) setOpen((v) => !v);
      dragRef.current.moved = false;
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const panelStyle = (() => {
    if (!pos) return undefined;
    const width = Math.min(384, window.innerWidth - 32);
    const height = Math.min(544, window.innerHeight - 128);
    const left = Math.min(Math.max(pos.x, 8), window.innerWidth - width - 8);
    const spaceAbove = pos.y - 8;
    const top =
      spaceAbove >= height
        ? pos.y - height - 8
        : Math.min(pos.y + MASCOT + 8, window.innerHeight - height - 8);
    return { left, top: Math.max(top, 8) } as React.CSSProperties;
  })();

  return (
    <>
      {/* Floating mascot */}
      <div
        className={cn(
          "fixed z-50 flex items-end gap-3",
          !pos && "bottom-5 left-5",
        )}
        style={pos ? { left: pos.x, top: pos.y } : undefined}
      >
        <button
          type="button"
          aria-label="Chat with Starlight (drag to move)"
          title="Drag me anywhere"
          onPointerDown={startDrag}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={cn(
            "group relative h-16 w-16 shrink-0 touch-none rounded-full outline-none transition-transform duration-300",
            "hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring",
            dragging ? "scale-105 cursor-grabbing" : "cursor-grab",
            !open && !dragging && "starlight-bounce",
          )}
        >
          <span className="absolute inset-0 rounded-full bg-[#ddff35]/25 blur-xl starlight-glow" />
          <img
            src={starlight.url}
            alt="Starlight, the Everyone Can Light AI lighting companion"
            className="relative h-16 w-16 select-none object-contain group-hover:starlight-dance"
            draggable={false}
          />
        </button>

        {hovered && !open && !dragging && (
          <div className="mb-2 max-w-[15rem] animate-in fade-in slide-in-from-left-2 rounded-2xl border border-border bg-popover px-3 py-2 text-sm text-popover-foreground shadow-lg">
            Hello creator, I'm Starlight. Ready to guide you.
          </div>
        )}
      </div>

      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          style={panelStyle}
          className={cn(
            "fixed z-50 flex h-[min(34rem,calc(100vh-8rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl",
            !pos && "bottom-24 left-4",
          )}
        >

          <header className="flex items-center gap-3 border-b border-border px-4 py-3">
            <img src={starlight.url} alt="" className="h-9 w-9 object-contain starlight-eyes" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Starlight</p>
              <p className="truncate text-xs text-muted-foreground">Your AI lighting companion</p>
            </div>
            <button
              type="button"
              aria-label="Clear chat"
              title="Clear chat"
              onClick={() => {
                if (busy) stop();
                setMessages([]);
                setInput("");
                setTimeout(() => focusInput(), 60);
              }}
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Close Starlight"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </header>

          <Conversation className="flex-1">
            <ConversationContent className="gap-5 p-4">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Hey creator ✨ Ask me anything about lighting, gear or getting around Everyone Can Light.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {FAQS.map((faq) => (
                      <button
                        key={faq}
                        type="button"
                        onClick={() => ask(faq)}
                        className="rounded-full border border-border bg-transparent px-3 py-1.5 text-left text-xs text-foreground transition-colors hover:border-[#ddff35] hover:bg-[#ddff35]/15 hover:text-foreground"
                      >
                        {faq}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <Message from={message.role} key={message.id}>
                  <MessageContent
                    className={cn(
                      message.role === "user" &&
                        "!bg-[#ddff35] !text-[#12140a] [&_*]:!text-[#12140a] font-medium",
                    )}
                  >
                    {message.parts.map((part, index) =>
                      part.type === "text" ? (
                        <MessageResponse
                          className={message.role === "assistant" ? "starlight-response" : undefined}
                          key={index}
                        >
                          {part.text}
                        </MessageResponse>
                      ) : null,
                    )}
                  </MessageContent>
                </Message>
              ))}

              {busy &&
                !(
                  status === "streaming" &&
                  messages[messages.length - 1]?.role === "assistant" &&
                  messages[messages.length - 1]?.parts.some(
                    (p) => p.type === "text" && p.text.length > 0,
                  )
                ) && (
                  <ThinkingIndicator
                    label={
                      status === "submitted"
                        ? "Starlight is thinking..."
                        : "Starlight is finding answers..."
                    }
                  />
                )}

              {messages.length > 0 && !busy && (
                <button
                  type="button"
                  onClick={() => {
                    setMessages([]);
                    setInput("");
                    focusInput();
                  }}
                  className="self-start text-xs text-muted-foreground underline decoration-[#ddff35] underline-offset-4 transition-colors hover:text-foreground"
                >
                  Clear chat & ask something new
                </button>
              )}

              {error && (
                <p className="text-sm text-destructive">
                  Starlight couldn't answer that just now. Please try again in a moment.
                </p>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <div className="border-t border-border p-3">
            <PromptInput onSubmit={handleSubmit}>
              <PromptInputTextarea
                value={input}
                onChange={(e) => setInput(e.currentTarget.value)}
                placeholder="Ask Starlight about lighting..."
              />
              <PromptInputFooter className="justify-end">
                <PromptInputSubmit status={status} onStop={stop} disabled={!input.trim() && !busy} />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      )}
    </>
  );
};

export default StarlightWidget;