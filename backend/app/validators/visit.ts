import vine from '@vinejs/vine'

export const visitValidator = vine.compile(
  vine.object({
    country: vine
      .string()
      .exists({ table: 'visits', column: 'country_code' })
      .trim()
      .regex(/^[A-Z]{3}$/)
      .transform((v) => v.toUpperCase()),
    visited_at: vine.date({ formats: ['YYYY-MM'] }).optional(),
  })
)
