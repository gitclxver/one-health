// src/types.ts

// Existing interfaces
export interface Article {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  fullContent: string;
  date: string;
  author: string;
  tags: string[];
}

export interface CarouselItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

// New or updated interfaces
export interface CommitteeMember {
  id: string;
  name: string;
  position: string;
  imageUrl: string;
  description: string;
  hierarchyOrder: number;
}
