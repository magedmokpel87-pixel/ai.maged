import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Product: a
    .model({
      slug: a.string().required(),
      name: a.string().required(),
      category: a.string(),
      categoryName: a.string(),
      tagline: a.string(),
      description: a.string(),
      commission: a.string(),
      commissionType: a.string(),
      buyerIntent: a.string(),
      pros: a.string().array(),
      cons: a.string().array(),
      bestFor: a.string(),
      cta: a.string(),
      affiliateLink: a.string(),
      features: a.string().array(),
      published: a.boolean().default(true),
      sortOrder: a.integer().default(0),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.groups(["ADMINS"]).to(["create", "read", "update", "delete"]),
    ]),

  Category: a
    .model({
      slug: a.string().required(),
      name: a.string().required(),
      description: a.string(),
      icon: a.string(),
      sortOrder: a.integer().default(0),
      published: a.boolean().default(true),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.groups(["ADMINS"]).to(["create", "read", "update", "delete"]),
    ]),

  Book: a
    .model({
      slug: a.string().required(),
      title: a.string().required(),
      subtitle: a.string(),
      author: a.string(),
      category: a.string(),
      language: a.string(),
      description: a.string(),
      tags: a.string().array(),
      isbn: a.string(),
      publicationYear: a.integer(),
      format: a.string(),
      coverKey: a.string(),
      fileKey: a.string(),
      externalUrl: a.string(),
      visibility: a.string().default("public"),
      published: a.boolean().default(false),
      featured: a.boolean().default(false),
      sortOrder: a.integer().default(0),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.groups(["ADMINS"]).to(["create", "read", "update", "delete"]),
    ]),

  Ad: a
    .model({
      name: a.string().required(),
      placement: a.string().required(),
      imageKey: a.string(),
      linkUrl: a.string(),
      headline: a.string(),
      active: a.boolean().default(false),
      sortOrder: a.integer().default(0),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.groups(["ADMINS"]).to(["create", "read", "update", "delete"]),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 365,
    },
  },
});
