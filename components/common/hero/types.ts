export interface HeroButton {
    label: string;
    href: string;
  }
  
  
  export interface HeroSlide {
  
    id: string;
  
    video: string;
  
    poster?: string;
  
    eyebrow?: string;
  
    title: string;
  
    description?: string;
  
    buttons?: HeroButton[];
  
  }
  