import SearchBar from "../components/SearchBar";
import ArticleCard from "../components/ArticleCard";
//import NewsletterSignup from "../components/NewsletterSignup";

const Articles = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Articles</h1>
    <SearchBar />
    <ArticleCard />
    {/* <NewsletterSignup /> */}
  </div>
);

export default Articles;
