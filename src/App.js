import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import './App.css';
import { Box, Button, FormControl, Input, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import MicIcon from '@mui/icons-material/Mic';

const useStyles = makeStyles({
  containerStyle: {
    width: 500,
  },
});

function App() {
  const classes = useStyles();
    const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const [inputTransate, setInputTranslate] = useState()
  const [output, setOutput] = useState('');
  const [to, setTo] = useState('hi');
  const [from, setFrom] = useState('en');
  const [options, setOptions] = useState([]);
  const handleTranslator = () => {
    const params = new URLSearchParams();
    params.append('q', inputTransate);
    params.append('source', from);
    params.append('target', to);
    params.append('api_key', 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

    axios.post('https://libretranslate.de/translate',params, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then(res=>{
      // console.log(res.data)
      setOutput(res.data.translatedText)
    })
  }
  useEffect(() => {
    axios
      .get('https://libretranslate.de/languages', {
        headers: { accept: 'application/json' },
      })
      .then((res) => {
        // console.log(res.data);
        setOptions(res.data);
      });
  }, []);

  useEffect(() => {
    setInputTranslate(transcript)
    console.log("value",inputTransate)
  }, [transcript])
  const resetInputFields = ()=>{
    setInputTranslate('');
    setOutput('');
  }
  return (
    <Box className="App">
      <Box>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-select-small">From</InputLabel>
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            value={from}
            label="Age"
            onChange={(e) => setFrom(e.target.value)}          >
            {options.map((lang) => {
              return (
              <MenuItem 
              key={lang.code} value={lang.code}
              >{lang.name}</MenuItem>
              )
            })
            }
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-select-small">To</InputLabel>
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            value={to}
            onChange={(e) => setTo(e.target.value)}          >
            {options.map((lang) => {
              return (
              <MenuItem 
              key={lang.code} value={lang.code}
              >{lang.name}</MenuItem>
              )
            })
            }
          </Select>
        </FormControl>
      </Box>
      <Box >
      <Box> 
       
      <button onClick={SpeechRecognition.startListening}><MicIcon/>{listening?'Please Speak':''} </button>
      <button onClick={()=>resetInputFields()}>Reset</button>
      </Box>  
        <FormControl sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">{`Translate From-${from}`}</InputLabel>
          <OutlinedInput
            value={inputTransate}
            onChange={(e) => { setInputTranslate(e.target.value) }}
            label={`Translate From-${from}`}
            style={{ width: '700px', height: '200px' }}
          />
        </FormControl>  
         </Box>
      <Box>
        <FormControl sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">{`Translated To-${to}`}</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            value={output}
            style={{ width: '700px', height: '200px' }}
            label={`Translated To${to}`}
          />
        </FormControl>
      </Box>
      <Box sx={{ m: 1 }}>
        <Button variant="contained" onClick={() => { handleTranslator() }}>
          Translate
        </Button>
      </Box>
    </Box>
  );
}

export default App;
