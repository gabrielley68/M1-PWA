import { useState, useEffect, useRef } from 'react';

function PhotoManager(props){
  const [displayCamera, setDisplayCamera] = useState(false);
  const [videoError, setVideoError] = useState(null);

  const videoRef = useRef(null);

  async function getVideoStream(){
    try {
      const stream = await navigator.mediaDevices.getUserMedia({video: true});
      videoRef.current.srcObject = stream;
    } catch(error){
      setVideoError(error);
    }
  }

  async function takePhoto(){
    const video = videoRef.current;
    // construct an invisible canvas
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    canvas.toBlob(function(blob){
      props.onPhoto(blob);
    })
  }

  useEffect(() => {
    if(displayCamera){
      getVideoStream();
    } else {
      setVideoError(null);
    }
  }, [displayCamera]);

  if(videoError){
    return (
      <div className="text-center m-3">
        Impossible d'accéder à la caméra
      </div>
    );
  }

  if(!displayCamera){
    return (
      <div className="text-center m-3">
        <button className="btn btn-info" onClick={() => setDisplayCamera(true)}>
          Prendre une photo
        </button>
      </div>
    )
  }

  return (
    <div className="text-center">
      <video
        autoPlay ref={videoRef} style={{maxWidth: '80vw'}}
      />
      <div style={{position: 'relative', top: '-4rem'}}>
        <button type="button" style={{
          borderRadius: '50%',
          height: '40px',
          width: '40px',
          backgroundColor: 'red',
          borderColor: '#606060',
          borderStyle: 'solid',
        }} onClick={takePhoto}/>
      </div>
    </div>
  )
}

export default PhotoManager;