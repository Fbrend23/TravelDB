// import type { HttpContext } from '@adonisjs/core/http'
import Visit from '#models/visit'
import { visitValidator } from '#validators/visit'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class VisitsController {
  //GET /visits - List of country visited by user
  public async list({ auth }: HttpContext) {
    const userId = await auth.user!.id
    const visits = await Visit.query().where('user_id', userId).orderBy('country_code', 'asc')

    return visits.map((v) => ({ country: v.countryCode, visited_at: v.visitedAt }))
  }

  // POST /visits {contry: 'CHE', visited at: '2023-02-25'}
  public async add({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(visitValidator)

    const userId = auth.user!.id
    const country = payload.country.toUpperCase()

    // Convert and check the date
    const when = payload.visited_at
      ? DateTime.fromFormat(payload.visited_at + '-01', 'yyyy-MM-dd', { zone: 'utc' })
      : DateTime.utc().startOf('month')

    if (!when.isValid) {
      return response.badRequest({
        message: 'visited_at doit être une date ISO valide (YYYY-MM).',
      })
    }

    // Check if the country is already marked as visited
    const existing = await Visit.query()
      .where('user_id', userId)
      .andWhere('country_code', country)
      .first()

    if (existing) {
      return response.ok({
        message: 'Pays déjà marqué comme visité.',
        country: existing.countryCode,
        visited_at: existing.visitedAt,
        created: false,
      })
    }

    // entry creation
    const visit = await Visit.create({
      userId,
      countryCode: country,
      visitedAt: when.toJSDate(),
    })

    return response.created({
      message: 'Visite ajoutée avec succès.',
      country: visit.countryCode,
      visited_at: visit.visitedAt,
      created: true,
    })
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
