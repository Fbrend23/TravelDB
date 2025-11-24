// import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  //post auth/register
  public async register({ request, response, auth }: HttpContext) {
    //data fetch
    const payload = await request.validateUsing(registerValidator)
    try {
      //account creation
      const user = await User.create(payload)
      //creation of session
      await auth.use('web').login(user)

      return response.created({
        message: `Merci pour votre inscription ${user.username}`,
      })
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY' || error.code === '1062' || error.code === '23000') {
        return response.conflict({
          message: 'Email ou nom d’utilisateur déjà pris.',
        })
      }
    }
  }

  //POST auth/login
  public async login({ request, response, auth }: HttpContext) {
    //validation of email and password
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      //verification of email and password
      const user = await User.verifyCredentials(email, password)
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

    return response.ok({ id: user!.id, email: user!.email, username: user!.username })
  }
  // POST auth/logout
  public async logout({ auth, response, session }: HttpContext) {
    await auth.use('web').logout()
    session.clear()
    response.clearCookie('traveldb')

    return response.ok({ message: 'Déconnecté' })
  }
}
