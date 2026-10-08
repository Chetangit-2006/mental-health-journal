"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Journal = {
  _id: string;
  title: string;
  content: string;
  mood: string;
  createdAt: string;
};

export default function Dashboard() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("Neutral");

  const [chatMessage, setChatMessage] = useState("");
const [chatReply, setChatReply] = useState("");
const [chatLoading, setChatLoading] = useState(false);
const [chatHistory, setChatHistory] = useState<
  {
    _id: string;
    message: string;
    reply: string;
    createdAt: string;
  }[]
>([]);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // =========================
  // GET JOURNALS
  // =========================

  const getJournals = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/journal",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setJournals(data);
      } else {
        setMessage(data.message || "Failed to load journals");
      }
    } catch {
      setMessage("Unable to connect to backend");
    }
  };

  useEffect(() => {
    getJournals();
    fetchChatHistory();
  }, []);

  // =========================
  // CREATE JOURNAL
  // =========================

  const createJournal = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    if (!title.trim() || !content.trim()) {
      setMessage("Please enter title and content.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/journal",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            content,
            mood,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Journal saved successfully.");
        setTitle("");
        setContent("");
        setMood("Neutral");
        getJournals();
      } else {
        setMessage(data.message || "Failed to save journal");
      }
    } catch {
      setMessage("Unable to connect to backend");
    }
  };

  // =========================
  // EDIT JOURNAL
  // =========================

  const startEdit = (journal: Journal) => {
    setEditingId(journal._id);
    setTitle(journal.title);
    setContent(journal.content);
    setMood(journal.mood);
    setMessage("");
  };

  // =========================
  // UPDATE JOURNAL
  // =========================

  const updateJournal = async () => {
    const token = localStorage.getItem("token");

    if (!token || !editingId) {
      setMessage("Unable to edit journal.");
      return;
    }

    if (!title.trim() || !content.trim()) {
      setMessage("Please enter title and content.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/journal/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            content,
            mood,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Journal updated successfully.");
        setEditingId(null);
        setTitle("");
        setContent("");
        setMood("Neutral");
        getJournals();
      } else {
        setMessage(data.message || "Failed to update journal");
      }
    } catch {
      setMessage("Unable to connect to backend");
    }
  };

  // =========================
  // CANCEL EDIT
  // =========================

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setMood("Neutral");
    setMessage("");
  };

  // =========================
  // DELETE JOURNAL
  // =========================

  const deleteJournal = async (id: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this journal?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/journal/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Journal deleted successfully.");
        getJournals();
      } else {
        setMessage(data.message || "Failed to delete journal");
      }
    } catch {
      setMessage("Unable to connect to backend");
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };
  const fetchChatHistory = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/ai/history",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      setChatHistory(data);
    }
  } catch (error) {
    console.error("Failed to load chat history");
  }
};
  const sendChatMessage = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/");
    return;
  }

  if (!chatMessage.trim()) return;

  setChatLoading(true);
  setChatReply("");

  try {
    const response = await fetch(
      "http://localhost:5000/api/ai/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: chatMessage.trim(),
        }),
      }
    );

    const data = await response.json();

    console.log("AI Response:", data);

    if (!response.ok) {
      setChatReply(data.message || "Unable to get a response.");
      return;
    }

    setChatReply(data.reply || "No response received.");
    setChatMessage("");

    await fetchChatHistory();

  } catch (error) {
    console.error("Frontend AI Error:", error);
    setChatReply("Unable to connect to the AI service.");
  } finally {
    setChatLoading(false);
  }
};

  // =========================
  // MOOD COUNTS
  // =========================

  const moodCounts = {
    Happy: journals.filter((j) => j.mood === "Happy").length,
    Sad: journals.filter((j) => j.mood === "Sad").length,
    Angry: journals.filter((j) => j.mood === "Angry").length,
    Anxious: journals.filter((j) => j.mood === "Anxious").length,
    Neutral: journals.filter((j) => j.mood === "Neutral").length,
    Excited: journals.filter((j) => j.mood === "Excited").length,
  };

  // =========================
  // MOST FREQUENT MOOD
  // =========================

  const mostFrequentMood =
    journals.length === 0
      ? "No data"
      : Object.entries(moodCounts).sort(
          (a, b) => b[1] - a[1]
        )[0][0];

  // =========================
  // CHART DATA
  // =========================

  const moodChartData = Object.entries(moodCounts).map(
    ([mood, count]) => ({
      mood,
      count,
    })
  );

  // =========================
  // UI
  // =========================

  return (
    <main className="min-h-screen bg-[#F4F1EA] text-[#26332D]">

      {/* NAVIGATION */}

      <nav className="border-b border-[#D9DED7] bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#26332D]">
              MindJournal
            </h1>

            <p className="text-xs text-[#718078] mt-0.5">
              Personal wellness journal
            </p>
          </div>

          <button
            onClick={logout}
            className="border border-[#B8C4BA] text-[#40564A] px-5 py-2 rounded-lg font-semibold hover:bg-[#E8EEE9] transition"
          >
            Logout
          </button>

        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* WELCOME */}

        <section className="mb-10">

          <p className="text-sm font-semibold text-[#708577] uppercase tracking-wider">
            Personal Dashboard
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-[#26332D] mt-2">
            Welcome back
          </h2>

          <p className="text-[#66736C] mt-3 max-w-2xl text-lg">
            Take a moment to reflect, record your thoughts, and understand
            your emotional patterns over time.
          </p>

        </section>

        {/* STATISTICS */}

        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">

          <div className="bg-white border border-[#DDE3DC] rounded-2xl p-6 shadow-sm">

            <p className="text-sm font-semibold text-[#718078]">
              Total Entries
            </p>

            <p className="text-4xl font-bold text-[#30483C] mt-3">
              {journals.length}
            </p>

            <p className="text-sm text-[#849088] mt-2">
              Journal entries recorded
            </p>

          </div>

          <div className="bg-white border border-[#DDE3DC] rounded-2xl p-6 shadow-sm">

            <p className="text-sm font-semibold text-[#718078]">
              Most Frequent Mood
            </p>

            <p className="text-3xl font-bold text-[#30483C] mt-3">
              {mostFrequentMood}
            </p>

            <p className="text-sm text-[#849088] mt-2">
              Based on your journal history
            </p>

          </div>

          <div className="bg-[#30483C] rounded-2xl p-6 shadow-sm text-white">

            <p className="text-sm font-semibold text-[#D6E0D8]">
              Current Journal Activity
            </p>

            <p className="text-4xl font-bold mt-3">
              {journals.length > 0 ? "Active" : "Start"}
            </p>

            <p className="text-sm text-[#C2CEC5] mt-2">
              {journals.length > 0
                ? "Keep reflecting consistently"
                : "Write your first journal entry"}
            </p>

          </div>

        </section>

        {/* MOOD ANALYTICS */}

        <section className="bg-white border border-[#DDE3DC] rounded-2xl shadow-sm p-7 mb-10">

          <div className="mb-7">

            <p className="text-sm font-semibold text-[#708577] uppercase tracking-wide">
              Emotional Analytics
            </p>

            <h3 className="text-2xl font-bold text-[#26332D] mt-1">
              Mood Overview
            </h3>

            <p className="text-sm text-[#7A867F] mt-1">
              Visual summary of your recorded moods
            </p>

          </div>

          {/* CHART */}

          <div className="w-full h-[320px] mb-8">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart
                data={moodChartData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 10,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E1E6E1"
                />

                <XAxis
                  dataKey="mood"
                  tick={{
                    fill: "#526158",
                    fontSize: 13,
                  }}
                  axisLine={{
                    stroke: "#CBD4CC",
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: "#526158",
                    fontSize: 13,
                  }}
                  axisLine={{
                    stroke: "#CBD4CC",
                  }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FAF9F6",
                    border: "1px solid #D9DED7",
                    borderRadius: "10px",
                    color: "#26332D",
                  }}
                />

                <Bar
                  dataKey="count"
                  fill="#708C78"
                  radius={[6, 6, 0, 0]}
                  barSize={42}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

          {/* MOOD CARDS */}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

            {Object.entries(moodCounts).map(
              ([name, count]) => (

                <div
                  key={name}
                  className="bg-[#F5F7F3] border border-[#E0E5DF] rounded-xl p-4"
                >

                  <p className="text-sm font-semibold text-[#66736C]">
                    {name}
                  </p>

                  <p className="text-2xl font-bold text-[#30483C] mt-2">
                    {count}
                  </p>

                  <div className="h-1.5 bg-[#DDE4DD] rounded-full mt-3 overflow-hidden">

                    <div
                      className="h-full bg-[#708C78] rounded-full"
                      style={{
                        width:
                          journals.length > 0
                            ? `${(count / journals.length) * 100}%`
                            : "0%",
                      }}
                    />

                  </div>

                </div>

              )
            )}

          </div>

        </section>

        {/* JOURNAL AREA */}

        <div className="grid lg:grid-cols-5 gap-7">

          {/* NEW JOURNAL */}

          <section className="lg:col-span-2 bg-white border border-[#DDE3DC] rounded-2xl shadow-sm p-7">

            <div className="mb-6">

              <p className="text-sm font-semibold text-[#708577] uppercase tracking-wide">
                {editingId ? "Edit Entry" : "New Entry"}
              </p>

              <h3 className="text-2xl font-bold text-[#26332D] mt-1">
                {editingId
                  ? "Update your reflection"
                  : "Write about your day"}
              </h3>

            </div>

            <label className="block text-sm font-semibold text-[#3D4B44] mb-2">
              Title
            </label>

            <input
              className="w-full border border-[#CBD4CC] bg-[#FAFBF9] text-[#26332D] p-3.5 rounded-xl mb-5 outline-none focus:border-[#708C78] focus:ring-2 focus:ring-[#DCE6DE]"
              placeholder="Give your entry a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label className="block text-sm font-semibold text-[#3D4B44] mb-2">
              Your thoughts
            </label>

            <textarea
              className="w-full border border-[#CBD4CC] bg-[#FAFBF9] text-[#26332D] p-3.5 rounded-xl mb-5 h-40 resize-none outline-none focus:border-[#708C78] focus:ring-2 focus:ring-[#DCE6DE]"
              placeholder="Write freely about your thoughts and feelings..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <label className="block text-sm font-semibold text-[#3D4B44] mb-2">
              Mood
            </label>

            <select
              className="w-full border border-[#CBD4CC] bg-[#FAFBF9] text-[#26332D] p-3.5 rounded-xl mb-6 outline-none focus:border-[#708C78] focus:ring-2 focus:ring-[#DCE6DE]"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
            >

              <option>Happy</option>
              <option>Sad</option>
              <option>Angry</option>
              <option>Anxious</option>
              <option>Neutral</option>
              <option>Excited</option>

            </select>

            {!editingId ? (

              <button
                onClick={createJournal}
                className="w-full bg-[#30483C] text-white font-semibold py-3.5 rounded-xl hover:bg-[#263A31] transition"
              >
                Save Journal
              </button>

            ) : (

              <div className="flex gap-3">

                <button
                  onClick={updateJournal}
                  className="flex-1 bg-[#30483C] text-white font-semibold py-3.5 rounded-xl hover:bg-[#263A31] transition"
                >
                  Update
                </button>

                <button
                  onClick={cancelEdit}
                  className="flex-1 bg-[#E5E9E4] text-[#30483C] font-semibold py-3.5 rounded-xl hover:bg-[#D9E0D9] transition"
                >
                  Cancel
                </button>

              </div>

            )}

            {message && (

              <p className="text-center text-sm font-semibold text-[#53665A] mt-5">
                {message}
              </p>

            )}

          </section>

          {/* JOURNAL HISTORY */}

          <section className="lg:col-span-3 bg-white border border-[#DDE3DC] rounded-2xl shadow-sm p-7">

            <div className="mb-6">

              <p className="text-sm font-semibold text-[#708577] uppercase tracking-wide">
                Journal History
              </p>

              <h3 className="text-2xl font-bold text-[#26332D] mt-1">
                Recent Entries
              </h3>

            </div>

            {journals.length === 0 ? (

              <div className="border border-dashed border-[#C8D1C9] rounded-xl p-10 text-center">

                <p className="font-semibold text-[#526158]">
                  No journal entries yet.
                </p>

                <p className="text-sm text-[#849088] mt-2">
                  Your reflections will appear here.
                </p>

              </div>

            ) : (

              <div className="space-y-4">

                {journals.map((journal) => (

                  <article
                    key={journal._id}
                    className="border border-[#DEE4DE] rounded-xl p-5 hover:border-[#B8C7BA] hover:shadow-sm transition"
                  >

                    <div className="flex justify-between items-start gap-4">

                      <div>

                        <h4 className="text-lg font-bold text-[#26332D]">
                          {journal.title}
                        </h4>

                        <p className="text-xs text-[#87928B] mt-1">
                          {new Date(
                            journal.createdAt
                          ).toLocaleString()}
                        </p>

                      </div>

                      <span className="px-3 py-1 rounded-full bg-[#E7EEE8] text-[#49604F] text-xs font-bold">
                        {journal.mood}
                      </span>

                    </div>

                    <p className="text-[#5F6B64] mt-4 leading-relaxed">
                      {journal.content}
                    </p>

                    <div className="flex gap-3 mt-5">

                      <button
                        onClick={() => startEdit(journal)}
                        className="px-4 py-2 rounded-lg bg-[#30483C] text-white text-sm font-semibold hover:bg-[#263A31] transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteJournal(journal._id)
                        }
                        className="px-4 py-2 rounded-lg bg-[#EDF0EC] text-[#526158] text-sm font-semibold hover:bg-[#E1E6E0] transition"
                      >
                        Delete
                      </button>

                    </div>

                  </article>

                ))}

              </div>

            )}

          </section>
                      {/* AI CHATBOT */}

          <section className="col-span-full w-full mt-8 bg-white border border-[#DDE3DC] rounded-2xl shadow-sm p-7">

            <div className="mb-6">

              <p className="text-sm font-semibold text-[#708577] uppercase tracking-wide">
                AI Wellness Assistant
              </p>

              <h2 className="text-2xl font-bold text-[#26332D] mt-1">
                Talk about what is on your mind
              </h2>

              <p className="text-sm text-[#7A867F] mt-2">
                A supportive space for reflection and general wellness guidance.
              </p>

            </div>

            {/* CHAT HISTORY */}

<div className="w-full min-h-[180px] max-h-[450px] overflow-y-auto bg-[#F5F7F3] border border-[#E0E5DF] rounded-xl p-5 mb-5 space-y-5">

  {chatHistory.length === 0 ? (
    <p className="text-[#849088] text-center py-10">
      Start a conversation by sharing how you are feeling.
    </p>
  ) : (
    chatHistory.map((chat) => (
      <div key={chat._id} className="space-y-3">

        {/* USER MESSAGE */}

        <div className="flex justify-end">

          <div className="max-w-[80%] bg-[#30483C] text-white rounded-2xl rounded-br-md px-4 py-3">

            <p className="text-xs font-semibold opacity-70 mb-1">
              You
            </p>

            <p className="leading-relaxed">
              {chat.message}
            </p>

          </div>

        </div>


        {/* AI RESPONSE */}

        <div className="flex justify-start">

          <div className="max-w-[80%] bg-white border border-[#DDE3DC] text-[#526158] rounded-2xl rounded-bl-md px-4 py-3">

            <p className="text-xs font-bold text-[#708577] mb-1">
              AI Assistant
            </p>

            <p className="leading-relaxed whitespace-pre-line">
              {chat.reply}
            </p>

          </div>

        </div>

      </div>
    ))
  )}

</div>

            {/* Message Input */}

            <textarea
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Write what you are feeling..."
              className="w-full min-h-[130px] resize-none border border-[#CBD4CC] bg-[#FAFBF9] text-[#26332D] p-4 rounded-xl outline-none focus:border-[#708C78] focus:ring-2 focus:ring-[#DCE6DE]"
            />

            <button
              onClick={sendChatMessage}
              disabled={chatLoading}
              className="w-full mt-4 bg-[#30483C] text-white font-semibold py-3.5 rounded-xl hover:bg-[#263A31] transition disabled:opacity-60"
            >
              {chatLoading ? "Thinking..." : "Send Message"}
            </button>

            <p className="text-xs text-[#87928B] mt-4 text-center">
              AI responses provide general wellness support and are not a diagnosis or a substitute for professional care.
            </p>

          </section>
        </div>

      </div>

    </main>
  );
}