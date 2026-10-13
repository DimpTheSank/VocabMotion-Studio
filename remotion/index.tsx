import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {VocabularyVideo} from '../components/VocabularyVideo';
import {StoryboardVideo} from '../components/StoryboardVideo';
import {defaultLesson,FPS,FRAMES} from '../lib/lesson';
import {defaultStoryboard,storyboardFrames} from '../lib/storyboard';

registerRoot(()=> <>
  <Composition id="VocabLesson" component={VocabularyVideo} width={720} height={1280} fps={FPS} durationInFrames={FRAMES} defaultProps={{lesson:defaultLesson}}/>
  <Composition
    id="StoryboardLesson"
    component={StoryboardVideo}
    width={720}
    height={1280}
    fps={FPS}
    durationInFrames={storyboardFrames(defaultStoryboard)}
    defaultProps={{storyboard:defaultStoryboard}}
    calculateMetadata={({props})=>({durationInFrames:storyboardFrames(props.storyboard)})}
  />
</>);
