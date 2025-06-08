import React, { useState } from 'react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password || !confirmPassword) {
      setError('請輸入帳號、密碼與確認密碼')
      return
    }
    if (password !== confirmPassword) {
      setError('密碼與確認密碼不一致')
      return
    }
    setError('')
    // 這裡可以加上登入邏輯
    alert(`帳號：${username}\n密碼：${password}`)
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100'>
      <form onSubmit={handleSubmit} className='bg-white p-8 rounded shadow-md w-80'>
        <h2 className='text-2xl font-bold mb-6 text-center'>登入</h2>
        <div className='mb-4'>
          <label className='block mb-1 text-gray-700'>帳號</label>
          <input
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300'
            placeholder='請輸入帳號'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-1 text-gray-700'>密碼</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300'
            placeholder='請輸入密碼'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-1 text-gray-700'>確認密碼</label>
          <input
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300'
            placeholder='請再次輸入密碼'
          />
        </div>
        {error && <div className='mb-4 text-red-500 text-sm'>{error}</div>}
        <button type='submit' className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition'>
          登入
        </button>
      </form>
    </div>
  )
}
