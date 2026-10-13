import {FPS,SceneStyle} from './lesson';

export type BackgroundKind='nature'|'city'|'classroom'|'office'|'abstract';
export type AssetKind='person'|'mountain'|'tree'|'sun'|'cloud'|'book'|'laptop'|'building'|'bridge'|'truck'|'rock'|'arrow'|'coin'|'speech'|'goal'|'factory'|'gear'|'plant'|'school';
export type MotionKind='none'|'float'|'slide-right'|'slide-left'|'rise'|'pop'|'pulse';
export const BACKGROUNDS:BackgroundKind[]=['nature','city','classroom','office','abstract'];
export const ASSETS:AssetKind[]=['person','mountain','tree','sun','cloud','book','laptop','building','bridge','truck','rock','arrow','coin','speech','goal','factory','gear','plant','school'];
export const MOTIONS:MotionKind[]=['none','float','slide-right','slide-left','rise','pop','pulse'];
export type SceneLayer={asset:AssetKind;x:number;y:number;scale:number;motion:MotionKind;delay:number};
export type StoryScene={
  title:string;caption:string;narration:string;style:SceneStyle;blocked:boolean;seconds:number;objects:string[];
  background?:BackgroundKind;
  layers?:SceneLayer[];
  imagePrompt?:string;
  imageDataUrl?:string;
};
export type Storyboard={title:string;scenes:StoryScene[]};
export const defaultStoryboard:Storyboard={
  title:'Facilitate vs Hinder',
  scenes:[
    {title:'FACILITATE',caption:'Make something easier',narration:'Facilitate means to make a process easier.',style:'journey',blocked:false,seconds:4,objects:['truck','bridge'],background:'nature',layers:[{asset:'truck',x:25,y:69,scale:1,motion:'slide-right',delay:0},{asset:'bridge',x:65,y:76,scale:1.3,motion:'pop',delay:0.5}]},
    {title:'A BRIDGE HELPS',caption:'A bridge facilitates transportation.',narration:'A bridge facilitates transportation by helping a truck cross a river.',style:'journey',blocked:false,seconds:7,objects:['truck','bridge'],background:'nature',layers:[{asset:'bridge',x:50,y:75,scale:1.4,motion:'pop',delay:0},{asset:'truck',x:30,y:59,scale:1,motion:'slide-right',delay:0.4}]},
    {title:'HINDER',caption:'Make progress more difficult',narration:'A roadblock hinders progress.',style:'journey',blocked:true,seconds:6,objects:['truck','rock'],background:'nature',layers:[{asset:'rock',x:70,y:70,scale:1.2,motion:'pop',delay:0.5},{asset:'truck',x:30,y:67,scale:1,motion:'slide-right',delay:0}]},
    {title:'IELTS EXAMPLE',caption:'Technology facilitates communication.',narration:'Technology facilitates communication between people.',style:'dialogue',blocked:false,seconds:6,objects:['people','communication'],background:'office',layers:[{asset:'person',x:28,y:65,scale:1.2,motion:'float',delay:0},{asset:'speech',x:55,y:35,scale:1,motion:'pop',delay:0.5},{asset:'person',x:78,y:65,scale:1.2,motion:'float',delay:0.2}]},
    {title:'QUICK QUIZ',caption:'Online learning can ____ education.',narration:'Which word means make easier? Facilitate.',style:'process',blocked:false,seconds:7,objects:['steps'],background:'classroom',layers:[{asset:'book',x:30,y:62,scale:1.2,motion:'pop',delay:0},{asset:'arrow',x:50,y:55,scale:1,motion:'slide-right',delay:0.4},{asset:'laptop',x:75,y:62,scale:1.2,motion:'pop',delay:0.8}]}
  ]
};
export function storyboardFrames(storyboard:Storyboard):number{
  return storyboard.scenes.reduce((sum,scene)=>sum+Math.max(3,Math.min(10,Math.round(scene.seconds)))*FPS,0);
}
export function validLayer(layer:unknown):layer is SceneLayer{
  if(!layer||typeof layer!=='object')return false;
  const v=layer as Record<string,unknown>;
  return ASSETS.includes(v.asset as AssetKind)&&MOTIONS.includes(v.motion as MotionKind)
    &&typeof v.x==='number'&&v.x>=0&&v.x<=100
    &&typeof v.y==='number'&&v.y>=0&&v.y<=100
    &&typeof v.scale==='number'&&v.scale>=0.4&&v.scale<=2
    &&typeof v.delay==='number'&&v.delay>=0&&v.delay<=4;
}
