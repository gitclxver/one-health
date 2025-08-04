export interface Article {
  id: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  summary: string;
  fullContent: string;
  tags: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  description: string;
  imageUrl: string;
  hierarchyOrder: number;
}

export const mockArticles: Article[] = [
  {
    id: "1",
    title: "The Interconnectedness of Human, Animal, and Environmental Health",
    author: "Dr. Jane Smith",
    date: "July 15, 2024",
    imageUrl: "https://placehold.co/800x600/60a5fa/ffffff?text=One+Health",
    summary:
      "Explore the fundamental principles of the One Health approach and its growing importance in a changing world. We dive into how diseases, environmental changes, and human activities are inextricably linked.",
    fullContent: `<p>The concept of One Health recognizes that the health of humans, animals, and ecosystems are all interconnected. This holistic approach is becoming increasingly vital as global challenges like climate change, rapid urbanization, and biodiversity loss create new avenues for diseases to emerge and spread.</p>
    <p>By breaking down traditional disciplinary silos, One Health encourages collaboration among veterinarians, physicians, environmental scientists, and public health professionals. This teamwork allows us to develop more effective and sustainable solutions to complex health issues, from controlling pandemics to ensuring food safety.</p>
    <p>Our commitment to this approach is more than just a philosophy; it's a practical strategy for a healthier future for all.</p>`,
    tags: ["Popular", "Research", "Environment"],
  },
  {
    id: "2",
    title: "Combatting Zoonotic Diseases with a Collaborative Approach",
    author: "Dr. Robert Johnson",
    date: "June 20, 2024",
    imageUrl:
      "https://placehold.co/800x600/34d399/ffffff?text=Zoonotic+Diseases",
    summary:
      "Zoonotic diseases, which transmit from animals to humans, are a major public health threat. This article examines successful strategies for prevention and control through the lens of One Health.",
    fullContent: `<p>Zoonotic diseases, such as avian influenza and rabies, pose significant threats to global health and economic stability. By studying the interfaces between wildlife, livestock, and human populations, One Health practitioners can identify potential disease hotspots and implement preventative measures before an outbreak occurs.</p>
    <p>Effective surveillance programs, improved sanitation practices, and community education are key components of this strategy. Through cross-sectoral communication and resource sharing, we can build more resilient health systems capable of responding to emerging threats.</p>`,
    tags: ["Disease", "Veterinary", "Public Health"],
  },
  {
    id: "3",
    title: "Sustainable Food Systems: A One Health Imperative",
    author: "Sarah Lee",
    date: "May 10, 2024",
    imageUrl: "https://placehold.co/800x600/fcd34d/000000?text=Food+Systems",
    summary:
      "How does what we eat impact the planet and our health? This piece explores the link between agriculture, environmental stewardship, and human nutrition, advocating for more sustainable food systems.",
    fullContent: `<p>The way we produce and consume food has profound implications for both our health and the health of the planet. Industrial agriculture can contribute to antibiotic resistance, deforestation, and water pollution, all of which fall under the scope of One Health.</p>
    <p>Promoting sustainable farming practices, reducing food waste, and supporting local food systems are crucial steps toward a more resilient and equitable future. By focusing on the interconnectedness of food production and health outcomes, we can work towards a world where everyone has access to safe, nutritious food without compromising the environment.</p>`,
    tags: ["Food", "Sustainability", "Agriculture"],
  },
];

export const mockCommitteeMembers: TeamMember[] = [
  {
    id: "m1",
    name: "Dr. Emily Carter",
    position: "President",
    description:
      "Leads the society with a focus on strategic partnerships and global initiatives.",
    imageUrl: "https://placehold.co/400x400/0ea5e9/ffffff?text=Emily",
    hierarchyOrder: 1,
  },
  {
    id: "m2",
    name: "Dr. David Chen",
    position: "Vice President",
    description:
      "Oversees research and development projects, fostering innovation in One Health.",
    imageUrl: "https://placehold.co/400x400/0ea5e9/ffffff?text=David",
    hierarchyOrder: 2,
  },
  {
    id: "m3",
    name: "Maria Rodriguez",
    position: "Secretary",
    description:
      "Manages communications and administrative functions to keep the society running smoothly.",
    imageUrl: "https://placehold.co/400x400/0ea5e9/ffffff?text=Maria",
    hierarchyOrder: 3,
  },
  {
    id: "m4",
    name: "Chris Evans",
    position: "Treasurer",
    description:
      "Responsible for all financial operations and fundraising efforts.",
    imageUrl: "https://placehold.co/400x400/0ea5e9/ffffff?text=Chris",
    hierarchyOrder: 4,
  },
  {
    id: "m5",
    name: "Dr. Sarah Patel",
    position: "Research Lead",
    description:
      "Specializes in zoonotic disease epidemiology and environmental health.",
    imageUrl: "https://placehold.co/400x400/0ea5e9/ffffff?text=Sarah",
    hierarchyOrder: 5,
  },
  {
    id: "m6",
    name: "Dr. Kenji Tanaka",
    position: "Community Outreach Coordinator",
    description:
      "Works to build strong relationships with local communities and partners.",
    imageUrl: "https://placehold.co/400x400/0ea5e9/ffffff?text=Kenji",
    hierarchyOrder: 6,
  },
];
