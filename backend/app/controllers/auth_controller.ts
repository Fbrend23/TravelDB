// import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import mail from '@adonisjs/mail/services/main'
import router from '@adonisjs/core/services/router'
import string from '@adonisjs/core/helpers/string'
import env from '#start/env'

export default class AuthController {
  //post auth/register
  public async register({ request, response }: HttpContext) {
    //data fetch
    const payload = await request.validateUsing(registerValidator)
    try {
      //account creation
      const user = await User.create(payload)

      // generate signed url
      const verifyUrl = router.makeSignedUrl(
        'verifyEmail',
        { id: user.id },
        {
          expiresIn: '30m',
          prefixUrl: env.get('APP_URL'),
        }
      )

      // send mail
      await mail.send((message) => {
        message
          .to(user.email)
          .subject('Veuillez vérifier votre adresse e-mail')
          .htmlView('emails/verify_email', { url: verifyUrl })
      })

      return response.created({
        message: `Merci pour votre inscription ${user.username}, vérifiez votre adresse e-mail pour activer votre compte`,
      })
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY' || error.code === '1062' || error.code === '23000') {
        return response.conflict({
          message: 'Email ou nom d’utilisateur déjà pris.',
        })
      }

      console.error("Erreur inattendue lors de l'inscription:", error)
      return response.internalServerError({
        message: 'Une erreur interne est survenue',
      })
    }
  }

  //POST auth/login
  public async login({ request, response, auth }: HttpContext) {
    //validation of email and password
    const { email, password } = await request.validateUsing(loginValidator)
    //verification of email and password
    const user = await User.verifyCredentials(email, password)

    if (!user) {
      return response.unauthorized({ message: 'Identifiants invalides' })
    }

    if (!user.isVerified) {
      return response.forbidden({
        message: 'Veuillez vérifier votre adresse e-mail avant de vous connecter.',
        code: 'EMAIL_NOT_VERIFIED',
      })
    }

    try {
      //create session
      await auth.use('web').login(user)
      return response.ok({
        message: 'Connecté',
      })
    } catch {
      return response.unauthorized({
        message: 'Identifiants incorrects',
      })
    }
  }

  //GET auth/me
  public async me({ auth, response }: HttpContext) {
    // push user infos
    const user = auth.use('web').user
    if (!user) {
      return response.unauthorized()
    }
    return response.ok({ id: user!.id, email: user!.email, username: user!.username })
  }
  // POST auth/logout
  public async logout({ auth, response, session }: HttpContext) {
    await auth.use('web').logout()
    session.clear()
    response.clearCookie('traveldb')

    return response.ok({ message: 'Déconnecté' })
  }
  public async verifyEmail({ request, response, params }: HttpContext) {
    const frontendUrl = env.get('WEB_URL')

    // Verify if url is valide
    if (!request.hasValidSignature()) {
      return response.redirect(`${frontendUrl}/login?message=invalid_link&variant=danger`)
    }

    // find user
    const user = await User.find(params.id)
    if (!user) {
      return response.redirect(`${frontendUrl}/login?message=user_not_found&variant=danger`)
    }

    // check if not already verified
    if (user.isVerified) {
      return response.redirect(`${frontendUrl}/login?message=already_verified&variant=info`)
    }

    // user is verified
    user.emailVerifiedAt = DateTime.now()
    await user.save()
    return response.redirect(`${frontendUrl}/login?message=verified_success&variant=success`)
  }

  public async resendVerification({ request, response }: HttpContext) {
    const email = request.input('email')
    const user = await User.findBy('email', email)

    if (!user) {
      return response.notFound({ message: 'Aucun compte associé à cet email.' })
    }

    if (user.isVerified) {
      return response.badRequest({ message: 'Ce compte est déjà vérifié.' })
    }

    const verifyUrl = router.makeSignedUrl(
      'verifyEmail',
      { id: user.id },
      {
        expiresIn: '30m',
        prefixUrl: env.get('APP_URL'),
      }
    )

    await mail.send((message) => {
      message
        .to(user.email)
        .subject('Nouveau lien de vérification')
        .htmlView('emails/verify_email', { url: verifyUrl })
    })

    return response.ok({ message: 'Un nouvel e-mail de vérification a été envoyé.' })
  }

  //password change request
  public async forgotPassword({ request, response }: HttpContext) {
    const email = request.input('email')
    const user = await User.findBy('email', email)

    if (!user) {
      return response.ok({ message: 'Si cet email existe, un lien a été envoyé.' })
    }
    //create a token with expiration date
    const token = string.random(64)
    user.resetToken = token

    user.resetTokenExpiresAt = DateTime.now().plus({ hours: 1 })
    await user.save()

    // link to frontend
    const frontendUrl = env.get('WEB_URL')
    const resetLink = `${frontendUrl}/reset-password?token=${token}&email=${email}`

    await mail.send((message) => {
      message
        .to(user.email)
        .subject('Réinitialisation de votre mot de passe')
        .htmlView('emails/reset_password', { url: resetLink, username: user.username })
    })

    return response.ok({ message: 'Si cet email existe, un lien a été envoyé.' })
  }

  // reset of password
  public async resetPassword({ request, response }: HttpContext) {
    const { token, email, password } = request.all()

    // compare user with token
    const user = await User.query()
      .where('email', email)
      .where('reset_token', token)
      .where('reset_token_expires_at', '>', DateTime.now().toSQL())
      .first()

    if (!user) {
      return response.badRequest({ message: 'Ce lien est invalide ou a expiré.' })
    }
    try {
      user.password = password
      // clean token
      user.resetToken = null
      user.resetTokenExpiresAt = null
      await user.save()
      return response.ok({ message: 'Mot de passe modifié avec succès.' })
    } catch (error) {
      return response.badRequest({ message: 'Erreur lors de la modification du mot de passe.' })
    }
  }
  public async verifyResetToken({ request, response }: HttpContext) {
    const { email, token } = request.qs()

    if (!email || !token) {
      return response.badRequest({ message: 'Lien invalide (paramètres manquants).' })
    }

    const user = await User.query()
      .where('email', email)
      .where('reset_token', token)
      .where('reset_token_expires_at', '>', DateTime.now().toSQL())
      .first()

    if (!user) {
      return response.notFound({ message: 'Ce lien de réinitialisation est invalide ou a expiré.' })
    }

    return response.ok({ message: 'Token valide.' })
  }
}
