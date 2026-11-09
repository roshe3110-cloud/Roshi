
export interface Announcement {
    id: string;
    text: string;
  }
  
  export interface AnnouncementBarProps {
    items: Announcement[];
    interval?: number;
    autoPlay?: boolean;
  }
  