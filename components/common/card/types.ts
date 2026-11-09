export type FeatureIcon =
  | "truck"
  | "shield"
  | "star"
  | "credit-card";


export interface Feature {

  id:string;

  title:string;

  description:string;

  icon:FeatureIcon;

}
