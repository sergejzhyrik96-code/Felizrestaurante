import { Heart, MessageCircle, Bookmark, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import type { FeedPost } from "@/data/mock";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface FeedCardProps {
  post: FeedPost;
  index: number;
}

const FeedCard = ({ post, index }: FeedCardProps) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="overflow-hidden border-b border-border bg-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => navigate(`/venue/${post.venueId}`)}
          className="flex items-center gap-2.5"
        >
          <img
            src={post.venueLogo}
            alt={post.venueName}
            className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/30"
          />
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">{post.venueName}</p>
            <p className="text-xs text-muted-foreground">{post.timeAgo} ago</p>
          </div>
        </button>
        {post.trending && (
          <span className="flex items-center gap-1 rounded-full bg-trending/15 px-2.5 py-1 text-xs font-semibold text-trending">
            <TrendingUp size={12} />
            Trending
          </span>
        )}
      </div>

      {/* Image */}
      <button
        onClick={() => navigate(`/venue/${post.venueId}`)}
        className="relative w-full"
      >
        <img
          src={post.image}
          alt={post.dishName}
          className="aspect-square w-full object-cover"
        />
        {/* Price tag */}
        <div className="absolute bottom-3 right-3 rounded-lg bg-card/90 px-3 py-1.5 backdrop-blur-md">
          <span className="text-sm font-bold text-primary">€{post.price.toFixed(2)}</span>
        </div>
      </button>

      {/* Actions */}
      <div className="px-4 py-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setLiked(!liked)} className="flex items-center gap-1.5">
              <Heart
                size={22}
                className={liked ? "fill-trending text-trending" : "text-foreground"}
              />
              <span className="text-sm font-medium text-foreground">
                {liked ? post.likes + 1 : post.likes}
              </span>
            </button>
            <button className="flex items-center gap-1.5">
              <MessageCircle size={22} className="text-foreground" />
            </button>
          </div>
          <Bookmark size={22} className="text-foreground" />
        </div>
        <h3 className="text-base font-bold text-foreground">{post.dishName}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {post.caption}
        </p>
        <div className="mt-2 flex items-center gap-1">
          {"★".repeat(Math.floor(post.rating))}
          <span className="ml-1 text-xs text-muted-foreground">{post.rating}</span>
        </div>
      </div>
    </motion.article>
  );
};

export default FeedCard;
