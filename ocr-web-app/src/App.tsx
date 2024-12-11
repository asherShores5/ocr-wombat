// src/App.tsx
import { OCRTool } from './components/ui/OCRTool';

function App() {
  return (
    <div className="w-full min-h-screen bg-[#0a0c14] py-8">
      <div className="container mx-auto px-4">
        <OCRTool />
      </div>
    </div>
  );
}

export default App;