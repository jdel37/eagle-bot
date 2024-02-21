
import { useRef, useState } from 'react';
import { Button } from "@nextui-org/react";
import video from './assets/MrMascadedo.mp4'
import annyang from 'annyang'
const sharedStyles = 'border p-2 font-semibold'

function App() {
  const videoRef = useRef(null);
  const [userText, setUserText] = useState('')
  const [speaking, setSpeaking] = useState(false)

  const anything = (anything) => {
    setUserText(anything)
  };
  const [commands] = useState({ '*anything': anything })
  const myHeaders = new Headers();
  let voz = window.speechSynthesis;
  const raw = JSON.stringify({ "q": userText });
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  myHeaders.append("X-API-KEY", "3f2b34bd0c3ba113f147ddf0f27e5fc94bc65870");
  myHeaders.append("Content-Type", "application/json");
  //Event handlers
  const readText = (texto) => {
    let dictator = new SpeechSynthesisUtterance(texto);
    let voices = window.speechSynthesis.getVoices()
    dictator.voice = voices[2]
    dictator.lang = 'en-US';
    dictator.pitch = 1.4
    dictator.onend = () => {
      videoRef.current.pause();
    };
    return voz.speak(dictator);

  }
  // Set question
  const handleAsk = () => {
    annyang.addCommands(commands);
    annyang.start()
  }

  // Get answer
  const handleGetAnswer = () => {
    annyang.abort()
    videoRef.current && videoRef.current.play()
    fetch("https://google.serper.dev/search", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result.organic[0].snippet)
        readText(result.organic[0].snippet)
        return setSpeaking(true)
      })
      .catch(error => console.log('error', error));

  }

  // Stop answering
  const handleStopAnswer = () => {
    console.log(speaking);
    videoRef.current && videoRef.current.pause();
    speaking ? voz.pause() : voz.resume()
    speaking ? videoRef.current.pause() : videoRef.current.play()
    return setSpeaking(prev => !prev)

  }


  return (
    <div className='w-full sm:w-6/12 mx-auto text-bold'>
      <video muted ref={videoRef} className='rounded-xl m-1' src={video}></video>
      <Button onClick={handleAsk} color="success" className={sharedStyles}>Ask a question</Button>
      <Button onClick={handleGetAnswer} color="primary" className={sharedStyles}>Get answer</Button>
      <Button onClick={handleStopAnswer} color="danger" className={sharedStyles}>Stop answering</Button>
      <div className='texting'> {userText}</div>
    </div>
  )
}

export default App