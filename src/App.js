import './App.css';
import FirebaseAuthService from './FirebaseAuthService';
import { useState } from 'react';
import LoginForm from './components/LoginForm';
function App() {
  const [user, setUser] = useState(null);
  FirebaseAuthService.subscribeToAuthChanges(setUser);
  return (
    <div className="App">
      <div className="title-row">
        <h1 className="title">Firebase Recipes</h1>
        <LoginForm existingUser={user} />
      </div>
    </div>
  );
}

export default App;
