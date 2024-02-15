
import { useRef, useState } from 'react';
import {  Button } from "@nextui-org/react";
import video from './assets/MrMascadedo.mp4'
import './App.css'
import annyang  from'annyang'

 
function App() {
 
  const [userText, setUserText] = useState('')

  const anything = (anything) =>{
    setUserText(anything)
    console.log(anything);
  };
  const [commands] = useState(
  { '*anything': anything}
  )
  const leerTexto=(texto)=>
  {
    let voz = window.speechSynthesis;

    let dictator = new SpeechSynthesisUtterance(texto);
    let voices = window.speechSynthesis.getVoices()
    dictator.voice=voices[5]
    dictator.lang = 'en-US';
    dictator.pitch=1.4
    voz.speak(dictator);
  }
   
  const videoRef = useRef(null);
  const handleRecord=()=>{
      annyang.addCommands(commands);
      annyang.start()
  }
  const handleStop=()=>{
    if (videoRef.current) {
      videoRef.current.play();
    }
    else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Regresa al inicio del video
    }
    var myHeaders = new Headers();
    myHeaders.append("X-API-KEY", "3f2b34bd0c3ba113f147ddf0f27e5fc94bc65870");
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
      "q": userText
    });
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("https://google.serper.dev/search", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result.organic[0].snippet)
        return leerTexto(result.organic[0].snippet)}) 
      .catch(error => console.log('error', error));
      return annyang.abort()
    
  }
  return (
    <div className='w-full sm:w-6/12 mx-auto '>
      <video muted ref={videoRef} className='rounded-xl m-1' src={video}></video>
      <Button onClick={handleRecord} color="primary" className="border p-2">Start</Button>
      <Button onClick={handleStop} color="danger" className="border p-2">Stop</Button>
      <div className='texting'> {userText}</div>
    </div>
  )
  }

export default App