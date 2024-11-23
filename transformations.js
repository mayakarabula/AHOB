const contentful = require('contentful-management');
const { camelCase } = require('lodash');
const config = require('./src/config.json');

const client = contentful.createClient({
  accessToken: config.accessToken,
});

const tags = [];

tags.forEach((tag) => {
  client
    .getSpace(config.spaceId)
    .then((space) => space.getEnvironment('master'))
    .then((environment) =>
      environment.createEntryWithId('descriptor', camelCase(tag.name), {
        fields: {
          name: {
            'en-US': tag.name,
          },
          isPositive: {
            'en-US': tag.isPositive,
          },
          category: {
            'en-US': tag.category,
          },
        },
      }),
    )
    .then((entry) => console.log(entry))
    .catch(console.error);
});
