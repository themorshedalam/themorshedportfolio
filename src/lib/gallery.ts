export type GalleryItem = {
  id: string;
  title: string;
  category: "Office Life" | "Events & Gatherings";
  date: string;
  src: string;
  aspect: "portrait" | "landscape";
  description?: string;
  location?: string;
};

export const galleryItems: GalleryItem[] = [
  {
    id: "gallery-1",
    title: "Studio & Team Moments",
    category: "Office Life",
    date: "Sep 2026",
    src: "/gallery/office-event-1.jpg",
    aspect: "portrait",
    description: "Creative studio life, collaborative design sessions, and office culture.",
    location: "ENTERTAINER FZ LLC · Dubai, UAE",
  },
  {
    id: "gallery-2",
    title: "Milestone Celebration",
    category: "Events & Gatherings",
    date: "2026",
    src: "/gallery/office-event-2.jpg",
    aspect: "landscape",
    description: "Milestone company event, celebrating major campaign launches and creative achievements.",
    location: "Dubai, UAE",
  },
  {
    id: "gallery-3",
    title: "Event Highlights & Team Spirit",
    category: "Events & Gatherings",
    date: "2026",
    src: "/gallery/office-event-3.png",
    aspect: "portrait",
    description: "On-site celebration and team togetherness during annual company gathering.",
    location: "Dubai, UAE",
  },
  {
    id: "gallery-4",
    title: "Office Milestone & Team Gathering",
    category: "Office Life",
    date: "2026",
    src: "/gallery/office-event-4-opt.jpg",
    aspect: "landscape",
    description: "Celebrating shared wins, campaign rollouts, and collaborative creative energy.",
    location: "ENTERTAINER FZ LLC · Dubai, UAE",
  },
  {
    id: "gallery-5",
    title: "Company Celebration & Community",
    category: "Events & Gatherings",
    date: "2026",
    src: "/gallery/office-event-5-opt.jpg",
    aspect: "landscape",
    description: "Company celebration gathering with colleagues, partners, and collaborators.",
    location: "Dubai, UAE",
  },
  {
    id: "gallery-art-dubai",
    title: "Art Dubai — Special Edition",
    category: "Events & Gatherings",
    date: "May 2026",
    src: "/gallery/art-dubai-2026.jpg",
    aspect: "portrait",
    description: "Attending Art Dubai Special Edition at Madinat Jumeirah, exploring regional contemporary visual arts, design culture, and creative direction.",
    location: "Madinat Jumeirah · Dubai, UAE",
  },
];
