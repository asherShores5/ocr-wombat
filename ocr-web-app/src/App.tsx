// src/App.tsx
import { OCRTool } from './components/ui/OCRTool';

function App() {
  return (
    <div className="w-full min-h-screen bg-[#0a0c14] py-12">
      {/* Subtle radial glow behind the card */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 20%, rgba(217,119,6,0.08) 0%, transparent 70%)',
        }}
      />
      <div className="container mx-auto px-4 relative">
        <OCRTool />
      </div>
    </div>
  );
}

export default App;