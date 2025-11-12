import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import CharacterListPage from './pages/CharacterListPage'
import CharacterDetailPage from './pages/CharacterDetailPage'
import './App.css'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="nhan-vat" element={<CharacterListPage />} />
          <Route path="nhan-vat/:id" element={<CharacterDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
