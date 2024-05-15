import e from "../../dbschema/edgeql-js"

export const createPost = e.params(
  {
    photoUrl: e.str,
    roninId: e.str,
    photoFileName: e.optional(e.str),
    description: e.optional(e.str),
    aiDescription: e.optional(e.str),
    userId: e.optional(e.uuid),
  },
  ({
    photoUrl,
    description,
    userId,
    aiDescription,
    roninId,
    photoFileName,
  }) => {
    const user = e.op(
      e.cast(e.User, userId),
      "if",
      e.op("exists", userId),
      "else",
      e.global.current_user,
    )
    return e.insert(e.Post, {
      photoUrl,
      roninId,
      photoFileName,
      description,
      aiDescription,
      created_by: user,
    })
  },
)

export const createGlobalState = e.params(
  {
    popularDishes: e.optional(e.array(e.str)),
  },
  ({ popularDishes }) => {
    return e.insert(e.GlobalState, {
      popularDishes: e.array_unpack(
        e.op(popularDishes, "??", e.cast(e.array(e.str), e.set())),
      ),
    })
  },
)

export const updateUser = e.params(
  {
    userId: e.optional(e.uuid),
    bio: e.optional(e.str),
    place: e.optional(e.str),
    displayName: e.optional(e.str),
  },
  ({ userId, bio, place, displayName }) => {
    const user = e.op(
      e.cast(e.User, userId),
      "if",
      e.op("exists", userId),
      "else",
      e.global.current_user,
    )
    return e.update(user, (u) => ({
      set: {
        bio: e.op(bio, "??", u.bio),
        place: e.op(place, "??", u.place),
        displayName: e.op(displayName, "??", u.displayName),
      },
    }))
  },
)

export const updateGlobalState = e.params(
  {
    popularDishes: e.optional(e.array(e.str)),
  },
  ({ popularDishes }) => {
    const globalState = e.assert_exists(e.assert_single(e.GlobalState))

    return e.update(globalState, (global) => ({
      set: {
        popularDishes: e.array_unpack(
          e.op(popularDishes, "??", e.cast(e.array(e.str), e.set())),
        ),
      },
    }))
  },
)
