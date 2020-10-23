import { useState } from 'react';

import vmsg from './vmsg'

import wasmURL from './vmsg.wasm'

const shimURL = 'https://unpkg.com/wasm-polyfill.js@0.2.0/wasm-polyfill.js'

export function useRecord(onRecordingComplete, onRecordingError) {
  const [status, setStatus] = useState('WIHTOUT_RECORDING');
  const [isRecording, setIsRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);

  const _recorder = new vmsg.Recorder({
    wasmURL,
    shimURL
  })

  const [recorder, setRecorder] = useState(recorder);

  const cleanup = () => {
    if (recorder) {
      recorder.stopRecording()
      recorder.close()
    }
  }

  const record = () => {
    recorder.init()
    .then(() => {
      recorder.startRecording()
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

