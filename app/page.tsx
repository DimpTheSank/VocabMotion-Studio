'use client';
import {useState} from 'react';
import {Player} from '@remotion/player';
import {VocabularyVideo} from '../components/VocabularyVideo';
import {StoryboardVideo} from '../components/StoryboardVideo';
import {defaultLesson,suggestStyle,FPS,FRAMES,Lesson,SceneStyle} from '../lib/lesson';
import {Storyboard,StoryScene,SceneLayer,ASSETS,MOTIONS,BACKGROUNDS,storyboardFrames} from '../lib/storyboard';

const styleNames:Record<SceneStyle,string>={journey:'Journey — xe tải / cầu / vật cản',chart:'Chart — biểu đồ',dialogue:'Dialogue — hội thoại',process:'Process — quy trình'};
const styles=Object.keys(styleNames) as SceneStyle[];
export default function Home(){
  const [data,setData]=useState<Lesson>(defaultLesson);
  const [storyboard,setStoryboard]=useState<Storyboard|null>(null);
  const [accessCode,setAccessCode]=useState('');
  const [notes,setNotes]=useState('');
  const [busy,setBusy]=useState(false);
  const [generating,setGenerating]=useState(false);
  const [generatingImage,setGeneratingImage]=useState<number|null>(null);
  const [msg,setMsg]=useState('');
  const update=(key:keyof Lesson,value:string)=>setData(prev=>({...prev,[key]:value}));
  const updateScene=(index:number,key:keyof StoryScene,value:string|number|boolean|string[]|SceneLayer[])=>setStoryboard(prev=>prev?{
    ...prev,scenes:prev.scenes.map((scene,i)=>i===index?{...scene,[key]:value}:scene)
  }:prev);

  function updateLayer(sceneIndex:number,layerIndex:number,patch:Partial<SceneLayer>){
    setStoryboard(prev=>prev?{...prev,scenes:prev.scenes.map((scene,i)=>i===sceneIndex?{
      ...scene,layers:(scene.layers||[]).map((layer,j)=>j===layerIndex?{...layer,...patch}:layer)
    }:scene)}:prev);
  }
  function addLayer(index:number){
    setStoryboard(prev=>prev?{...prev,scenes:prev.scenes.map((scene,i)=>i===index?{
      ...scene,layers:[...(scene.layers||[]),{asset:'person',x:50,y:55,scale:1,motion:'pop',delay:0}].slice(0,5) as SceneLayer[]
    }:scene)}:prev);
  }
  async function generateSceneImage(index:number){
    const scene=storyboard?.scenes[index];
    if(!scene)return;
    if(!window.confirm('Tạo hình AI cho cảnh này sẽ phát sinh chi phí OpenAI API. Tiếp tục?'))return;
    setGeneratingImage(index);setMsg('Đang tạo hình AI cho cảnh '+(index+1)+'...');
    try{
      const res=await fetch('/api/ai/image',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({accessCode,prompt:scene.imagePrompt||scene.caption})
      });
      const result=await res.json();
      if(!res.ok)throw new Error(result.error||'Image generation failed');
      updateScene(index,'imageDataUrl',result.imageDataUrl);
      setMsg('Đã tạo nền AI cho cảnh '+(index+1)+'. Các lớp SVG vẫn có thể chuyển động phía trên.');
    }catch(e){setMsg(e instanceof Error?e.message:'Image generation failed')}
    finally{setGeneratingImage(null)}
  }

  async function generateStoryboard(){
    setGenerating(true);setMsg('AI đang lên storyboard...');
    try{
      const res=await fetch('/api/ai/storyboard',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({word:data.word,contrast:data.contrast,meaning:data.meaning,example:data.example,notes,accessCode})
      });
      const result=await res.json();
      if(!res.ok)throw new Error(result.error||'AI generation failed');
      setStoryboard(result.storyboard as Storyboard);
      setMsg('Đã tạo 5 cảnh với các lớp SVG chuyển động. Có thể chỉnh từng lớp hoặc tạo nền AI riêng.');
    }catch(e){setMsg(e instanceof Error?e.message:'AI generation failed')}
    finally{setGenerating(false)}
  }
  async function exportVideo(){
    setBusy(true);setMsg('Rendering MP4...');
    try{
      const res=await fetch('/api/render',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify(storyboard?{storyboard}:data)
      });
      if(!res.ok){const err=await res.json();throw Error(err.error||'Render failed')}
      const blob=await res.blob();
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');a.href=url;a.download='vocabmotion.mp4';a.click();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
      setMsg('MP4 ready');
    }catch(e){setMsg(e instanceof Error?e.message:'Render failed')}
    finally{setBusy(false)}
  }
  function saveJson(){
    const content=storyboard?{storyboard}:data;
    const url=URL.createObjectURL(new Blob([JSON.stringify(content,null,2)],{type:'application/json'}));
    const a=document.createElement('a');a.href=url;a.download='vocabmotion-lesson.json';a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  async function importJson(file?:File){
    if(!file)return;
    try{
      const parsed=JSON.parse(await file.text());
      if(parsed?.storyboard?.scenes&&Array.isArray(parsed.storyboard.scenes)){
        setStoryboard(parsed.storyboard);
      }else if(typeof parsed?.word==='string'){
        setData({...defaultLesson,...parsed});setStoryboard(null);
      }else throw Error('Unknown JSON format');
      setMsg('Đã nhập JSON');
    }catch(e){setMsg(e instanceof Error?e.message:'Invalid JSON')}
  }
  return <main>
    <section className="panel">
      <h1>VocabMotion Studio v0.4</h1>
      <p>Hybrid Scene Builder • AI phối hợp các asset SVG và tạo nền minh họa theo yêu cầu.</p>
      {([['word','Từ vựng'],['ipa','IPA'],['meaning','Nghĩa'],['contrast','Từ đối lập (optional)'],['contrastMeaning','Nghĩa từ đối lập'],['example','Ví dụ IELTS']] as const).map(([key,label])=>
        <div key={key}><label>{label}</label>{key==='example'?<textarea rows={3} value={data[key]} onChange={e=>update(key,e.target.value)}/>:<input value={data[key]} onChange={e=>update(key,e.target.value)}/>}</div>
      )}
      <label>Ý tưởng / kịch bản bổ sung cho AI (optional)</label>
      <textarea rows={4} value={notes} maxLength={1200} onChange={e=>setNotes(e.target.value)} placeholder="Ví dụ: giải thích bằng hình ảnh xe tải đi qua cầu, sau đó gặp tảng đá..." />
      <label>Studio Access Code (chỉ dùng để xác thực yêu cầu AI)</label>
      <input type="password" autoComplete="off" value={accessCode} onChange={e=>setAccessCode(e.target.value)} placeholder="Mã đã cấu hình trong STUDIO_ACCESS_CODE"/>
      <div className="actions">
        <button disabled={generating||!data.word.trim()} onClick={generateStoryboard}>{generating?'AI đang tạo...':'✨ Generate with AI'}</button>
        <button className="secondary" onClick={()=>setStoryboard(null)}>Quay về template</button>
      </div>
      {storyboard?<>
        <h2>Storyboard • {storyboard.scenes.length} cảnh</h2>
        <label>Tên video</label><input value={storyboard.title} onChange={e=>setStoryboard({...storyboard,title:e.target.value})}/>
        {storyboard.scenes.map((scene,index)=><div key={index} style={{border:'1px solid #d5e0d8',borderRadius:12,padding:14,marginTop:15}}>
          <h3>Cảnh {index+1} · {scene.seconds}s</h3>
          <label>Tiêu đề trên màn hình</label><input value={scene.title} onChange={e=>updateScene(index,'title',e.target.value)}/>
          <label>Phụ đề / giải thích</label><textarea rows={2} value={scene.caption} onChange={e=>updateScene(index,'caption',e.target.value)}/>
          <label>Lời thoại (chưa có TTS)</label><textarea rows={2} value={scene.narration} onChange={e=>updateScene(index,'narration',e.target.value)}/>
          <label>Minh họa SVG</label><select value={scene.style} onChange={e=>updateScene(index,'style',e.target.value as SceneStyle)}>
            {styles.map(style=><option key={style} value={style}>{styleNames[style]}</option>)}
          </select>
          <label>Thời lượng (3–10 giây)</label><input type="number" min={3} max={10} value={scene.seconds} onChange={e=>updateScene(index,'seconds',Math.max(3,Math.min(10,Number(e.target.value)||3)))}/>
          <label><input type="checkbox" style={{width:'auto',marginRight:8}} checked={scene.blocked} onChange={e=>updateScene(index,'blocked',e.target.checked)}/>Trở ngại / ý nghĩa tiêu cực</label>
          <label>Bối cảnh</label>
          <select value={scene.background||'abstract'} onChange={e=>updateScene(index,'background',e.target.value)}>
            {BACKGROUNDS.map(bg=><option key={bg} value={bg}>{bg}</option>)}
          </select>
          <h4>Scene Builder • các đối tượng SVG</h4>
          {(scene.layers||[]).map((layer,j)=><div key={j} className="layer-editor">
            <div className="layer-header"><strong>Layer {j+1}</strong><button className="secondary" onClick={()=>updateScene(index,'layers',(scene.layers||[]).filter((_,k)=>k!==j))}>Xóa</button></div>
            <label>Đối tượng</label><select value={layer.asset} onChange={e=>updateLayer(index,j,{asset:e.target.value as SceneLayer['asset']})}>
              {ASSETS.map(asset=><option key={asset} value={asset}>{asset}</option>)}
            </select>
            <label>Chuyển động</label><select value={layer.motion} onChange={e=>updateLayer(index,j,{motion:e.target.value as SceneLayer['motion']})}>
              {MOTIONS.map(motion=><option key={motion} value={motion}>{motion}</option>)}
            </select>
            <div className="layer-grid">
              {([['x','X (%)',0,100,1],['y','Y (%)',0,100,1],['scale','Kích thước',0.4,2,0.1],['delay','Delay (s)',0,4,0.1]] as const).map(([key,label,min,max,step])=>
                <div key={key}><label>{label}</label><input type="number" min={min} max={max} step={step} value={layer[key]} onChange={e=>updateLayer(index,j,{[key]:Math.max(min,Math.min(max,Number(e.target.value)||0))} as Partial<SceneLayer>)}/></div>
              )}
            </div>
          </div>)}
          <div className="actions"><button className="secondary" disabled={(scene.layers||[]).length>=5} onClick={()=>addLayer(index)}>+ Thêm đối tượng</button></div>
          <h4>AI Image — nền tùy chỉnh (tùy chọn, có phí API)</h4>
          <label>Mô tả hình nền</label><textarea rows={2} value={scene.imagePrompt||''} maxLength={450} onChange={e=>updateScene(index,'imagePrompt',e.target.value)} placeholder="A cozy classroom with warm daylight..."/>
          <div className="actions">
            <button disabled={generatingImage!==null||!accessCode||!(scene.imagePrompt||scene.caption).trim()} onClick={()=>generateSceneImage(index)}>{generatingImage===index?'Đang tạo hình...':'Tạo nền bằng AI'}</button>
            {scene.imageDataUrl&&<button className="secondary" onClick={()=>updateScene(index,'imageDataUrl','')}>Xóa nền AI</button>}
          </div>
          {scene.imageDataUrl&&<p className="note">Đã có nền AI. Hình được lưu trong JSON khi tải xuống (file có thể lớn).</p>}
          <p className="note">Ghi chú ý tưởng: {(scene.objects||[]).join(', ')||'—'}</p>
        </div>)}
      </>:<>
        <label>Template minh họa mặc định</label>
        <select value={data.sceneStyle} onChange={e=>update('sceneStyle',e.target.value)}>
          {styles.map(style=><option key={style} value={style}>{styleNames[style]}</option>)}
        </select>
        <div className="actions"><button className="secondary" onClick={()=>update('sceneStyle',suggestStyle(data.word+' '+data.contrast))}>Gợi ý template</button></div>
      </>}
      <div className="actions">
        <button disabled={busy} onClick={exportVideo}>{busy?'Rendering...':'Xuất MP4 (local)'}</button>
        <button className="secondary" onClick={saveJson}>Tải JSON</button>
        <label>Nhập JSON <input type="file" accept=".json" onChange={e=>importJson(e.target.files?.[0])}/></label>
      </div>
      <p className="note" role="status">{msg}</p>
      <p className="note">Scene Builder hỗ trợ các đối tượng SVG độc lập và nền AI theo từng cảnh (chỉ khi bạn bấm tạo). Nền AI không tự biến thành nhân vật có khớp chuyển động. Chưa có TTS. MP4 trên Vercel cần render worker riêng.</p>
    </section>
    <aside className="panel preview">
      <h2>Preview • 9:16</h2>
      <div className="screen">
        {storyboard?<Player key="storyboard" component={StoryboardVideo} inputProps={{storyboard}} compositionWidth={720} compositionHeight={1280} fps={FPS} durationInFrames={storyboardFrames(storyboard)} controls autoPlay loop style={{width:'100%',aspectRatio:'9/16'}}/>:
        <Player key="legacy" component={VocabularyVideo} inputProps={{lesson:data}} compositionWidth={720} compositionHeight={1280} fps={FPS} durationInFrames={FRAMES} controls autoPlay loop style={{width:'100%',aspectRatio:'9/16'}}/>}
      </div>
      <p>{storyboard?Math.round(storyboardFrames(storyboard)/FPS):30} giây • 720 × 1280 • 30 FPS</p>
    </aside>
  </main>;
}
