/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import { throttle, throttleResend } from './limiter.js'
const VisitsController = () => import('#controllers/visits_controller')

router
  .group(() => {
    router.post('/register', [AuthController, 'register']).use(throttle)
    router.post('/login', [AuthController, 'login']).use(throttle)
    router.post('/logout', [AuthController, 'logout']).use(middleware.auth())
    router.get('/me', [AuthController, 'me']).use(middleware.auth())
    router.get('/verify-email/:id', [AuthController, 'verifyEmail']).as('verifyEmail')
    router
      .post('/resend-verification', [AuthController, 'resendVerification'])
      .as('resendVerification')
      .use(throttleResend)
    router.post('/forgot-password', [AuthController, 'forgotPassword']).use(throttleResend)
    router.post('/reset-password', [AuthController, 'resetPassword']).use(throttleResend)
    router.get('/verify-reset-token', [AuthController, 'verifyResetToken']).use(throttleResend)
  })
  .prefix('/auth')

router
  .group(() => {
    router.get('/', [VisitsController, 'list'])
    router.post('/', [VisitsController, 'add'])
    router.delete('/:country', [VisitsController, 'del'])
  })
  .prefix('/visits')
  .use(middleware.auth())
