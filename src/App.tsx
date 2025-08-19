import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import DrawingPad from './components/DrawingPad';

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
    <div className='fixed inset-0 flex items-center justify-center'>
      {loading ? (
        <p>Loading model…</p>
      ) : (
        <DrawingPad />
      )}
    </div>
  )
}

export default App
