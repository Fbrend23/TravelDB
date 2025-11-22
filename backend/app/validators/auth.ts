import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    password: vine.string().minLength(8).maxLength(512),
    email: vine.string().email(),
  })
)
export const registerValidator = vine.compile(
  vine.object({
    username: vine
      .string()
      .minLength(3)
      .maxLength(32)
      .regex(/^[a-zA-Z0-9]+$/)
      .unique(async (query, field) => {
        const user = await query.from('users').where('username', field).first()
        return !user
      }),
    password: vine.string().minLength(8).maxLength(512),
    email: vine.string().email(),
  })
)

vine.messagesProvider = new SimpleMessagesProvider({
  'username.required': 'Le nom d’utilisateur est obligatoire.',
  'username.minLength': 'Le nom d’utilisateur doit faire au minimum 3 caractères.',
  'username.maxLength': 'Le nom d’utilisateur ne peut pas dépasser 32 caractères.',
  'username.regex': 'Le nom d’utilisateur ne peut contenir que des lettres et chiffres.',
  'username.unique': 'Ce nom d’utilisateur est déjà utilisé.',

  'email.required': 'L’adresse email est obligatoire.',
  'email.email': 'Veuillez saisir une adresse email valide.',

  'password.required': 'Le mot de passe est obligatoire.',
  'password.minLength': 'Le mot de passe doit faire au minimum 8 caractères.',
  'password.maxLength': 'Le mot de passe ne peut pas dépasser 512 caractères.',
})
