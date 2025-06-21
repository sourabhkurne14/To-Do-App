import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/dashboard');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">

                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Signup</h2>
                <form onSubmit={handleSignup} className="space-y-4">

                    <input type="email" placeholder='Enter Email' onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    <br />
                    <input type="password" placeholder='Enter Password' onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    <br />
                    <button type='submit'
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded">Signup</button>

                </form>
                <button onClick={() => navigate('/')} className="mt-4 text-blue-500 hover:underline">
                    Already have an account? Login
                </button>
            </div>
        </div>
    );
}

export default Signup;
