import React from 'react'
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../components/Input";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";
const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const { resetPassword, error, isLoading, message } = useAuthStore();

	const { token } = useParams();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			alert("Les mots de passe ne correspondent pas.");
			return;
		}
		try {
			await resetPassword(token, password);

			toast.success("Mot de passe réinitialisé avec succès, redirection vers la page de connexion...");
			setTimeout(() => {
				navigate("/login");
			}, 2000);
		} catch (error) {
			console.error(error);
			toast.error(error.message || "Erreur lors de la réinitialisation du mot de passe");
		}
	};

	return (
	<motion.div
	initial={{ opacity: 0, y: 20 }}
	animate={{ opacity: 1, y: 0 }}
	transition={{ duration: 0.5 }}
	className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
>
	<div className='p-8'>
		<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
			Réinitialiser le mot de passe
		</h2>

		{error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
		{message && <p className='text-green-500 text-sm mb-4'>{message}</p>}

		<form onSubmit={handleSubmit}>
			<Input
				icon={Lock}
				type='password'
				placeholder='Nouveau mot de passe'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
			/>

			<Input
				icon={Lock}
				type='password'
				placeholder='Confirmer le nouveau mot de passe'
				value={confirmPassword}
				onChange={(e) => setConfirmPassword(e.target.value)}
				required
			/>

			<motion.button
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
				type='submit'
				disabled={isLoading}
			>
				{isLoading ? "Réinitialisation..." : "Définir un nouveau mot de passe"}
			</motion.button>
		</form>
	</div>
</motion.div>
	);
}

export default ResetPasswordPage
