import React from 'react';
import {interpolate,useCurrentFrame} from 'remotion';
import {AssetKind,BackgroundKind,SceneLayer} from '../lib/storyboard';

function Shape({asset}:{asset:AssetKind}){
  switch(asset){
    case 'person':return <><circle cy="-29" r="19" fill="#f0b68c"/><path d="M-17 -47q17 -19 34 0v8h-34Z" fill="#514b62"/><rect x="-30" y="-5" width="60" height="52" rx="22" fill="#5d9fc5"/><path d="M-18 47v22m36-22v22" stroke="#435469" strokeWidth="13" strokeLinecap="round"/></>;
    case 'mountain':return <><path d="M-64 49L-5 -53L62 49Z" fill="#88b5aa"/><path d="M-5 -53L-26 -16L-3 -25L12 -12Z" fill="#f6f9f3"/><path d="M-13 49L30 -20L72 49Z" fill="#6c9e93"/></>;
    case 'tree':return <><rect x="-9" y="-7" width="18" height="69" rx="4" fill="#9e6e4c"/><circle cx="-19" cy="-22" r="32" fill="#4f9e71"/><circle cx="16" cy="-27" r="29" fill="#68bb81"/><circle cx="0" cy="-48" r="27" fill="#77c58d"/></>;
    case 'sun':return <><circle r="34" fill="#ffc75e"/>{Array.from({length:8},(_,i)=><path key={i} d="M0 -45V-61" stroke="#ffbd4a" strokeWidth="6" strokeLinecap="round" transform={`rotate(${i*45})`}/>)}</>;
    case 'cloud':return <><rect x="-48" y="-4" width="96" height="32" rx="16" fill="#fff"/><circle cx="-20" cy="-15" r="25" fill="#fff"/><circle cx="14" cy="-24" r="31" fill="#fff"/></>;
    case 'book':return <><path d="M0 -32Q-24 -50 -54 -36V39Q-22 24 0 42Q22 24 54 39V-36Q24 -50 0 -32Z" fill="#f8f0dc" stroke="#497c74" strokeWidth="5"/><path d="M0 -32V42M-40 -15H-12M12 -15H40M-40 0H-12M12 0H40" stroke="#87a7a0" strokeWidth="4"/></>;
    case 'laptop':return <><rect x="-50" y="-41" width="100" height="68" rx="7" fill="#405c70"/><rect x="-42" y="-33" width="84" height="52" rx="3" fill="#9ed4df"/><path d="M-62 29H62L51 42H-51Z" fill="#738e9c"/></>;
    case 'building':return <><rect x="-40" y="-58" width="80" height="117" rx="5" fill="#8caed0"/>{[-24,0,24].flatMap(x=>[-39,-9,21].map(y=><rect key={x+'-'+y} x={x-8} y={y} width="16" height="17" rx="2" fill="#e6f5ee"/>))}<rect x="-12" y="38" width="24" height="21" fill="#547b9e"/></>;
    case 'bridge':return <><path d="M-63 20H63" stroke="#aa7a53" strokeWidth="13" strokeLinecap="round"/><path d="M-51 20V-16Q0 42 51 -16V20" fill="none" stroke="#c49369" strokeWidth="9"/><path d="M-55 21V49M55 21V49" stroke="#8b694d" strokeWidth="10"/></>;
    case 'truck':return <><rect x="-55" y="-31" width="70" height="55" rx="8" fill="#f3a348"/><path d="M15 -14H40L58 9V24H15Z" fill="#dc833e"/><rect x="24" y="-8" width="17" height="18" rx="2" fill="#c4e5e5"/><circle cx="-30" cy="27" r="13" fill="#34475c"/><circle cx="39" cy="27" r="13" fill="#34475c"/></>;
    case 'rock':return <><path d="M-55 45L-37 -8L-5 -46L33 -30L57 45Z" fill="#87949a"/><path d="M-37 -8L-5 -46L5 10L-19 45H-55Z" fill="#a6b0b1"/></>;
    case 'arrow':return <path d="M-58 -13H13V-37L60 0L13 37V13H-58Z" fill="#48a97b"/>;
    case 'coin':return <><circle r="45" fill="#e7b44b" stroke="#b98a33" strokeWidth="6"/><circle r="33" fill="none" stroke="#f9d77a" strokeWidth="3"/><text y="17" textAnchor="middle" fontSize="49" fontWeight="bold" fill="#fff2bd">$</text></>;
    case 'speech':return <><rect x="-56" y="-43" width="112" height="73" rx="22" fill="#fff" stroke="#77b8b2" strokeWidth="5"/><path d="M-16 30L-28 48L7 30" fill="#fff" stroke="#77b8b2" strokeWidth="4"/><path d="M-31 -14H31M-31 0H18" stroke="#82aaa2" strokeWidth="6" strokeLinecap="round"/></>;
    case 'goal':return <><path d="M-35 57V-54" stroke="#4e6372" strokeWidth="7"/><path d="M-31 -50H49L26 -17L49 13H-31Z" fill="#f17f79"/><circle cx="-35" cy="57" r="9" fill="#4e6372"/></>;
    case 'factory':return <><path d="M-55 51V-9L-15 11V-9L22 11V-29H49V51Z" fill="#8aadb4"/><rect x="22" y="-57" width="20" height="30" fill="#6c8f9b"/>{[-35,-3,30].map(x=><rect key={x} x={x} y="27" width="16" height="15" fill="#d4eced"/>)}</>;
    case 'gear':return <><circle r="39" fill="#6d9fa6"/>{Array.from({length:8},(_,i)=><rect key={i} x="-9" y="-55" width="18" height="24" rx="4" fill="#6d9fa6" transform={`rotate(${i*45})`}/>) }<circle r="18" fill="#f6f6ed"/></>;
    case 'plant':return <><path d="M-24 15H24L16 53H-16Z" fill="#cb946b"/><path d="M0 16V-54" stroke="#529369" strokeWidth="6"/><ellipse cx="-18" cy="-29" rx="21" ry="12" fill="#68b77d" transform="rotate(32 -18 -29)"/><ellipse cx="18" cy="-42" rx="21" ry="12" fill="#77c98a" transform="rotate(-32 18 -42)"/></>;
    case 'school':return <><path d="M-60 -17L0 -58L60 -17Z" fill="#df8c68"/><rect x="-49" y="-17" width="98" height="72" fill="#f1c58b"/><rect x="-12" y="18" width="24" height="37" fill="#8bafbd"/>{[-31,31].map(x=><rect key={x} x={x-9} y="-3" width="18" height="19" fill="#a5d8e0"/>)}</>;
  }
}
function Backdrop({kind}:{kind:BackgroundKind}){
  if(kind==='nature')return <><rect width="600" height="440" fill="#d9efe4"/><circle cx="500" cy="70" r="43" fill="#ffe3a2"/><path d="M0 285Q145 205 290 290Q460 185 600 270V440H0Z" fill="#a8d6a9"/><path d="M0 360Q250 290 600 355V440H0Z" fill="#86bf9b"/></>;
  if(kind==='city')return <><rect width="600" height="440" fill="#e0eaf2"/>{[40,155,270,385,500].map((x,i)=><g key={x}><rect x={x} y={150-(i%3)*43} width="92" height={290+(i%3)*43} fill={i%2?'#adc3d0':'#c3d7df'}/>{[0,1,2].map(k=><rect key={k} x={x+12+k*26} y={195-(i%3)*43} width="13" height="18" fill="#f9f6db"/>)}</g>)}<rect y="374" width="600" height="66" fill="#d2dbd8"/></>;
  if(kind==='classroom')return <><rect width="600" height="440" fill="#f9e9d7"/><rect x="110" y="80" width="380" height="185" rx="10" fill="#578e83" stroke="#b38d64" strokeWidth="15"/><rect y="363" width="600" height="77" fill="#d8bb97"/></>;
  if(kind==='office')return <><rect width="600" height="440" fill="#e7eced"/><rect x="180" y="50" width="245" height="185" rx="9" fill="#b9dce1" stroke="#fff" strokeWidth="15"/><path d="M302 50V235M180 140H425" stroke="#fff" strokeWidth="10"/><rect y="365" width="600" height="75" fill="#d2b99d"/></>;
  return <><rect width="600" height="440" fill="#eaf3ed"/><circle cx="100" cy="80" r="130" fill="#d2e9d9"/><circle cx="520" cy="340" r="165" fill="#d8e8ed"/></>;
}
function Layer({layer}:{layer:SceneLayer}){
  const frame=useCurrentFrame();
  const t=Math.max(0,frame-layer.delay*30);
  const ease=interpolate(t,[0,26],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const offset=layer.motion==='slide-right'?-105*(1-ease):layer.motion==='slide-left'?105*(1-ease):0;
  const vertical=layer.motion==='rise'?95*(1-ease):layer.motion==='float'?Math.sin(t/14)*9:0;
  const pulse=layer.motion==='pulse'?1+Math.sin(t/8)*0.09:1;
  const size=layer.motion==='pop'?Math.max(0.01,ease)*layer.scale:layer.scale*pulse;
  const alpha=layer.motion==='none'?1:ease;
  return <g transform={`translate(${layer.x*6+offset} ${layer.y*4.4+vertical}) scale(${size})`} opacity={alpha}><Shape asset={layer.asset}/></g>;
}
export function SceneBuilder({background='abstract',layers=[]}:{background?:BackgroundKind;layers?:SceneLayer[]}){
  return <svg viewBox="0 0 600 440" width="100%" style={{display:'block',borderRadius:22,overflow:'hidden'}}>
    <Backdrop kind={background}/>
    {layers.map((layer,index)=><Layer key={index} layer={layer}/>)}
  </svg>;
}
