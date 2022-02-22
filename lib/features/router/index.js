const { getFilesFormDir } = require('../../utils');

async function invokeRouter() {
  const routerTemplate = await getFilesFormDir(__dirname);

  return {
    ...routerTemplate,
    pkg: {
      dependencies: {
        'react-router': '^6.2.1',
      },
    },
  };
}

module.exports = invokeRouter;
