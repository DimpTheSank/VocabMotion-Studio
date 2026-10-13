import React from 'react';
import {AbsoluteFill,interpolate,Sequence,useCurrentFrame} from 'remotion';
import {FPS} from '../lib/lesson';
import {Storyboard,StoryScene} from '../lib/storyboard';
import {Visual} from './VocabularyVideo';
import {SceneBuilder} from './SceneBuilder';

function StoryShot({scene,index,total}:{scene:StoryScene;index:number;total:number}){
  const frame=useCurrentFrame();
  const opacity=interpolate(frame,[0,12],[0,1],{extrapolateRight:'clamp'});
  return <AbsoluteFill style={{background:'#fcf5e8',color:'#284335',fontFamily:'Arial,sans-serif',padding:'85px 50px'}}>
    <div style={{fontSize:23,fontWeight:800,color:'#168b57'}}>VOCAB MOTION <span style={{float:'right',color:'#9b9a8b'}}>{index+1}/{total}</span></div>
    <div style={{marginTop:100,fontSize:60,fontWeight:800,lineHeight:1.12,opacity,color:scene.blocked?'#dc5852':'#168b57',overflowWrap:'anywhere'}}>{scene.title}</div>
    <div style={{marginTop:42,fontSize:37,lineHeight:1.3,overflowWrap:'anywhere'}}>{scene.caption}</div>
    <div style={{marginTop:60}}>{scene.layers?.length||scene.imageDataUrl?<SceneBuilder background={scene.background} layers={scene.layers} imageDataUrl={scene.imageDataUrl}/>:<Visual style={scene.style} blocked={scene.blocked} frame={frame}/>}</div>
    <div style={{position:'absolute',bottom:130,left:50,right:50,fontSize:26,color:'#6a776b',lineHeight:1.4}}>{scene.narration}</div>
    <div style={{position:'absolute',bottom:55,left:50,right:50,height:6,background:'#d8e6d8',borderRadius:8}}>
      <div style={{width:`${Math.min(100,100*frame/(scene.seconds*FPS))}%`,height:'100%',background:'#168b57',borderRadius:8}}/>
    </div>
  </AbsoluteFill>;
}

export function StoryboardVideo({storyboard}:{storyboard:Storyboard}){
  let start=0;
  return <AbsoluteFill>{storyboard.scenes.map((scene,index)=>{
    const from=start;
    const durationInFrames=Math.round(scene.seconds*FPS);
    start+=durationInFrames;
    return <Sequence key={index} from={from} durationInFrames={durationInFrames}>
      <StoryShot scene={scene} index={index} total={storyboard.scenes.length}/>
    </Sequence>;
  })}</AbsoluteFill>;
}
