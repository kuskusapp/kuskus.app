using extension auth;
using extension ai;

module default {
  scalar type Role extending enum<admin, user>;
  global current_user := (
    assert_single((
      select User
      filter .identity = global ext::auth::ClientTokenIdentity
    ))
  );
  type User {
    required identity: ext::auth::Identity;
    email: str {
      constraint exclusive;
    };
    githubUsername: str;
    githubAvatarUrl: str;
    # kuskus.app/{name}
    name: str {
      constraint exclusive;
    };
    # pretty name of user (same as X username/name split)
    displayName: str;
    bio: str;
    # ronin url with image
    profilePhotoUrl: str;
    # ronin id for image
    roninId: str;
    # city or country
    place: str;

    # -- links
    createdPosts := .<created_by[is Post];

    # TODO: how roles work, add admin role
    # admin can manage/edit places, they admin over [place-ids]
    userRole: Role {
      default := "user";
    };
    created: datetime {
      rewrite insert using (datetime_of_statement());
    }
    updated: datetime {
      rewrite insert using (datetime_of_statement());
      rewrite update using (datetime_of_statement());
    }
  }
  type Place {
    # i.e. kuskus.app/places/{name}
    required name: str {
      constraint exclusive;
    };
    # pretty name of place
    required displayName: str;
    # TODO: should be geo location (coordinates)
    required location: str; # i.e. Krakow, Poland
    # ronin url with image
    profileImageUrl: str;
    # ronin id for image
    profileImageRoninId: str;
    bio: str;
    # coffee shop, bar, restaurant, etc.
    category: str;
    # i.e. `coffee, pasta, sushi`
    multi foodsAndDrinksServed: str;
    veganFriendly: bool;
    quiet: bool;
    # Place IDs uniquely identify a place in the Google Places database and on Google Maps (https://developers.google.com/maps/documentation/places/web-service/place-id)
    googlePlaceId: str;
    googleMapsUrl: str;
  }
  # kuskus.app/posts/{edgedb-post-uuid}
  type Post {
    # ronin url with image
    required imageUrl: str;
    # ronin id for image
    required roninId: str;
    imageWidth: int16;
    imageHeight: int16;
    imagePreviewBase64Hash: str;

    # needed for seeding TODO: might be not needed (check seed.ts > posts() how it's used)
    imageFileNameFromImport: str {
      constraint exclusive;
    };

    # user entered description for post
    description: str;
    # index fts::index on (
    # fts::with_options(
    #   .description,
    #   language := fts::Language.eng
    #   )
    # );

    # description of image by image model
    aiDescription: str;
    deferred index ext::ai::index(
      embedding_model := 'text-embedding-3-small'
    ) on (.aiDescription);

    # labels for the post
    multi categories: str;

    required created_by: User {
      default := global current_user;
    }
    created: datetime {
      rewrite insert using (datetime_of_statement());
    }
    updated: datetime {
      rewrite insert using (datetime_of_statement());
      rewrite update using (datetime_of_statement());
    }
  }
  # global state for app (not tied to anything)
  type GlobalState extending Singleton {
    # used in / route | TODO: can be computed later on demand
    multi popularDishes: str;
  }
  # context: https://discord.com/channels/841451783728529451/1238513266167386163/1238580664669044817
  abstract type Singleton {
    delegated constraint exclusive on (true);
  }
}
