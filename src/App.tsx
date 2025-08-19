import { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import DrawingPad from './components/DrawingPad';
import ProbBars from "./components/ProbBars"

function App() {
  const [model, setModel] = useState<tf.LayersModel | tf.GraphModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [top, setTop] = useState<number | null>(null);
  const [probs, setProbs] = useState<number[] | null>(null);

  function preprocess(img: ImageData) {
  return tf.tidy(() => {
    const t = tf.browser
    .fromPixels(img, 1)
    .resizeNearestNeighbor([28,28])
    .toFloat()
    .div(255)
    .sub(1).neg()
    .expandDims(0);
    return t;
  })
}

  async function predictFromImage(img: ImageData) {
    if (!model) return;
    const x = preprocess(img);
    const raw = model.predict(x) as tf.Tensor | tf.Tensor[];
    const out: tf.Tensor = Array.isArray(raw) ? raw[0] as tf.Tensor : (raw as tf.Tensor);
    const data = Array.from(await out.data());

    const maxLogit = Math.max(...data);
    const exps = data.map(v => Math.exp(v - maxLogit));
    const sum = exps.reduce((a,b)=>a+b,0);
    const probsArr = exps.map(v => v/sum);

    const bestIdx = probsArr.indexOf(Math.max(...probsArr));
    setTop(bestIdx);
    setProbs(probsArr);

    tf.dispose([x, out]);
  }

  function handleClear() {
    setTop(null);
    setProbs(null);
  }

  useEffect(() => {
    const loadModel = async () => {
      try {
        // Try to load as LayersModel first
        const loadedModel = await tf.loadLayersModel('/model/web_model/model.json');
        setModel(loadedModel);
      } catch (err1) {
        console.warn('LayersModel load failed:', err1);
        try {
          // If that fails, try as GraphModel
          const loadedGraphModel = await tf.loadGraphModel('/model/web_model/model.json');
          setModel(loadedGraphModel);
        } catch (err2) {
          console.error('GraphModel load failed:', err2);
          setError('Failed to load model: unsupported model format or file missing.');
        }
      } finally {
        setLoading(false);
      }
    };
    loadModel();
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 md:py-16 pt-5 pb-16">
      {loading ? (
        <p>Loading model…</p>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
          <strong className="font-bold">Error loading model:</strong>
          <div>{error}</div>
        </div>
      ) : !model ? (
        <div className="text-gray-500 text-sm italic">
          Model is not loaded.
        </div>
      ) : (
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-5">
          <div className="w-full flex flex-col items-center text-center">
            <h1 className='mb-10 text-4xl font-bold text-blue-500'>
            Digit Recognizer!
            </h1>
            <DrawingPad
              onChange={predictFromImage}
              onDrawEnd={predictFromImage}
              onClear={handleClear}
              live
            />
          </div>
          
          <div className="flex flex-col items-center w-full md:mt-0">
            <p className="text-xl mb-2">
              Top guess: <b className='text-blue-500'>{top ?? "—"}</b>
            </p>
            <ProbBars probs={probs} title="Prediction confidence" />
          </div>
        </div>
      )}
      <footer className="mt-10 text-center text-sm text-gray-500">
        Made with <span className="text-red-500">&lt;3</span> by Mahad ·{" "}
        <a
          href="https://www.linkedin.com/in/mahad-hassan/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          LinkedIn
        </a>{" "}
        ·{" "}
        <a
          href="https://github.com/mahadhsn"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          GitHub
        </a>
      </footer>
    </div>
  )
}

export default App
