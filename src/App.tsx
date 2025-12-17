import { Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import './App.css';

interface InitialData {
  products?: any;
}

function App({ initialData = {} }: { initialData?: InitialData }) {
  return (
    <DataProvider initialData={initialData}>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </main>
      </div>
    </DataProvider>
  );
}

export default App;
