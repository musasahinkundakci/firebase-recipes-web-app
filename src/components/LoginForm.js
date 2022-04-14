import FirebaseAuthService from "../FirebaseAuthService";

import React, { useState } from 'react'

const LoginForm = ({ existingUser }) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await FirebaseAuthService.loginUser(username, password);//cevabı beklememize grek yok çünkü auth change e göndericek çünkü
            setUsername(""); setPassword("");
        } catch (err) {
            alert(err.message);
        }
    }
    async function handleLogout() {
        await FirebaseAuthService.logoutUser();
    }
    async function handleSendResetPasswordLink() {
        if (!username) {
            alert("Missin username!");
            return;
        }
        try {
            await FirebaseAuthService.sendPasswordResetEmail(username);
            alert("Sent the link!")
        } catch (err) {
            console.log(err.message)
        }
    }
    async function handleLoginWithGoogle() {
        try {
            await FirebaseAuthService.loginWithGoogle();
        } catch (err) {
            console.log(err.message)
        }
    }
    return (
        <div className="login-form-container">
            {existingUser ?
                <div className="row">
                    <h3>Welcome, {existingUser.email}</h3>
                    <button type="button" className="primary-button" onClick={handleLogout}>Logout</button>
                </div>
                : (
                    <form onSubmit={handleSubmit} className="login-form">
                        <label className="input-label login-label">
                            Username (email):
                        </label>
                        <input className="input-text" type="email" required value={username} onChange={e => setUsername(e.target.value)} />
                        <label className="input-label login-label">
                            Password:
                        </label>
                        <input className="input-text" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                        <div className="button-box">
                            <button className="primary-button">Login</button>
                            <button className="primary-button" type="button" onClick={handleSendResetPasswordLink} >Reset Password</button>
                            <button className="primary-button" type="button" onClick={handleLoginWithGoogle}>Login With Google</button>
                        </div>
                    </form>
                )}
        </div>
    )
}

export default LoginForm