import React from 'react';
import { useApp } from './context/AppContext';
import { EliteCampusMateApp } from './components/EliteCampusMateApp';
import { LoginPage } from './components/LoginPage';
import { ToastContainer } from './components/Toast';
import { HCIPrinciplesModal } from './components/HCIPrinciplesModal';
import { GestureUndoRedoListener } from './components/GestureUndoRedoListener';

export default function App() {
  const { isLoggedIn } = useApp();

  return (
    <>
      {isLoggedIn ? <EliteCampusMateApp /> : <LoginPage />}
      <ToastContainer />
      <HCIPrinciplesModal />
      {isLoggedIn && <GestureUndoRedoListener />}
    </>
  );
}

