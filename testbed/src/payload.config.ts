import { buildConfig } from 'payload/config';
import path from 'path';
import TodoLists from './collections/TodoLists';
import Users from './collections/Users';
import { swagger } from 'payload-swagger';

export default buildConfig({
  serverURL: 'http://localhost:3000',
  admin: {
    user: Users.slug,
  },
  collections: [TodoLists, Users],
  plugins: [swagger()],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
});
