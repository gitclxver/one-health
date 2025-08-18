import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArticleCard from "../../components/ArticleCardAdmin";
import TeamMemberCard from "../../components/TeamMemberCard";
import EventCardAdmin from "../../components/EventCardAdmin";
import LoadingSpinner from "../../components/LoadingSpinner";
import AdminHeader from "../../components/admin/AdminHeader";
import { useArticlesStore } from "../../store/useArticlesStore";
import { useMembersStore } from "../../store/useMembersStore";
import { useEventStore } from "../../store/useEventStore";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    "articles" | "committee" | "events"
  >("articles");
  const navigate = useNavigate();

  const {
    articles,
    loading: articlesLoading,
    error: articlesError,
    fetchAdminArticles,
    deleteArticle,
    saving: articlesSaving,
  } = useArticlesStore();

  const {
    committeeMembers,
    loading: membersLoading,
    error: membersError,
    fetchAndSetMembers,
    deleteMember,
    saving: membersSaving,
  } = useMembersStore();

  const {
    allEvents,
    loading: eventsLoading,
    error: eventsError,
    fetchAllEvents,
    deleteEvent,
    saving: eventsSaving,
  } = useEventStore();

  useEffect(() => {
    if (activeTab === "articles" && articles.length === 0) fetchAdminArticles();
    if (activeTab === "committee" && committeeMembers.length === 0)
      fetchAndSetMembers();
    if (activeTab === "events" && allEvents.length === 0) fetchAllEvents();
  }, [activeTab, articles, committeeMembers, allEvents, fetchAdminArticles, fetchAndSetMembers, fetchAllEvents]);

  const refreshData = () => {
    if (activeTab === "articles") fetchAdminArticles();
    else if (activeTab === "committee") fetchAndSetMembers();
    else fetchAllEvents();
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await deleteArticle(id);
      toast.success("Article deleted");
      fetchAdminArticles();
    } catch {
      toast.error("Failed to delete article");
    }
  };

  const handleDeleteMember = async (id: number) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      await deleteMember(id);
      toast.success("Member deleted");
      fetchAndSetMembers();
    } catch {
      toast.error("Failed to delete member");
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(id);
      toast.success("Event deleted");
      fetchAllEvents();
    } catch {
      toast.error("Failed to delete event");
    }
  };

  const sortedEvents = [...allEvents].sort(
    (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
  );

  return (
    <>
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, #A7CFE1 0%, #6A8B57 100%)",
        }}
      />

      <AdminHeader />

      <main className="min-h-screen w-full max-w-7xl mx-auto px-8 py-12 space-y-8">
        {/* Header Section */}
        <section className="rounded-3xl p-8 text-center bg-white/25 backdrop-blur-md border border-white/20">
          <h1 className="text-4xl font-extrabold text-[#6A8B57]">
            Admin Dashboard
          </h1>
          <p className="mt-4 text-lg text-green-900 font-medium">
            Manage Articles, Committee Members, and Events
          </p>
        </section>

        {/* Tabs Section */}
        <section className="rounded-3xl p-8 bg-white/25 backdrop-blur-md border border-white/20">
          <div className="flex flex-col space-y-6 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="border-b border-gray-200 w-full md:w-auto">
              <nav className="-mb-px flex space-x-8">
                {(["articles", "committee", "events"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab === "articles"
                      ? "Articles"
                      : tab === "committee"
                      ? "Committee Members"
                      : "Events"}
                  </button>
                ))}
              </nav>
            </div>
            <button
              onClick={refreshData}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Refresh Data
            </button>
          </div>
        </section>

        {/* Content Section */}
        <section className="rounded-3xl p-8 bg-white/25 backdrop-blur-md border border-white/20">
          {activeTab === "articles" &&
            (articlesLoading ? (
              <div className="flex justify-center py-16">
                <LoadingSpinner size="lg" />
              </div>
            ) : articlesError ? (
              <div className="text-center py-16 space-y-4">
                <p className="text-xl text-red-600">{articlesError}</p>
                <button
                  onClick={fetchAdminArticles}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Retry
                </button>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-16 space-y-6">
                <p className="text-xl text-gray-700">No articles found.</p>
                <Link
                  to="/admin/articles"
                  className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg font-medium"
                >
                  Create Your First Article
                </Link>
              </div>
            ) : (
              <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onClick={() => navigate("/admin/articles")}
                    onEdit={() => navigate("/admin/articles")}
                    onDelete={() => handleDeleteArticle(article.id)}
                    disabled={articlesSaving}
                  />
                ))}
              </div>
            ))}

          {activeTab === "committee" &&
            (membersLoading ? (
              <div className="flex justify-center py-16">
                <LoadingSpinner size="lg" />
              </div>
            ) : membersError ? (
              <div className="text-center py-16 space-y-4">
                <p className="text-xl text-red-600">{membersError}</p>
                <button
                  onClick={fetchAndSetMembers}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Retry
                </button>
              </div>
            ) : committeeMembers.length === 0 ? (
              <div className="text-center py-16 space-y-6">
                <p className="text-xl text-gray-700">
                  No committee members found.
                </p>
                <Link
                  to="/admin/committee"
                  className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg font-medium"
                >
                  Add First Committee Member
                </Link>
              </div>
            ) : (
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {[...committeeMembers]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((member) => (
                    <TeamMemberCard
                      key={member.id}
                      member={member}
                      showDescription={true}
                      onClick={() => navigate("/admin/committee")}
                      onEdit={() => navigate("/admin/committee")}
                      onDelete={() => handleDeleteMember(member.id)}
                      showActions
                      disabled={membersSaving}
                    />
                  ))}
              </div>
            ))}

          {activeTab === "events" &&
            (eventsLoading ? (
              <div className="flex justify-center py-16">
                <LoadingSpinner size="lg" />
              </div>
            ) : eventsError ? (
              <div className="text-center py-16 space-y-4">
                <p className="text-xl text-red-600">{eventsError}</p>
                <button
                  onClick={fetchAllEvents}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Retry
                </button>
              </div>
            ) : sortedEvents.length === 0 ? (
              <div className="text-center py-16 space-y-6">
                <p className="text-xl text-gray-700">No events found.</p>
                <Link
                  to="/admin/events"
                  className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg font-medium"
                >
                  Add First Event
                </Link>
              </div>
            ) : (
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {sortedEvents.map((event) => (
                  <EventCardAdmin
                    key={event.id}
                    event={event}
                    onClick={() => navigate("/admin/events")}
                    onEdit={() => navigate("/admin/events")}
                    onDelete={() => handleDeleteEvent(event.id)}
                    disabled={eventsSaving}
                  />
                ))}
              </div>
            ))}
        </section>
      </main>
    </>
  );
}
