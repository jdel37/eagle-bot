
import { useRef, useState } from 'react';
import { Button } from "@nextui-org/react";
import video from './assets/MrMascadedo.mp4'
import annyang from 'annyang'
import { FaMicrophoneAlt } from "react-icons/fa";

const sharedStyles = 'border p-2 font-semibold'

function App() {
  const videoRef = useRef(null);
  const [userText, setUserText] = useState('')
  const [speaking, setSpeaking] = useState(false)
  const [listening, setListening] = useState(false)

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
    voz.cancel()
    annyang.addCommands(commands);

    if (listening) {
      annyang.abort()
      setListening(false)

    } else {
      annyang.start()
      setListening(true)


    }
  }

  // Get answer
  const handleGetAnswer = () => {
    annyang.abort()
    setListening(false)
    videoRef.current && videoRef.current.play()
    fetch("https://google.serper.dev/search", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
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
      <Button onClick={handleAsk} color="success" className={` w-12 h-12  rounded-full`}><FaMicrophoneAlt className='h-10 w-10' /></Button>

      <div className='flex flex-col w-full mx-auto'>
        {listening && !userText &&
          <div>
            <p className=" w-8 h-8 border-t-4 border-green-600 rounded-full animate-spin mx-auto"></p>
            <p className='text-green-600 text-lg'>Listening...</p>
          </div>
        }
        {userText && <div>
          <p className='text-default-500 text-lg my-4'> You said: {userText}  </p>
          <Button onClick={handleGetAnswer} color="primary" className={sharedStyles}>Get answer</Button>
          <Button onClick={handleStopAnswer} color="danger" className={sharedStyles}>Stop answering</Button>
        </div>}
      </div>

    </div>
  )
}

export default App