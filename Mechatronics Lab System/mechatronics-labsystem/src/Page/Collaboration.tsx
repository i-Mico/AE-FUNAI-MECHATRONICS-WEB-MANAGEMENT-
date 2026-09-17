import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Sidebar } from "../Components/Dashboardc/Sidebar";
import {
  FiMessageCircle,
  FiHeart,
  FiEye,
  FiSend,
  FiPaperclip,
  FiX,
  FiSearch,
  FiPlus,
} from "react-icons/fi";
import "../Styles/Pagecss/Collaboration.css";

interface Attachment {
  name: string;
  size: string;
}

interface Post {
  id: number;
  author: string;
  role: "Student" | "Staff";
  timeAgo: string;
  title: string;
  content: string;
  level?: string;
  tags: string[];
  likes: number;
  replies: number;
  views: number;
  attachments?: Attachment[];
}

const initialPosts: Post[] = [
  {
    id: 1,
    author: "Alice Tan",
    role: "Student",
    timeAgo: "2 hours ago",
    title: "How to properly calibrate the CNC machine?",
    content:
      "Hi everyone, I have been trying to use the CNC machine in Lab A for my 400-level project but I keep getting offset errors. Has anyone successfully calibrated it recently? Any tips would be really helpful!",
    level: "400 Level",
    tags: ["CNC", "Lab A"],
    likes: 45,
    replies: 12,
    views: 234,
  },
  {
    id: 2,
    author: "Prof. Darko",
    role: "Staff",
    timeAgo: "5 hours ago",
    title: "MCT 301 Lab Session - Control Systems Simulation Files",
    content:
      "Dear 300-level students, please find attached the MATLAB simulation files for this week's control systems lab. Make sure you have MATLAB R2024a installed before the session on Thursday.",
    level: "300 Level",
    tags: ["MCT 301", "MATLAB"],
    likes: 120,
    replies: 8,
    views: 588,
    attachments: [
      { name: "control_systems_lab3.m", size: "156 KB" },
      { name: "lab3_instructions.pdf", size: "890 KB" },
    ],
  },
  {
    id: 3,
    author: "David Ng",
    role: "Student",
    timeAgo: "1 day ago",
    title: "Sharing my 500-level capstone project - Autonomous Sorting Robot",
    content:
      "Just finished my capstone project! Built an autonomous sorting robot using computer vision and a conveyor belt. It can sort objects by color and size with 94% accuracy. Sharing my code and report for anyone interested.",
    level: "500 Level",
    tags: ["Capstone", "Robotics", "Computer Vision"],
    likes: 158,
    replies: 24,
    views: 892,
    attachments: [
      { name: "sorting_robot_code.zip", size: "4.1 MB" },
      { name: "capstone_report_final.pdf", size: "3.8 MB" },
    ],
  },
  {
    id: 4,
    author: "Mr. Asante",
    role: "Staff",
    timeAgo: "2 days ago",
    title: "Lab Safety Reminder - Proper PPE Usage",
    content:
      "Reminder to all students: Safety goggles and gloves are MANDATORY when operating the laser cutter, CNC machine, and soldering stations. We had a near-miss incident yesterday. Please review the attached safety guidelines.",
    level: "All Levels",
    tags: ["Safety", "Important"],
    likes: 189,
    replies: 6,
    views: 445,
    attachments: [{ name: "lab_safety_guidelines_2026.pdf", size: "1.2 MB" }],
  },
];

const attachmentSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function Collaboration() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPostText, setNewPostText] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newAttachments, setNewAttachments] = useState<Attachment[]>([]);
  const [replyingTo, setReplyingTo] = useState<Post | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatText, setChatText] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>([
    "Welcome to the Lab Chat Room.",
    "Please keep discussions related to lab work, projects, and course activities.",
  ]);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | "Staff" | "Student">(
    "All",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = useMemo(
    () => ({
      posts: posts.length,
      replies: posts.reduce((sum, post) => sum + post.replies, 0),
      likes: posts.reduce((sum, post) => sum + post.likes, 0),
      views: posts.reduce((sum, post) => sum + post.views, 0),
    }),
    [posts],
  );

  const filteredPosts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesRole = roleFilter === "All" || post.role === roleFilter;
      if (!term) return matchesRole;
      const haystack = [post.title, post.content, post.author, ...post.tags]
        .join(" ")
        .toLowerCase();
      return matchesRole && haystack.includes(term);
    });
  }, [posts, roleFilter, searchTerm]);

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setNewAttachments((prev) => [
      ...prev,
      ...files.map((file) => ({
        name: file.name,
        size: attachmentSize(file.size),
      })),
    ]);
    event.target.value = "";
  };

  const handleSubmitPost = (event: FormEvent) => {
    event.preventDefault();
    const title = newPostTitle.trim();
    const content = newPostText.trim();
    if (!title || !content) return;

    const newPost: Post = {
      id: Date.now(),
      author: "You",
      role: "Student",
      timeAgo: "just now",
      title,
      content,
      level: "Your Level",
      tags: ["New"],
      likes: 0,
      replies: 0,
      views: 0,
      attachments: newAttachments.length ? newAttachments : undefined,
    };

    setPosts((prev) => [newPost, ...prev]);
    setNewPostTitle("");
    setNewPostText("");
    setNewAttachments([]);
    setIsComposerOpen(false);
  };

  const toggleLike = (postId: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post,
      ),
    );
  };

  const submitReply = (event: FormEvent) => {
    event.preventDefault();
    if (!replyingTo || !replyText.trim()) return;
    setPosts((prev) =>
      prev.map((post) =>
        post.id === replyingTo.id
          ? { ...post, replies: post.replies + 1 }
          : post,
      ),
    );
    setReplyingTo(null);
    setReplyText("");
  };

  const sendChatMessage = (event: FormEvent) => {
    event.preventDefault();
    const message = chatText.trim();
    if (!message) return;
    setChatMessages((prev) => [...prev, message]);
    setChatText("");
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-content collaboration-page">
        <div className="collab-header collab-header-row">
          <div>
            <h1>Collaboration</h1>
            <p>
              Ask questions, share resources, and collaborate with peers and
              faculty
            </p>
          </div>
          <div className="collab-header-actions">
            <button
              type="button"
              className="secondary-action"
              onClick={() => setIsChatOpen(true)}
            >
              <FiMessageCircle /> Chat Room <span className="live-dot" />
            </button>
            <button
              type="button"
              className="primary-action"
              onClick={() => setIsComposerOpen(true)}
            >
              <FiPlus /> New Post
            </button>
          </div>
        </div>

        <div className="collab-toolbar">
          <label className="collab-search">
            <FiSearch aria-hidden="true" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search discussions..."
            />
          </label>
          <div className="role-filters" aria-label="Filter discussions by role">
            {(["All", "Staff", "Student"] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                className={roleFilter === filter ? "active" : ""}
                onClick={() => setRoleFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="collaboration-layout">
          <section className="posts-column">
            {filteredPosts.length === 0 ? (
              <div className="collab-empty">
                No discussions match your current search or filter.
              </div>
            ) : (
              filteredPosts.map((post) => (
                <article key={post.id} className="post-card">
                  <div className="post-header">
                    <div className="author-info">
                      <div className="author-avatar">
                        {post.author.charAt(0)}
                      </div>
                      <div>
                        <div className="author-name">
                          {post.author}
                          <span
                            className={`role-badge ${post.role.toLowerCase()}`}
                          >
                            {post.role}
                          </span>
                        </div>
                        <div className="post-meta">
                          {post.timeAgo} • {post.level}
                        </div>
                      </div>
                    </div>
                    <span className="views">
                      <FiEye /> {post.views}
                    </span>
                  </div>

                  <h4 className="post-title">{post.title}</h4>
                  <p className="post-content">{post.content}</p>

                  {post.attachments && post.attachments.length > 0 && (
                    <div className="attachments">
                      {post.attachments.map((file) => (
                        <div
                          key={`${post.id}-${file.name}`}
                          className="attachment"
                        >
                          📎 {file.name} <span>{file.size}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="post-tags">
                    {post.tags.map((tag) => (
                      <span key={`${post.id}-${tag}`} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="post-engagement">
                    <button
                      className="like-btn"
                      onClick={() => toggleLike(post.id)}
                    >
                      <FiHeart /> {post.likes} Likes
                    </button>
                    <button
                      className="reply-btn"
                      onClick={() => setReplyingTo(post)}
                    >
                      <FiMessageCircle /> {post.replies} Replies
                    </button>
                    <button
                      className="post-reply-link"
                      type="button"
                      onClick={() => setReplyingTo(post)}
                    >
                      Reply
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>

          <aside className="collab-rail">
            <div className="chat-side-card">
              <div className="chat-side-icon">
                <FiMessageCircle />
              </div>
              <div>
                <h3>
                  Lab Chat Room <span className="live-dot" />
                </h3>
                <p>Click to open the real-time chat room.</p>
                <button type="button" onClick={() => setIsChatOpen(true)}>
                  Open Chat Room →
                </button>
              </div>
            </div>

            <div className="board-stats board-stats-card">
              <h3>Board Stats</h3>
              <div className="stat-row">
                <span>
                  <FiMessageCircle /> Total Posts
                </span>
                <strong>{stats.posts}</strong>
              </div>
              <div className="stat-row">
                <span>
                  <FiMessageCircle /> Total Replies
                </span>
                <strong>{stats.replies}</strong>
              </div>
              <div className="stat-row">
                <span>
                  <FiHeart /> Total Likes
                </span>
                <strong>{stats.likes}</strong>
              </div>
              <div className="stat-row">
                <span>
                  <FiEye /> Total Views
                </span>
                <strong>{stats.views}</strong>
              </div>
            </div>
          </aside>
        </div>

        {isComposerOpen && (
          <div
            className="collab-modal-overlay"
            role="presentation"
            onMouseDown={() => setIsComposerOpen(false)}
          >
            <div
              className="collab-modal"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="modal-close"
                onClick={() => setIsComposerOpen(false)}
                aria-label="Close new post"
              >
                <FiX />
              </button>
              <h3>New Discussion</h3>
              <p className="modal-reference">
                Start a focused discussion without taking space from the
                discussion board.
              </p>
              <form onSubmit={handleSubmitPost}>
                <input
                  type="text"
                  placeholder="Post title..."
                  value={newPostTitle}
                  onChange={(event) => setNewPostTitle(event.target.value)}
                  required
                  autoFocus
                />
                <textarea
                  placeholder="Write your message here..."
                  value={newPostText}
                  onChange={(event) => setNewPostText(event.target.value)}
                  rows={5}
                  required
                />
                {newAttachments.length > 0 && (
                  <div className="selected-attachments">
                    {newAttachments.map((file) => (
                      <span key={`${file.name}-${file.size}`}>
                        {file.name} ({file.size})
                      </span>
                    ))}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden-file-input"
                  onChange={handleFiles}
                />
                <div className="modal-actions">
                  <button
                    type="button"
                    className="attach-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FiPaperclip /> Attach File
                  </button>
                  <button type="submit" className="submit-btn">
                    <FiSend /> Post Discussion
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {replyingTo && (
          <div
            className="collab-modal-overlay"
            role="presentation"
            onMouseDown={() => setReplyingTo(null)}
          >
            <div
              className="collab-modal reply-modal"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="modal-close"
                onClick={() => setReplyingTo(null)}
                aria-label="Close reply"
              >
                <FiX />
              </button>
              <h3>Reply to discussion</h3>
              <p className="modal-reference">{replyingTo.title}</p>
              <form onSubmit={submitReply}>
                <textarea
                  value={replyText}
                  onChange={(event) => setReplyText(event.target.value)}
                  placeholder="Write your reply..."
                  rows={4}
                  autoFocus
                  required
                />
                <div className="modal-actions">
                  <button type="submit" className="submit-btn">
                    <FiSend /> Send Reply
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isChatOpen && (
          <div
            className="collab-modal-overlay"
            role="presentation"
            onMouseDown={() => setIsChatOpen(false)}
          >
            <div
              className="chat-modal"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="modal-close"
                onClick={() => setIsChatOpen(false)}
                aria-label="Close chat"
              >
                <FiX />
              </button>
              <div className="chat-modal-header">
                <h3>Lab Chat Room</h3>
                <p>Messages are stored on your device for this demo.</p>
              </div>
              <div className="chat-messages">
                {chatMessages.map((message, index) => (
                  <div key={`${message}-${index}`} className="chat-message">
                    {message}
                  </div>
                ))}
              </div>
              <form className="chat-form" onSubmit={sendChatMessage}>
                <input
                  value={chatText}
                  onChange={(event) => setChatText(event.target.value)}
                  placeholder="Type a message..."
                  aria-label="Chat message"
                />
                <button type="submit" className="submit-btn">
                  <FiSend />
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
