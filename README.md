# Digit Recognizer Web

Digit Recognizer Web is a React + TypeScript + Vite + TailwindCSS project that loads a TensorFlow.js model and allows drawing digits on a canvas to get predictions.

## Getting Started

1. Clone the repository and navigate into it:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy or export your trained TensorFlow.js model into the `public/model/` directory.
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `public/model/` - Contains the TensorFlow.js model files.
- `src/components/` - React components, including the canvas drawing component.
- `src/App.tsx` - Main application component.
- `src/index.tsx` - Entry point of the React application.
- `tailwind.config.js` - TailwindCSS configuration.

## How it Works

Users can draw digits on a canvas component. The drawing is preprocessed by resizing it to a 28x28 grayscale image suitable for the model. A convolutional neural network (CNN) model loaded with TensorFlow.js then makes digit predictions, which are displayed in real time.

## Tech Stack

- React
- TypeScript
- Vite
- TailwindCSS
- TensorFlow.js
