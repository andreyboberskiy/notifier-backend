const config = {
  isDev: process.env.NODE_ENV,
  mixPanel: { token: process.env.MIXPANEL_TOKEN },
  auth: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
  },
  db: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASS,
    database: process.env.POSTGRES_DB,
    logging: true,
    synchronize: true,
    name: 'default',
    entities: [__dirname + '/**/*.entity.ts', __dirname + '/**/*.entity.js'],
    migrations: [
      __dirname + '/migration/**/*.ts',
      __dirname + '/migration/**/*.js',
    ],
  },
};

console.log({ config });

export default config;
