import { buildConfig, Config } from 'payload/config';
import { defineEndpoint } from '../../src';

const config: Config = {
  collections: [
    {
      slug: 'pages',
      fields: [
        {
          name: 'title',
          type: 'text',
          custom: { description: 'The title of this page' },
        },
      ],
      endpoints: [
        defineEndpoint({
          summary: 'echo',
          description: 'echoes the value',
          path: '/echo/:value',
          method: 'get',
          responseSchema: { type: 'string' },
          handler: (req, res) => {
            const { value } = req.params;
            res.json(value);
          },
        }),
      ],
    },
  ],
};

export default buildConfig(config);
