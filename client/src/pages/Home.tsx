//import NewsletterSignup from "../components/NewsletterSignup";
import ArticleCard from "../components/ArticleCard";

const Home = () => (
  <div>
    <h1 className="text-3xl font-bold mb-4">Welcome to One Health Society</h1>
    <p className="mb-6">Harmonizing human, animal, and environmental health.</p>
    <h2 className="text-2xl font-semibold mb-2">Recent Articles</h2>
    <ArticleCard />
    {/* <NewsletterSignup /> */}
  </div>
);

export default Home;
