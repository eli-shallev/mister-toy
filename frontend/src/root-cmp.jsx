import { Provider } from 'react-redux';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import './assets/css/styles.css';

import { AppFooter } from './cmps/app-footer';
import { AppHeader } from './cmps/app-header';
import { About } from './pages/about';
import { HomePage } from './pages/home-page';
import { ToyDetails } from './pages/toy-details';
import { ToyEdit } from './pages/toy-edit';
import { ToyIndex } from './pages/toy-index';
import { store } from './store/store';

export function App() {
  return (
    <Provider store={store}>
      <Router>
        <section className="main-layout app">
          <AppHeader/>
          <main>
            <Routes>
              <Route element={<HomePage/>} path='/'/>
              <Route element={<About/>} path='/about'/>
              <Route element={<ToyIndex/>} path='/toy'/>
              <Route element={<ToyDetails/>} path='/toy/:toyId'/>
              <Route element={<ToyEdit/>} path='/toy/toy-edit'/>
              <Route element={<ToyEdit/>} path='/toy/toy-edit/:toyId'/>
            </Routes>
          </main>
          <AppFooter/>
        </section>
      </Router>
    </Provider>
  )
}

