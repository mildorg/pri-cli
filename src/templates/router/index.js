const { getFilesFormDir } = require('../../utils');

async function invokeRouter() {
  const routerTemplate = await getFilesFormDir(__dirname);

  return {
    ...routerTemplate,
    pkg: {
      dependencies: {
        'react-router-dom': '^6.2.1',
      },
    },
  };
}

module.exports = invokeRouter;
