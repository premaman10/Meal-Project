import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIQuery from './pages/AIQuery';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9]">
      <main className="flex-1">
        <AIQuery />
      </main>
    </div>
  );
}
