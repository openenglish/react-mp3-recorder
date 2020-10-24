import { useState } from 'react';

import vmsg from './vmsg'

import wasmURL from './vmsg.wasm'

const shimURL = 'https://unpkg.com/wasm-polyfill.js@0.2.0/wasm-polyfill.js'

export function useRecord(onRecordingComplete, onRecordingError) {
  const [status, setStatus] = useState('WIHTOUT_RECORDING');
  const [isRecording, setIsRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);

  const [recorder, setRecorder] = useState(null);

  const cleanup = () => {
    if (recorder) {
      recorder.stopRecording()
      recorder.close()
    }
  }

  const record = () => {
    const _recorder = new vmsg.Recorder({
      wasmURL,
      shimURL
    })

    _recorder.init()
    .then(() => {
      _recorder.startRecording()
      setRecorder(_recorder);
      setIsRecording(true);
    })
    .catch((err) => onRecordingError(err))
  };

  const stop = () => {
    if (recorder) {
      recorder.stopRecording()
        .then((blob) => onRecordingComplete(blob))
        .catch((err) => onRecordingError(err))
      setStatus('RECORDED');
      setRecorded(true);
      setIsRecording(false);
    }
  };

  return {
      record,
      stop,
      isRecording,
      setIsRecording,
      recorded,
      setRecorded,
      status,
    };
}

