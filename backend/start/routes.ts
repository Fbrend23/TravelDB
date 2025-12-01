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
const VisitsController = () => import('#controllers/visits_controller')

router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
    router.post('/logout', [AuthController, 'logout']).use(middleware.auth())
    router.get('/me', [AuthController, 'me']).use(middleware.auth())
    router.get('/verify-email/:id', [AuthController, 'verifyEmail']).as('verifyEmail')
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
