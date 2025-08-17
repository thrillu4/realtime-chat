import { zodResolver } from '@hookform/resolvers/zod'
import {
	Eye,
	EyeOff,
	Loader2,
	Lock,
	Mail,
	MessageSquare,
	User,
} from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import AuthImagePattern from '../components/AuthImagePattern'
import { useAuthStore } from '../store/useAuthStore'
import { SignUpSchema, type SignUpType } from '../types'
const SignUp = () => {
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<SignUpType>({
		resolver: zodResolver(SignUpSchema),
	})
	const { isSigningUp, signUp } = useAuthStore()
	const [showPassword, setShowPassword] = useState(false)
	const [formData, setFormData] = useState<SignUpType>({
		fullName: '',
		email: '',
		password: '',
	})

	const onSubmit = () => {
		signUp(formData)
	}

	return (
		<div className='min-h-screen grid lg:grid-cols-2'>
			{/* left side */}
			<div className='flex flex-col justify-center items-center p-6 sm:p-12'>
				<div className='w-full max-w-md space-y-8'>
					<div className='text-center mb-8'>
						<div className='flex flex-col items-center gap-2 group'>
							<div
								className='size-12 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors'
							>
								<MessageSquare className='size-6 text-primary' />
							</div>
							<h1 className='text-2xl font-bold mt-2'>Create Account</h1>
							<p className='text-base-content/60'>
								Get started with your free account
							</p>
						</div>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
						<div className='form-control'>
							<label htmlFor='fullName' className='label'>
								<span className='label-text font-medium'>Full Name</span>
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 '>
									<User className='size-5 text-base-content/40' />
								</div>
								<input
									id='fullName'
									{...register('fullName')}
									type='text'
									className={`input input-bordered w-full pl-10`}
									placeholder='John Doe'
									value={formData.fullName}
									onChange={(e) =>
										setFormData({ ...formData, fullName: e.target.value })
									}
								/>
							</div>
							{errors.fullName && (
								<div className='text-red-700 text-sm '>
									{errors.fullName.message}
								</div>
							)}
						</div>

						<div className='form-control'>
							<label htmlFor='email' className='label'>
								<span className='label-text font-medium'>Email</span>
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
									<Mail className='size-5 text-base-content/40' />
								</div>
								<input
									{...register('email')}
									id='email'
									type='email'
									className={`input input-bordered w-full pl-10`}
									placeholder='you@example.com'
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
								/>
							</div>
							{errors.email && (
								<div className='text-red-700 text-sm '>
									{errors.email.message}
								</div>
							)}
						</div>

						<div className='form-control'>
							<label htmlFor='password' className='label'>
								<span className='label-text font-medium'>Password</span>
							</label>
							<div className='relative'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
									<Lock className='size-5 text-base-content/40' />
								</div>
								<input
									type={showPassword ? 'text' : 'password'}
									{...register('password')}
									id='password'
									className={`input input-bordered w-full pl-10`}
									placeholder='••••••••'
									value={formData.password}
									onChange={(e) =>
										setFormData({ ...formData, password: e.target.value })
									}
								/>
								<button
									type='button'
									className='absolute inset-y-0 right-0 pr-3 flex items-center'
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<EyeOff className='size-5 text-base-content/40' />
									) : (
										<Eye className='size-5 text-base-content/40' />
									)}
								</button>
							</div>
							{errors.password && (
								<div className='text-red-700 text-sm '>
									{errors.password.message}
								</div>
							)}
						</div>

						<button
							type='submit'
							className='btn btn-primary w-full'
							disabled={isSigningUp}
						>
							{isSigningUp ? (
								<>
									<Loader2 className='size-5 animate-spin' />
									Loading...
								</>
							) : (
								'Create Account'
							)}
						</button>
					</form>

					<div className='text-center'>
						<p className='text-base-content/60'>
							Already have an account?{' '}
							<Link to='/login' className='link link-primary'>
								Sign in
							</Link>
						</p>
					</div>
				</div>
			</div>

			{/* right side */}
			<AuthImagePattern
				title='Join our community'
				subtitle='Connect with friends, share moments, and stay in touch with your loved ones.'
			/>
		</div>
	)
}

export default SignUp
