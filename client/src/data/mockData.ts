// src/data/mockData.ts

import type { Article, CarouselItem, CommitteeMember } from "../types";

// Mock Articles
export const mockArticles: Article[] = [
  // ... (keep your existing mock articles)
  {
    id: "1",
    title: "The Future of One Health in Africa",
    summary:
      "Exploring integrated approaches to human, animal, and environmental health across the African continent.",
    imageUrl: "https://via.placeholder.com/600x400?text=One+Health+Africa",
    fullContent: `
      <h2>The Interconnectedness of Health</h2>
      <p>The One Health concept recognizes that the health of humans, animals, and the environment are inextricably linked. In Africa, where many communities rely heavily on livestock and natural resources, this interconnectedness is particularly pronounced. Zoonotic diseases, antimicrobial resistance, food safety, and environmental degradation are complex challenges that demand collaborative solutions across sectors.</p>
      <h3>Challenges and Opportunities</h3>
      <p>Africa faces unique challenges, including diverse ecosystems, varying levels of infrastructure, and a high burden of infectious diseases. However, there are also immense opportunities. Traditional ecological knowledge, strong community bonds, and a growing scientific community provide fertile ground for One Health initiatives. Capacity building, policy development, and inter-sectoral collaboration are key to harnessing these opportunities.</p>
      <h3>Case Studies and Success Stories</h3>
      <p>Across the continent, various projects are demonstrating the power of One Health. From vaccination campaigns that protect both livestock and human populations, to surveillance systems that track disease outbreaks in real-time, these initiatives are making a tangible difference. Education and public awareness are also crucial, empowering communities to adopt practices that promote overall well-being.</p>
      <h3>Looking Ahead</h3>
      <p>The path forward for One Health in Africa involves strengthening partnerships between governments, academic institutions, NGOs, and local communities. Investing in research, technology, and training will be essential to build a resilient health system that can effectively address current and future threats. By working together, we can ensure a healthier future for all.</p>
    `,
    date: "2024-07-25",
    author: "Dr. Aisha Khan",
    tags: ["One Health", "Africa", "Research", "Community"],
  },
  {
    id: "2",
    title: "Advancements in Zoonotic Disease Surveillance",
    summary:
      "New technologies and strategies are enhancing our ability to detect and respond to diseases transmitted between animals and humans.",
    imageUrl: "https://via.placeholder.com/600x400?text=Zoonotic+Surveillance",
    fullContent: `
      <h2>Early Detection: A Game Changer</h2>
      <p>Zoonotic diseases pose a significant threat to global health. The ability to detect these pathogens early in animals or humans is critical for preventing widespread outbreaks. Recent advancements in genomic sequencing, rapid diagnostic tests, and real-time data sharing platforms are revolutionizing surveillance efforts.</p>
      <h3>Technological Innovations</h3>
      <p>From portable sequencing devices that can be deployed in remote areas to AI-powered algorithms that analyze vast datasets for unusual patterns, technology is empowering health professionals. Satellite imagery can track environmental changes that influence disease vectors, while citizen science initiatives are contributing to broader surveillance networks.</p>
      <h3>Integrated Surveillance Systems</h3>
      <p>Effective zoonotic disease surveillance requires seamless integration of data from human health, animal health, and environmental sectors. Breaking down silos and fostering interdisciplinary communication are paramount. Training programs for field epidemiologists and veterinarians are crucial for building the human capacity needed to operate these sophisticated systems.</p>
      <h3>Global Collaboration</h3>
      <p>No single country can tackle zoonotic threats alone. International collaboration, sharing of best practices, and coordinated research efforts are essential. Initiatives like the Global Health Security Agenda emphasize the importance of robust surveillance capabilities worldwide to safeguard public health.</p>
    `,
    date: "2024-07-20",
    author: "Prof. Mark Jensen",
    tags: ["Zoonotic", "Surveillance", "Technology", "Global Health"],
  },
  {
    id: "3",
    title: "Climate Change and Emerging Infectious Diseases",
    summary:
      "Understanding the complex links between a changing climate and the emergence and spread of new pathogens.",
    imageUrl: "https://via.placeholder.com/600x400?text=Climate+Change+Health",
    fullContent: `
      <h2>The Warming Planet and Disease Dynamics</h2>
      <p>Climate change is altering ecosystems, influencing vector populations, and driving changes in human and animal behavior. These shifts create new opportunities for pathogens to emerge and spread, impacting public health and animal welfare globally. Rising temperatures, altered precipitation patterns, and extreme weather events are all contributing factors.</p>
      <h3>Vector-Borne Diseases on the Rise</h3>
      <p>Mosquitoes, ticks, and other vectors are expanding their geographical ranges due to climate change, bringing diseases like malaria, dengue, and Lyme disease to new areas. Understanding these ecological shifts is vital for predicting and preventing future outbreaks. Integrated vector management strategies are becoming increasingly important.</p>
      <h3>Food and Waterborne Illnesses</h3>
      <p>Changes in temperature and rainfall can affect the safety of food and water supplies, leading to an increase in foodborne and waterborne illnesses. Extreme weather events can damage infrastructure, contaminating water sources and displacing populations, further exacerbating health risks.</p>
      <h3>Interdisciplinary Solutions</h3>
      <p>Addressing the health impacts of climate change requires a truly interdisciplinary approach, integrating climate science, public health, veterinary medicine, and environmental conservation. Developing climate-resilient health systems and promoting sustainable practices are crucial steps in mitigating these risks.</p>
    `,
    date: "2024-07-15",
    author: "Dr. Lena Schmidt",
    tags: [
      "Climate Change",
      "Infectious Diseases",
      "Environment",
      "Public Health",
    ],
  },
];

// Mock Carousel Items
export const mockCarouselItems: CarouselItem[] = [
  {
    id: "1",
    title: "Innovating for a Healthier Future",
    description:
      "Discover how our latest research is shaping the landscape of One Health.",
    imageUrl: "https://via.placeholder.com/1200x600?text=Research+Innovation",
    link: "/articles/1",
  },
  {
    id: "2",
    title: "Community Engagement for Global Impact",
    description:
      "Learn about our initiatives that empower local communities worldwide.",
    imageUrl: "https://via.placeholder.com/1200x600?text=Community+Impact",
    link: "/articles/2",
  },
  {
    id: "3",
    title: "Protecting Our Planet, Protecting Ourselves",
    description:
      "Explore the critical link between environmental health and human well-being.",
    imageUrl: "https://via.placeholder.com/1200x600?text=Environmental+Health",
    link: "/articles/3",
  },
];

// Mock Committee Members (with added description and hierarchyOrder)
export const mockCommitteeMembers: CommitteeMember[] = [
  {
    id: "M1",
    name: "Dr. Evelyn Reed",
    position: "President",
    imageUrl: "https://via.placeholder.com/150x150?text=Evelyn+Reed",
    description:
      "Dr. Evelyn Reed is a leading epidemiologist with over 20 years of experience in public health. Her vision for the society focuses on fostering interdisciplinary collaboration to tackle global health challenges. She is passionate about mentoring young scientists and advocating for policy changes that support integrated health approaches.",
    hierarchyOrder: 1,
  },
  {
    id: "M2",
    name: "Prof. David Chen",
    position: "Vice President",
    imageUrl: "https://via.placeholder.com/150x150?text=David+Chen",
    description:
      "Prof. David Chen is an expert in veterinary medicine and zoonotic disease research. He oversees the society's scientific initiatives and aims to bridge the gap between animal health research and public health application. His work is critical in developing early warning systems for emerging infectious diseases.",
    hierarchyOrder: 2,
  },
  {
    id: "M3",
    name: "Sarah Johnson",
    position: "Secretary",
    imageUrl: "https://via.placeholder.com/150x150?text=Sarah+Johnson",
    description:
      "Sarah Johnson brings exceptional organizational skills and a background in environmental policy. As Secretary, she manages communications, records, and ensures the smooth operation of all society activities. She is a strong advocate for environmental sustainability within the One Health framework.",
    hierarchyOrder: 3,
  },
  {
    id: "M4",
    name: "Michael O'Connell",
    position: "Treasurer",
    imageUrl: "https://via.placeholder.com/150x150?text=Michael+OConnell",
    description:
      "Michael O'Connell is a financial analyst dedicated to ensuring the transparent and responsible use of the society's resources. He manages budgets, funding applications, and financial reporting. His expertise ensures the society's long-term stability and growth.",
    hierarchyOrder: 3, // Co-equal with Secretary for grid layout, or adjust as needed
  },
  {
    id: "M5",
    name: "Dr. Anya Sharma",
    position: "Head of Research",
    imageUrl: "https://via.placeholder.com/150x150?text=Anya+Sharma",
    description:
      "Dr. Anya Sharma leads the society's research arm, identifying key areas for investigation and fostering collaborative projects. Her focus is on innovative solutions for antimicrobial resistance and neglected tropical diseases. She holds a PhD in Molecular Biology.",
    hierarchyOrder: 4,
  },
  {
    id: "M6",
    name: "James Rodriguez",
    position: "Community Outreach Lead",
    imageUrl: "https://via.placeholder.com/150x150?text=James+Rodriguez",
    description:
      "James Rodriguez is passionate about community engagement and translates complex scientific concepts into accessible information for the public. He spearheads initiatives to raise awareness and promote healthy practices at the grassroots level. He has extensive experience in public health education.",
    hierarchyOrder: 4,
  },
];
