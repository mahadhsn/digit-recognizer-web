import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

function App() {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel('/model/model.json');
        setModel(loadedModel);
      } catch (error) {
        console.error('Failed to load model', error);
      } finally {
        setLoading(false);
      }
    };

    loadModel();
  }, []);

  return (
    <>
      {loading ? (
        <p>Loading model…</p>
      ) : (
        <p>Model loaded ✅</p>
      )}
      <h1 className="text-4xl font-bold text-blue-500">Hello Tailwind!</h1>
    </>
  )
}

export default App
