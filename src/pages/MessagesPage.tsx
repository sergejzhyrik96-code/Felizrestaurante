import { chatMessages } from "@/data/mock";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const MessagesPage = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 px-4 py-4 backdrop-blur-xl">
        <h1 className="font-display text-2xl font-bold text-foreground">Messages</h1>
      </header>

      <div className="divide-y divide-border">
        {chatMessages.map((chat, i) => (
          <motion.button
            key={chat.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-secondary/50"
          >
            <div className="relative">
              <img
                src={chat.venueImage}
                alt={chat.venueName}
                className="h-12 w-12 rounded-full object-cover"
              />
              {chat.unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {chat.unread}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">{chat.venueName}</h3>
                <span className="text-[10px] text-muted-foreground">{chat.timeAgo}</span>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {chat.lastMessage}
              </p>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default MessagesPage;
