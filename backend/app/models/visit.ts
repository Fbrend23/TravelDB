import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Visit extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare countryCode: string

  @column()
  declare visitedAt: Date | null

  //FK
  @column()
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  //Relations
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
