import e, { type $infer } from "../../dbschema/edgeql-js"

// context: https://discord.com/channels/841451783728529451/1238547782537580754
export const homePublic = e.select(
  e.assert_exists(e.assert_single(e.GlobalState)),
  () => ({
    popularDishes: true,
  }),
)
export type homePublicResturn = $infer<typeof homePublic>

// context: https://discord.com/channels/841451783728529451/1235266238977150976 & https://discord.com/channels/841451783728529451/1235593775447937054 & https://discord.com/channels/841451783728529451/1238547782537580754
export const profileAuth = e.params(
  { userId: e.optional(e.uuid) },
  ({ userId }) => {
    const user = e.op(
      e.cast(e.User, userId),
      "if",
      e.op("exists", userId),
      "else",
      e.global.current_user,
    )
    return e.select(user, () => ({
      name: true,
      bio: true,
      place: true,
      displayName: true,
      profilePhotoUrl: true,
      createdPosts: {
        photoUrl: true,
        description: true,
      },
    }))
  },
)
export type profileAuthReturn = $infer<typeof profileAuth>

export const profilePublic = e.params({ username: e.str }, ({ username }) => {
  return e.select(e.User, (u) => ({
    filter: e.op(u.name, "=", username),
    name: true,
    bio: true,
    place: true,
    profilePhotoUrl: true,
    createdPosts: {
      photoUrl: true,
      description: true,
    },
  }))
})
export type profilePublicReturn = $infer<typeof profilePublic>

export const placesAuth = e.params(
  { placeName: e.str, userId: e.optional(e.uuid) },
  ({ userId, placeName }) => {
    const user = e.op(
      e.cast(e.User, userId),
      "if",
      e.op("exists", userId),
      "else",
      e.global.current_user,
    )
    return e.select(e.Place, (place) => ({
      filter_single: e.op(place.name, "=", placeName),
      name: true,
      displayName: true,
      bio: true,
      category: true,
      profilePhoto: true,
    }))
  },
)
export type placesAuthReturn = $infer<typeof placesAuth>
