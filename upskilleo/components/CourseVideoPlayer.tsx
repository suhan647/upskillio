import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, Volume2, VolumeX, Info, Maximize2, Minimize2, Circle, Code, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface KeyMoment {
  id: string;
  timeInSeconds: number;
  challenge: string;
  hints: string[];
  solution: string;
}

interface CourseVideoPlayerProps {
  videoUrl: string;
  keyMoments: KeyMoment[];
  onKeyMomentEncountered: (keyMoment: KeyMoment) => void;
  onComplete: () => void;
  showVideo: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onContinueFromKeyMoment?: () => void;
  resumeVideo?: boolean;
  lastVideoTime?: number;
}

const CourseVideoPlayer: React.FC<CourseVideoPlayerProps> = ({
  videoUrl,
  keyMoments,
  onKeyMomentEncountered,
  onComplete,
  showVideo = true,
  isFullscreen = false,
  onToggleFullscreen,
  onContinueFromKeyMoment,
  resumeVideo = false,
  lastVideoTime = 0
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showKeyMomentModal, setShowKeyMomentModal] = useState(false);
  const [currentKeyMoment, setCurrentKeyMoment] = useState<KeyMoment | null>(null);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [lastKeyMomentTime, setLastKeyMomentTime] = useState(0);
  const [shouldResume, setShouldResume] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize video duration
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', () => {
        setDuration(videoRef.current?.duration || 90);
      });
    }
  }, []);

  // Handle resumeVideo prop
  useEffect(() => {
    if (resumeVideo && lastVideoTime > 0 && videoRef.current) {
      const resumeTime = lastVideoTime + 1;
      videoRef.current.currentTime = resumeTime;
      setCurrentTime(resumeTime);
      setIsPlaying(true);
      videoRef.current.play().catch(console.error);
    }
  }, [resumeVideo, lastVideoTime]);

  // Handle video playback
  useEffect(() => {
    if (isPlaying) {
      videoRef.current?.play().catch(err => {
        console.error("Error playing video:", err);
        setIsPlaying(false);
      });
      
      timerRef.current = setInterval(() => {
        if (videoRef.current) {
          const currentVideoTime = videoRef.current.currentTime;
          setCurrentTime(currentVideoTime);
          
          const keyMoment = keyMoments.find(km => 
            Math.abs(km.timeInSeconds - currentVideoTime) < 1 &&
            lastKeyMomentTime !== km.timeInSeconds
          );
          
          if (keyMoment) {
            setIsPlaying(false);
            videoRef.current.pause();
            setCurrentKeyMoment(keyMoment);
            setShowKeyMomentModal(true);
            setLastKeyMomentTime(keyMoment.timeInSeconds);
            onKeyMomentEncountered(keyMoment);
          }
          
          if (currentVideoTime >= videoRef.current.duration && !videoCompleted) {
            setIsPlaying(false);
            setVideoCompleted(true);
            toast.success("Video completed! You've finished the course.");
            onComplete();
          }
        }
      }, 100);
    } else {
      videoRef.current?.pause();
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, duration, keyMoments, onComplete, onKeyMomentEncountered, videoCompleted, lastKeyMomentTime]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0]);
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleContinue = () => {
    if (currentKeyMoment) {
      onKeyMomentEncountered(currentKeyMoment);
    }
    setShowKeyMomentModal(false);
    if (onContinueFromKeyMoment) {
      onContinueFromKeyMoment();
    } else if (videoRef.current) {
      const resumeTime = lastVideoTime + 1;
      videoRef.current.currentTime = resumeTime;
      setCurrentTime(resumeTime);
      setIsPlaying(true);
      videoRef.current.play().catch(console.error);
    }
  };

  const handleSkipChallenge = () => {
    setShowKeyMomentModal(false);
    if (onContinueFromKeyMoment) {
      onContinueFromKeyMoment();
    } else if (videoRef.current) {
      const resumeTime = lastVideoTime + 1;
      videoRef.current.currentTime = resumeTime;
      setCurrentTime(resumeTime);
      setIsPlaying(true);
      videoRef.current.play().catch(console.error);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleVideoEnded = () => {
    if (!videoCompleted) {
      setVideoCompleted(true);
      onComplete();
    }
  };

  // Added method to expose the current key moment time
  const getCurrentKeyMomentTime = () => lastKeyMomentTime;

  useEffect(() => {
    const forceCompleteTimeout = setTimeout(() => {
      if (!videoCompleted && currentTime < duration - 10) {
        setCurrentTime(duration - 5);
      }
    }, 60000);
    
    return () => clearTimeout(forceCompleteTimeout);
  }, [currentTime, duration, videoCompleted]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  if (!showVideo) {
    return null;
  }

  const sampleVideoUrl = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  return (
    <div 
      className={`relative bg-black overflow-hidden transition-all duration-300 
        ${isFullscreen 
          ? 'fixed inset-0 z-[10001] w-screen h-screen' 
          : 'w-full aspect-video rounded-lg'
        }`}
      ref={videoContainerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={`${isFullscreen ? 'h-[90%] max-h-[90vh]' : 'aspect-video'} bg-gradient-to-br from-upskilleo-dark-purple to-black relative`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <video 
            ref={videoRef}
            src={sampleVideoUrl}
            className={`w-full h-full object-cover opacity-95 transition-transform duration-1000 ease-in-out transform hover:scale-105 ${isFullscreen ? 'object-contain' : 'object-cover'}`}
            poster="https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&w=800&q=80"
            controls={false}
            playsInline
            muted={isMuted}
            autoPlay={false}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            preload="auto"
          />
          
          {!isPlaying && !showKeyMomentModal && (
            <Button 
              onClick={togglePlayback}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary/90 hover:bg-primary rounded-full w-20 h-20 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <Play size={36} fill="white" className="ml-1" />
            </Button>
          )}
        </div>

        {showKeyMomentModal && currentKeyMoment && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-8 animate-fade-in max-h-screen overflow-y-auto">
            <div className="bg-card max-w-lg w-full rounded-lg border border-primary/20 p-6 shadow-xl">
              <div className="flex items-center mb-3 text-primary">
                <Info className="h-5 w-5 mr-2" />
                <h3 className="text-xl font-bold">Coding Challenge</h3>
              </div>
              <p className="mb-4">{currentKeyMoment.challenge}</p>
              
              <div className="bg-muted p-3 rounded-md text-sm font-mono mb-4 border-l-2 border-primary">
                <p><span className="text-primary font-semibold">Hint:</span> {currentKeyMoment.hints[0]}</p>
              </div>
              
              <div className="flex justify-between gap-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={handleSkipChallenge}
                  className="flex-1"
                >
                  Continue Video
                </Button>
                <Button 
                  onClick={handleContinue} 
                  className="flex-1 relative overflow-hidden group"
                >
                  <Code className="mr-2 h-4 w-4" />
                  <span>Try Challenge</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent px-4 py-6 transition-opacity duration-300 z-[10002] ${
            isHovering || !isPlaying ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative h-3 bg-white/20 rounded-full overflow-visible mb-4 mx-2">
            <div 
              className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
            
            {keyMoments?.map(moment => (
              <div
                key={moment.id}
                className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-transparent hover:w-7 hover:h-7 transition-all duration-300 cursor-pointer z-10 flex items-center justify-center"
                style={{ 
                  left: `${(moment.timeInSeconds / duration) * 100}%`,
                  marginLeft: '-12px'
                }}
                title={`Challenge: ${moment.challenge}`}
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = moment.timeInSeconds;
                    setCurrentTime(moment.timeInSeconds);
                  }
                }}
              >
                <Circle 
                  size={16} 
                  className="text-primary/70 hover:text-primary hover:scale-110 transition-all" 
                  strokeWidth={2.5} 
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-wrap px-2 w-full overflow-visible">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20 h-9 w-9 rounded-full transition-transform hover:scale-110"
                onClick={togglePlayback}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20 h-9 w-9 rounded-full transition-transform hover:scale-110"
                onClick={() => {
                  setCurrentTime(prev => Math.min(prev + 10, duration));
                  if (videoRef.current) {
                    videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
                  }
                  if (currentTime + 10 >= duration) {
                    setVideoCompleted(true);
                    onComplete();
                  }
                }}
              >
                <SkipForward size={20} />
              </Button>
              
              <div className="text-white text-sm flex items-center gap-1 min-w-[80px]">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            
            
            
            <div className="flex-grow px-2 hidden sm:block">
              <Slider
                value={[currentTime]}
                min={0}
                max={duration}
                step={1}
                onValueChange={(value) => {
                  handleSeek(value);
                  if (videoRef.current) {
                    videoRef.current.currentTime = value[0];
                  }
                }}
                className="cursor-pointer"
              />
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20 h-9 w-9 rounded-full transition-transform hover:scale-110"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </Button>
              
              <div className="w-20 hidden sm:block">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="cursor-pointer"
                />
              </div>
              
              {onToggleFullscreen && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/20 h-9 w-9 rounded-full transition-transform hover:scale-110"
                  onClick={onToggleFullscreen}
                >
                  {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-white/70 mt-1 px-2 sm:hidden">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseVideoPlayer;
