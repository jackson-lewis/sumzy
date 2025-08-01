import { ForgotPasswordUser, UnverifiedUser } from '@/types/user'
import { User } from '@prisma/client'
import { MailOptions } from 'nodemailer/lib/sendmail-transport'
import { transporter } from './nodemailer'

export async function sendUserVerifyEmail(user: UnverifiedUser) {
  const html = `
    <h1>Welcome to Sumzy!</h1>
    <p>Hi ${user.name},</p>
    <p>Thank you for signing up to Sumzy. Please click the link below to verify your email address:</p>
    <a href="${user.emailVerifyLink}">Verify Email</a>`

  const mailOptions: MailOptions = {
    from: 'Sumzy <admin@jacksonlewis.co.uk>',
    to: `${user.name} <${user.email}>`,
    subject: 'Verify Your Email Address',
    html
  }

  try {
    await transporter.sendMail(mailOptions)
    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function sendPasswordResetEmail(user: ForgotPasswordUser) {
  console.log(`Sending password reset email to ${user.email}`)

  const html = `
    <p>Hi ${user.name},</p>
    <p>You've requested to reset your password, click the link below to set a new password.</p>
    <a href="${user.resetPasswordLink}">Reset Password</a>`

  const info = await transporter.sendMail({
    from: 'Sumzy <noreply@jacksonlewis.co.uk>',
    to: `${user.name} <${user.email}>`,
    subject: 'Reset Your Password',
    html
  })

  console.log('Email sent:', info.messageId)
}

export async function sendPasswordResetSuccessEmail(user: User) {
  console.log(`Sending password reset success email to ${user.email}`)

  const html = `
    <p>Hi ${user.name},</p>
    <p>Your password was successfully reset.</p>`

  const info = await transporter.sendMail({
    from: 'Sumzy <noreply@jacksonlewis.co.uk>',
    to: `${user.name} <${user.email}>`,
    subject: 'Your Password Has Been Reset',
    html
  })

  console.log('Email sent:', info.messageId)
}
