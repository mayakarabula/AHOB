const { writeFileSync } = require('fs');
const { env } = require('process');

writeFileSync(
  './src/config.json',
  JSON.stringify(
    {
        accessToken: env.CF_ACCESS_TOKEN,
        space: env.CF_SPACE_ID,
    }
)
);