import {FPS,SceneStyle} from './lesson';

export type StoryScene={
  title:string;
  caption:string;
  narration:string;
  style:SceneStyle;
  blocked:boolean;
  seconds:number;
  objects:string[];
};
export type Storyboard={title:string;scenes:StoryScene[]};

export const defaultStoryboard:Storyboard={
  title:'Facilitate vs Hinder',
  scenes:[
    {title:'FACILITATE',caption:'Make something easier',narration:'Facilitate means to make a process easier.',style:'journey',blocked:false,seconds:4,objects:['truck','bridge']},
    {title:'A BRIDGE HELPS',caption:'A bridge facilitates transportation.',narration:'A bridge facilitates transportation by helping a truck cross a river.',style:'journey',blocked:false,seconds:7,objects:['truck','bridge']},
    {title:'HINDER',caption:'Make progress more difficult',narration:'A roadblock hinders progress.',style:'journey',blocked:true,seconds:6,objects:['truck','rock']},
    {title:'IELTS EXAMPLE',caption:'Technology facilitates communication.',narration:'Technology facilitates communication between people.',style:'dialogue',blocked:false,seconds:6,objects:['people','communication']},
    {title:'QUICK QUIZ',caption:'Online learning can ____ education.',narration:'Which word means make easier? Facilitate.',style:'process',blocked:false,seconds:7,objects:['steps']}
  ]
};

export function storyboardFrames(storyboard:Storyboard):number{
  return storyboard.scenes.reduce((sum,scene)=>sum+Math.max(3,Math.min(10,Math.round(scene.seconds)))*FPS,0);
}
