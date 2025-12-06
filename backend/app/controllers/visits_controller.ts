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

    return visits.map((v) => ({ id: v.id, country: v.countryCode, visited_at: v.visitedAt }))
  }

  // POST /visits {contry: 'CHE', visited at: '2023-02-25'}
  public async add({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(visitValidator)

    const userId = auth.user!.id
    const country = payload.country.toUpperCase()

    // Convert and check the date
    const when = payload.visited_at
      ? DateTime.fromJSDate(payload.visited_at)
      : DateTime.utc().startOf('month')

    if (!when.isValid) {
      return response.badRequest({
        message: 'visited_at doit être une date valide.',
      })
    }

    // block same visits at same date
    const sameDate = await Visit.query()
      .where('user_id', userId)
      .andWhere('country_code', country)
      .andWhere('visited_at', when.toJSDate())
      .first()

    if (sameDate) {
      return response.badRequest({
        message: 'Ce pays a déjà été visité à cette date.',
      })
    }

    const visit = await Visit.create({
      userId,
      countryCode: country,
      visitedAt: when.toJSDate(),
    })

    return response.created({
      message: 'Visite ajoutée avec succès.',
      id: visit.id,
      country: visit.countryCode,
      visited_at: visit.visitedAt,
      created: true,
    })
  }
  //DELETE /visits/:id
  public async del({ params, response, auth }: HttpContext) {
    const userId = auth.user!.id
    const visitId = params.id
    const visit = await Visit.query().where('id', visitId).where('user_id', userId).first()

    if (!visit) {
      return response.notFound({ message: 'Visite introuvable ou non autorisée.' })
    }

    await visit.delete()
    return response.ok({ message: 'Visite supprimée' })
  }
}
