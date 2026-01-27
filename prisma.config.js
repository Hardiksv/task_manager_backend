import "dotenv/config";

export default {
  schema: "prisma/schema.prisma",

  datasources: {
    db: {
      url: String(process.env.DATABASE_URL),

    },
  },
};
