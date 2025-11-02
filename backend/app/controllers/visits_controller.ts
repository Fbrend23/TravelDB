// import type { HttpContext } from '@adonisjs/core/http'
import Visit from '#models/visit'
import { HttpContext } from '@adonisjs/core/http'

export default class VisitsController {
  //GET /visits - List of country visited by user
  public async list({ auth }: HttpContext) {
    const userId = await auth.user!.id
    const visits = await Visit.query().where('user_id', userId).orderBy('country_code', 'asc')

    return visits.map((v) => ({ country: v.countryCode, visited_at: v.visitedAt }))
  }

  // POST /visits {contry: 'CHE', visited at: '2023-02-25'}
  public async add({ request, response, auth }: HttpContext) {
    const userId = await auth.user!.id
    const { country, visited_at } = request.only(['country', 'visited_at'])

    if (!country || country.lenght !== 3) {
      return response.badRequest('country doit être ISO alpha-3')
    }

    const visit = await Visit.firstOrCreate(
      { userId, countryCode: country },
      { visitedAt: visited_at ?? (new Date() as any) }
    )
    return response.created({ country: visit.countryCode, visited_at: visit.visitedAt })
  }

  //DELETE /visits/:country
  public async del({ params, response, auth }: HttpContext) {
    const userId = auth.user!.id
    const country = String(params.country || '').toUpperCase()
    const row = await Visit.query().where({ userId, countryCode: country }).first()

    if (!row) return response.notFound()

    await row.delete()

    return { ok: true }
  }
}
