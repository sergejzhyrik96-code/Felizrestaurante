import { feedPosts } from "@/data/mock";
import FeedCard from "@/components/FeedCard";
import TrendingBar from "@/components/TrendingBar";
import { Radar } from "lucide-react";

const FeedPage = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Radar size={24} className="text-primary" />
          <h1 className="font-display text-xl font-bold text-foreground">
            Gastro<span className="text-gradient">Radar</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            Valencia
          </span>
        </div>
      </header>

      <TrendingBar />

      {/* Feed */}
      <div className="divide-y divide-border">
        {feedPosts.map((post, i) => (
          <FeedCard key={post.id} post={post} index={i} />
        ))}
      </div>
    </div>
  );
};

export default FeedPage;
