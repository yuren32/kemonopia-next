'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    lastName: '',
    firstName: '',
    handleName: '',
    country: '',
    phoneNumber: '',
    birthday: '',
    gender: ''
  })
  const [error, setError] = useState('');

  const handleChange = (name: string, value: string) => {
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.passwordConfirm) {
      setError('パスワードが一致しません。');
      return;
    }
    // TODO: Implement registration logic with Supabase
    console.log('Registration attempt', formData)
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">新規登録</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="password">パスワード</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="passwordConfirm">パスワード確認</Label>
          <Input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={(e) => handleChange('passwordConfirm', e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="lastName">姓</Label>
          <Input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="firstName">名</Label>
          <Input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="handleName">ハンドルネーム</Label>
          <Input
            type="text"
            id="handleName"
            name="handleName"
            value={formData.handleName}
            onChange={(e) => handleChange('handleName', e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="country">国名</Label>
          <Input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="phoneNumber">電話番号</Label>
          <Input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="birthday">誕生日</Label>
          <Input
            type="date"
            id="birthday"
            name="birthday"
            value={formData.birthday}
            onChange={(e) => handleChange('birthday', e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="gender">性別</Label>
          <Select onValueChange={(value) => handleChange('gender', value)}>
            <SelectTrigger>
              <SelectValue placeholder="性別を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">男性</SelectItem>
              <SelectItem value="female">女性</SelectItem>
              <SelectItem value="other">その他</SelectItem>
              <SelectItem value="prefer-not-to-say">回答しない</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full">
          登録
        </Button>
      </form>
      <p className="mt-4 text-center">
        すでにアカウントをお持ちの方は <Link href="/login" className="text-primary hover:underline">こちらからログイン</Link>
      </p>
    </div>
  )
}