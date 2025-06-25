import { UserButton, useUser, useAuth } from '@clerk/clerk-react';
import { useState, useEffect } from "react";
import { getGeminiResponse } from "../genai/genai";
import { DotBackgroundDemo } from '../components/ui/dotsbackground';
import { supabase } from '../supabase';
import { Moon, Sun } from "lucide-react"; 
import "../App.css";

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const syncUserWithSupabase = async () => {
    if (!isLoaded || !user) return;

    try {
      const token = await getToken();

      await supabase.auth.setSession({
        access_token: token!,
        refresh_token: "", 
      });

      const { data: existingUser, error: selectError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (selectError && selectError.code !== "PGRST116") {
        return;
      }

      if (!existingUser) {
        const { error: insertError, data: insertData } = await supabase.from("users").insert([
          {
            username: `${user.username}`,
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            full_name: `${user.firstName} ${user.lastName}`,
            created_at: new Date().toISOString(),
          },
        ]);

        if (insertError) {
          console.error("Supabase insert error:", insertError.message);
        } else {
          console.log("Supabase insert success:", insertData);
        }
      } else {
        console.log("ℹUser already exists in Supabase:", existingUser);
      }
    } catch (err) {
      console.error("Unexpected sync error:", err);
    }
  };

  syncUserWithSupabase();
}, [isLoaded, user]);

  const [showChat, setShowChat] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleAskAI = () => {
    setShowChat(!showChat);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userPrompt = input;
  setMessages(prev => [...prev, `You: ${userPrompt}`]);
  setInput("");

  try {
    const reply = await getGeminiResponse(userPrompt);
    setMessages(prev => [...prev, `Gemini: ${reply}`]);
  } catch (err) {
    setMessages(prev => [...prev, "Gemini: (Error getting response)"]);
  }
  };

  return (
    <div className="app">
      <div className="top-right" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      <button
        onClick={() => setDarkMode((prev) => !prev)}
        className="toggle"
        title="Toggle Dark Mode"
      >
        {darkMode ? <Moon size={18} /> : <Sun size={18} />}
      </button>
      <UserButton />
    </div>
      <div className="top-right">
        <UserButton />
      </div>
      <div className='dotsbackground'><DotBackgroundDemo/></div>
      <div className="center-screen">
        <h1>Welcome, {user?.firstName}</h1>
      </div>

      <div className="left-panel">
        <div className="btn">
          <button className="tab">Problem</button>
        </div>
        <div className="btn">
          <button className="tab">Editorial</button>
        </div>
        <div className="btn">
          <button className="tab">Submissions</button>
        </div>
        <div className="btn">
          <button className="tab">Solution</button>
        </div>
        <div className="btn">
          <button className="tab" onClick={handleAskAI}>Ask AI</button>
        </div>
      </div>

      {showChat && (
  <div className="chat-panel">
    <button
      className="close-button"
      onClick={() => setShowChat(false)}
    >
      ✕
    </button>

    <div className="chat-messages">
  {messages.map((msg, idx) => {
    const isUser = msg.startsWith("You:");
    const content = msg.replace(/^You: |^Gemini: /, "");
    return (
      <div key={idx} className={`chat-bubble ${isUser ? 'user' : 'ai'}`}>
        <div className="chat-label">{isUser ? "You" : "Gemini"}</div>
        <div className="chat-text">{content}</div>
      </div>
    );
  })}
</div>


    <div className="user-input">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask something..."
        className="flex-1 p-2 rounded-md bg-gray-700 text-black dark:bg-gray-700 dark:text-white outline-none"
      />
      <button className="send-btn" onClick={handleSend}>
        Send
      </button>
    </div>
  </div>
)}


    </div>
  );
}
