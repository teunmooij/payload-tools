import path from 'path';
import loadConfig from 'payload/dist/config/load';
import parser from '@apidevtools/swagger-parser';
import type { OpenAPIV3 } from 'openapi-types';

import { createDocument } from '../src';

describe('tests', () => {
  let apiDocs: OpenAPIV3.Document;

  beforeAll(async () => {
    process.env.PAYLOAD_CONFIG_PATH = path.join(__dirname, 'config.ts');
    const config = await loadConfig();
    apiDocs = await createDocument(config);
  });

  it('creates a valid openapi document', async () => {
    await parser.validate(JSON.parse(JSON.stringify(apiDocs)));
  });

  it('creates the expected document', async () => {
    expect(apiDocs).toEqual({
      'openapi': '3.0.3',
      'info': {
        'title': 'payload-openapi',
        'version': expect.any(String),
        'description': 'Create openapi documentation for your payload cms',
        'license': { 'name': 'MIT', 'url': '/api-docs/license' },
      },
      'paths': {
        '/pages': {
          'get': {
            'summary': 'Find paginated Pages',
            'description': 'Find paginated Pages',
            'tags': ['pages'],
            'parameters': [
              {
                'name': 'depth',
                'in': 'query',
                'description': 'number of levels to automatically populate relationships and uploads',
                'schema': { 'type': 'number' },
              },
              {
                'name': 'locale',
                'in': 'query',
                'description': 'retrieves document(s) in a specific locale',
                'schema': { 'type': 'string' },
              },
              {
                'name': 'fallback-locale',
                'in': 'query',
                'description': 'specifies a fallback locale if no locale value exists',
                'schema': { 'type': 'string' },
              },
              { 'name': 'sort', 'in': 'query', 'description': 'sort by field', 'schema': { 'type': 'string' } },
              {
                'name': 'where',
                'in': 'query',
                'description': 'pass a where query to constrain returned documents (complex type, see documentation)',
                'style': 'deepObject',
                'explode': true,
                'allowReserved': true,
                'schema': { '$ref': '#/components/schemas/where' },
              },
              {
                'name': 'limit',
                'in': 'query',
                'description': 'limit the returned documents to a certain number',
                'schema': { 'type': 'number' },
              },
              {
                'name': 'page',
                'in': 'query',
                'description': 'get a specific page of documents',
                'schema': { 'type': 'number' },
              },
            ],
            'responses': { '200': { '$ref': '#/components/responses/pagessResponse' } },
          },
          'post': {
            'summary': 'Create a new Page',
            'description': 'Create a new Page',
            'tags': ['pages'],
            'parameters': [
              {
                'name': 'depth',
                'in': 'query',
                'description': 'number of levels to automatically populate relationships and uploads',
                'schema': { 'type': 'number' },
              },
              {
                'name': 'locale',
                'in': 'query',
                'description': 'retrieves document(s) in a specific locale',
                'schema': { 'type': 'string' },
              },
              {
                'name': 'fallback-locale',
                'in': 'query',
                'description': 'specifies a fallback locale if no locale value exists',
                'schema': { 'type': 'string' },
              },
            ],
            'requestBody': { '$ref': '#/components/requestBodies/pagesRequest' },
            'responses': { '200': { '$ref': '#/components/responses/pagesUpsertConfirmationResponse' } },
          },
          'patch': {
            'summary': 'Update multiple Pages',
            'description': 'Update all Pages matching the where query',
            'tags': ['pages'],
            'parameters': [
              {
                'name': 'sort',
                'in': 'query',
                'description': 'sort by field',
                'schema': { 'type': 'string' },
                'required': false,
              },
              {
                'name': 'where',
                'in': 'query',
                'description': 'pass a where query to constrain returned documents (complex type, see documentation)',
                'style': 'deepObject',
                'explode': true,
                'allowReserved': true,
                'schema': { '$ref': '#/components/schemas/where' },
                'required': true,
              },
              {
                'name': 'limit',
                'in': 'query',
                'description': 'limit the returned documents to a certain number',
                'schema': { 'type': 'number' },
                'required': false,
              },
              {
                'name': 'page',
                'in': 'query',
                'description': 'get a specific page of documents',
                'schema': { 'type': 'number' },
                'required': false,
              },
              {
                'name': 'depth',
                'in': 'query',
                'description': 'number of levels to automatically populate relationships and uploads',
                'schema': { 'type': 'number' },
              },
              {
                'name': 'locale',
                'in': 'query',
                'description': 'retrieves document(s) in a specific locale',
                'schema': { 'type': 'string' },
              },
              {
                'name': 'fallback-locale',
                'in': 'query',
                'description': 'specifies a fallback locale if no locale value exists',
                'schema': { 'type': 'string' },
              },
            ],
            'requestBody': { '$ref': '#/components/requestBodies/pagesRequest' },
            'responses': { '200': { '$ref': '#/components/responses/pagesBulkResponse' } },
          },
          'delete': {
            'summary': 'Delete multiple Pages',
            'description': 'Delete all Pages matching the where query',
            'tags': ['pages'],
            'security': [{ 'basicAuth': [], 'cookieAuth': [] }],
            'parameters': [
              {
                'name': 'sort',
                'in': 'query',
                'description': 'sort by field',
                'schema': { 'type': 'string' },
                'required': false,
              },
              {
                'name': 'where',
                'in': 'query',
                'description': 'pass a where query to constrain returned documents (complex type, see documentation)',
                'style': 'deepObject',
                'explode': true,
                'allowReserved': true,
                'schema': { '$ref': '#/components/schemas/where' },
                'required': true,
              },
              {
                'name': 'limit',
                'in': 'query',
                'description': 'limit the returned documents to a certain number',
                'schema': { 'type': 'number' },
                'required': false,
              },
              {
                'name': 'page',
                'in': 'query',
                'description': 'get a specific page of documents',
                'schema': { 'type': 'number' },
                'required': false,
              },
              {
                'name': 'depth',
                'in': 'query',
                'description': 'number of levels to automatically populate relationships and uploads',
                'schema': { 'type': 'number' },
              },
              {
                'name': 'locale',
                'in': 'query',
                'description': 'retrieves document(s) in a specific locale',
                'schema': { 'type': 'string' },
              },
              {
                'name': 'fallback-locale',
                'in': 'query',
                'description': 'specifies a fallback locale if no locale value exists',
                'schema': { 'type': 'string' },
              },
            ],
            'responses': { '200': { '$ref': '#/components/responses/pagesBulkResponse' } },
          },
        },
        '/pages/{id}': {
          'get': {
            'summary': 'Get a single Page by its id',
            'description': 'Get a single Page by its id',
            'tags': ['pages'],
            'parameters': [
              { 'name': 'id', 'in': 'path', 'description': 'id of the Page', 'required': true, 'schema': { 'type': 'string' } },
              {
                'name': 'depth',
                'in': 'query',
                'description': 'number of levels to automatically populate relationships and uploads',
                'schema': { 'type': 'number' },
              },
              {
                'name': 'locale',
                'in': 'query',
                'description': 'retrieves document(s) in a specific locale',
                'schema': { 'type': 'string' },
              },
              {
                'name': 'fallback-locale',
                'in': 'query',
                'description': 'specifies a fallback locale if no locale value exists',
                'schema': { 'type': 'string' },
              },
              { 'name': 'sort', 'in': 'query', 'description': 'sort by field', 'schema': { 'type': 'string' } },
              {
                'name': 'where',
                'in': 'query',
                'description': 'pass a where query to constrain returned documents (complex type, see documentation)',
                'style': 'deepObject',
                'explode': true,
                'allowReserved': true,
                'schema': { '$ref': '#/components/schemas/where' },
              },
              {
                'name': 'limit',
                'in': 'query',
                'description': 'limit the returned documents to a certain number',
                'schema': { 'type': 'number' },
              },
              {
                'name': 'page',
                'in': 'query',
                'description': 'get a specific page of documents',
                'schema': { 'type': 'number' },
              },
            ],
            'responses': {
              '200': { '$ref': '#/components/responses/pagesResponse' },
              '404': { '$ref': '#/components/responses/NotFoundErrorResponse' },
            },
          },
          'patch': {
            'summary': 'Updates a Page',
            'description': 'Updates a Page',
            'tags': ['pages'],
            'parameters': [
              { 'name': 'id', 'in': 'path', 'description': 'id of the Page', 'required': true, 'schema': { 'type': 'string' } },
              {
                'name': 'depth',
                'in': 'query',
                'description': 'number of levels to automatically populate relationships and uploads',
                'schema': { 'type': 'number' },
              },
              {
                'name': 'locale',
                'in': 'query',
                'description': 'retrieves document(s) in a specific locale',
                'schema': { 'type': 'string' },
              },
              {
                'name': 'fallback-locale',
                'in': 'query',
                'description': 'specifies a fallback locale if no locale value exists',
                'schema': { 'type': 'string' },
              },
            ],
            'requestBody': { '$ref': '#/components/requestBodies/pagesRequest' },
            'responses': {
              '200': { '$ref': '#/components/responses/pagesUpsertConfirmationResponse' },
              '404': { '$ref': '#/components/responses/NotFoundErrorResponse' },
            },
          },
          'delete': {
            'summary': 'Deletes an existing Page',
            'description': 'Deletes an existing Page',
            'tags': ['pages'],
            'security': [{ 'basicAuth': [], 'cookieAuth': [] }],
            'parameters': [
              { 'name': 'id', 'in': 'path', 'description': 'id of the Page', 'required': true, 'schema': { 'type': 'string' } },
              {
                'name': 'depth',
                'in': 'query',
                'description': 'number of levels to automatically populate relationships and uploads',
                'schema': { 'type': 'number' },
              },
              {
                'name': 'locale',
                'in': 'query',
                'description': 'retrieves document(s) in a specific locale',
                'schema': { 'type': 'string' },
              },
              {
                'name': 'fallback-locale',
                'in': 'query',
                'description': 'specifies a fallback locale if no locale value exists',
                'schema': { 'type': 'string' },
              },
            ],
            'responses': {
              '200': { '$ref': '#/components/responses/pagesUpsertConfirmationResponse' },
              '404': { '$ref': '#/components/responses/NotFoundErrorResponse' },
            },
          },
        },
        '/pages/hello': {
          'get': {
            'summary': 'custom operation',
            'description': 'custom operation',
            'tags': ['pages'],
            'parameters': [],
            'responses': {
              '200': {
                'description': 'succesful operation',
                'content': { 'application/json': { 'schema': { 'type': 'object' } } },
              },
            },
          },
        },
        '/users': {
          'get': {
            'summary': 'Find paginated Users',
            'description': 'Find paginated Users',
            'tags': ['users'],
            'security': [{ 'basicAuth': [], 'cookieAuth': [] }],
            'parameters': [
              {
                'name': 'depth',
                'in': 'query',
                'description': 'number of levels to automatically populate relationships and uploads',
                'schema': { 'type': 'number' },
              },
              {
                'name': 'locale',
                'in': 'query',
                'description': 'retrieves document(s) in a specific locale',
                'schema': { 'type': 'string' },
              },
              {
                'name': 'fallback-locale',
                'in': 'query',
                'description': 'specifies a fallback locale if no locale value exists',
                'schema': { 'type': 'string' },
              },
              { 'name': 'sort', 'in': 'query', 'description': 'sort by field', 'schema': { 'type': 'string' } },
              {
                'name': 'where',
                'in': 'query',
                'description': 'pass a where query to constrain returned documents (complex type, see documentation)',
                'style': 'deepObject',
                'explode': true,
                'allowReserved': true,
                'schema': { '$ref': '#/components/schemas/where' },
              },
              {
                'name': 'limit',
                'in': 'query',
                'description': 'limit the returned documents to a certain number',
                'schema': { 'type': 'number' },
              },
              {
                'name': 'page',
                'in': 'query',
                'description': 'get a specific page of documents',
                'schema': { 'type': 'number' },
              },
            ],
            'responses': { '200': { '$ref': '#/components/responses/userssResponse' } },
          },
          'post': {
            'summary': 'Create a new User',
            'description': 'Create a new User',
            'tags': ['users'],
            'security': [{ 'basicAuth': [], 'cookieAuth': [] }],
            'parameters': [
              {
                'name': 'depth',
                'in': 'query',
                'description': 'number of levels to automatically populate relationships and uploads',
                'schema': { 'type': 'number' },
              },
              {
                'name': 'locale',
                'in': 'query',
                'description': 'retrieves document(s) in a specific locale',
                'schema': { 'type': 'string' },
              },
              {
                'name': 'fallback-locale',
                'in': 'query',
                'description': 'specifies a fallback locale if no locale value exists',
                'schema': { 'type': 'string' },
              },
            ],
            'requestBody': { '$ref': '#/components/requestBodies/usersRequest' },
            'responses': { '200': { '$ref': '#/components/responses/usersUpsertConfirmationResponse' } },
          },
          'patch': {
            'summary': 'Update multiple Users',
            'description': 'Update all Users matching the where query',
            'tags': ['users'],
            'security': [{ 'basicAuth': [], 'cookieAuth': [] }],
            'parameters': [
              {
                'name': 'sort',
                'in': 'query',
                'description': 'sort by field',
                'schema': { 'type': 'string' },
                'required': false,
              },
              {
                'name': 'where',
                'in': 'query',
                'description': 'pass a where query to constrain returned documents (complex type, see documentation)',
                'style': 'deepObject',
                'explode': true,
                'allowReserved': true,
                'schema': { '$ref': '#/components/schemas/where' },
                'required': true,
              },
              {
                'name': 'limit',
                'in': 'query',
                'description': 'limit the returned documents to a certain number',
                'schema': { 'type': 'number' },
                'required': false,
              },
              {
                'name': 'page',
                'in': 'query',
                'description': 'get a specific page of documents',
                'schema': { 'type': 'number' },
                'required': false,
              },
              {
                'name': 'depth',
                'in': 'query',
                'description': 'number of levels to automatically populate relationships and uploads',
                'schema': { 'type': 'number' },
              },
              {
                'name': 'locale',
                'in': 'query',
                'description': 'retrieves document(s) in a specific locale',
                'schema': { 'type': 'string' },
              },
              {
                'name': 'fallback-locale',
                'in': 'query',
                'description': 'specifies a fallback locale if no locale value exists',
                'schema': { 'type': 'string' },
              },
            ],
            'requestBody': { '$ref': '#/components/requestBodies/usersRequest' },
            'responses': { '200': { '$ref': '#/components/responses/usersBulkResponse' } },
          },
          'delete': {
            'summary': 'Delete multiple Users',
            'description': 'Delete all Users matching the where query',
            'tags': ['users'],
            'security': [{ 'basicAuth': [], 'cookieAuth': [] }],
            'parameters': [
              {
                'name': 'sort',
                'in': 'query',
                'description': 'sort by field',
                'schema': { 'type': 'string' },
                'required': false,
              },
              {
                'name': 'where',
                'in': 'query',
                'description': 'pass a where query to constrain returned documents (complex type, see documentation)',
                'style': 'deepObject',
                'explode': true,
                'allowReserved': true,
                'schema': { '$ref': '#/components/schemas/where' },
                'required': true,
              },
              {
                'name': 'limit',
                'in': 'query',
                'description': 'limit the returned documents to a certain number',
                'schema': { 'type': 'number' },
                'required': false,
              },
              {
                'name': 'page',
                'in': 'query',
                'description': 'get a specific page of documents',
                'schema': { 'type': 'number' },
                'required': false,
              },
              {
                'name': 'depth',
                'in': 'query',
                'description': 'number of levels to automatically populate relationships and uploads',
                'schema': { 'type': 'number' },
              },
              {
                'name': 'locale',
                'in': 'query',
                'description': 'retrieves document(s) in a specific locale',
                'schema': { 'type': 'string' },
              },
              {
                'name': 'fallback-locale',
                'in': 'query',
                'description': 'specifies a fallback locale if no locale value exists',
                'schema': { 'type': 'string' },
              },
            ],
            'responses': { '200': { '$ref': '#/components/responses/usersBulkResponse' } },
          },
        },
        '/users/{id}': {
          'get': {
            'summary': 'Get a single User by its id',
            'description': 'Get a single User by its id',
            'tags': ['users'],
            'security': [{ 'basicAuth': [], 'cookieAuth': [] }],
            'parameters': [
              { 'name': 'id', 'in': 'path', 'description': 'id of the User', 'required': true, 'schema': { 'type': 'string' } },
              {
                'name': 'depth',
                'in': 'query',
                'description': 'number of levels to automatically populate relationships and uploads',
                'schema': { 'type': 'number' },
              },
              {
                'name': 'locale',
                'in': 'query',
                'description': 'retrieves document(s) in a specific locale',
                'schema': { 'type': 'string' },
              },
              {
                'name': 'fallback-locale',
                'in': 'query',
                'description': 'specifies a fallback locale if no locale value exists',
                'schema': { 'type': 'string' },
              },
              { 'name': 'sort', 'in': 'query', 'description': 'sort by field', 'schema': { 'type': 'string' } },
              {
                'name': 'where',
                'in': 'query',
                'description': 'pass a where query to constrain returned documents (complex type, see documentation)',
                'style': 'deepObject',
                'explode': true,
                'allowReserved': true,
                'schema': { '$ref': '#/components/schemas/where' },
              },
              {
                'name': 'limit',
                'in': 'query',
                'description': 'limit the returned documents to a certain number',
                'schema': { 'type': 'number' },
              },
              {
                'name': 'page',
                'in': 'query',
                'description': 'get a specific page of documents',
                'schema': { 'type': 'number' },
              },
            ],
            'responses': {
              '200': { '$ref': '#/components/responses/usersResponse' },
              '404': { '$ref': '#/components/responses/NotFoundErrorResponse' },
            },
          },
          'patch': {
            'summary': 'Updates a User',
            'description': 'Updates a User',
            'tags': ['users'],
            'security': [{ 'basicAuth': [], 'cookieAuth': [] }],
            'parameters': [
              { 'name': 'id', 'in': 'path', 'description': 'id of the User', 'required': true, 'schema': { 'type': 'string' } },
              {
                'name': 'depth',
                'in': 'query',
                'description': 'number of levels to automatically populate relationships and uploads',
                'schema': { 'type': 'number' },
              },
              {
                'name': 'locale',
                'in': 'query',
                'description': 'retrieves document(s) in a specific locale',
                'schema': { 'type': 'string' },
              },
              {
                'name': 'fallback-locale',
                'in': 'query',
                'description': 'specifies a fallback locale if no locale value exists',
                'schema': { 'type': 'string' },
              },
            ],
            'requestBody': { '$ref': '#/components/requestBodies/usersRequest' },
            'responses': {
              '200': { '$ref': '#/components/responses/usersUpsertConfirmationResponse' },
              '404': { '$ref': '#/components/responses/NotFoundErrorResponse' },
            },
          },
          'delete': {
            'summary': 'Deletes an existing User',
            'description': 'Deletes an existing User',
            'tags': ['users'],
            'security': [{ 'basicAuth': [], 'cookieAuth': [] }],
            'parameters': [
              { 'name': 'id', 'in': 'path', 'description': 'id of the User', 'required': true, 'schema': { 'type': 'string' } },
              {
                'name': 'depth',
                'in': 'query',
                'description': 'number of levels to automatically populate relationships and uploads',
                'schema': { 'type': 'number' },
              },
              {
                'name': 'locale',
                'in': 'query',
                'description': 'retrieves document(s) in a specific locale',
                'schema': { 'type': 'string' },
              },
              {
                'name': 'fallback-locale',
                'in': 'query',
                'description': 'specifies a fallback locale if no locale value exists',
                'schema': { 'type': 'string' },
              },
            ],
            'responses': {
              '200': { '$ref': '#/components/responses/usersUpsertConfirmationResponse' },
              '404': { '$ref': '#/components/responses/NotFoundErrorResponse' },
            },
          },
        },
        '/users/me': {
          'get': {
            'summary': 'Current user data',
            'description': 'Data about the current user',
            'tags': ['auth'],
            'responses': { '200': { '$ref': '#/components/responses/usersMeResponse' } },
          },
        },
        '/users/login': {
          'post': {
            'summary': 'Login',
            'description': 'Login',
            'tags': ['auth'],
            'requestBody': { '$ref': '#/components/requestBodies/loginRequest' },
            'responses': {
              '200': { '$ref': '#/components/responses/usersMeResponse' },
              '401': { '$ref': '#/components/responses/UnauthorizedErrorResponse' },
            },
          },
        },
        '/users/logout': {
          'post': {
            'summary': 'Logout',
            'description': 'Logout',
            'tags': ['auth'],
            'responses': {
              '200': { '$ref': '#/components/responses/confirmationResponse' },
              '400': { '$ref': '#/components/responses/NoUserErrorResponse' },
            },
          },
        },
        '/users/refresh-token': {
          'post': {
            'summary': 'Refresh JWT',
            'description': 'Refresh the JWT token',
            'tags': ['auth'],
            'responses': {
              '200': { '$ref': '#/components/responses/usersMeResponse' },
              '404': { '$ref': '#/components/responses/NotFoundErrorResponse' },
            },
          },
        },
        '/users/unlock': {
          'post': {
            'summary': 'Unlock account',
            'description': 'Unlock account',
            'tags': ['auth'],
            'security': [{ 'basicAuth': [], 'cookieAuth': [] }],
            'requestBody': { '$ref': '#/components/requestBodies/unlockRequest' },
            'responses': { '200': { '$ref': '#/components/responses/confirmationResponse' } },
          },
        },
        '/globals/my-global': {
          'get': {
            'summary': 'Get the My Global',
            'description': 'Get the My Global',
            'tags': ['global my-global'],
            'security': [{ 'basicAuth': [], 'cookieAuth': [] }],
            'parameters': [
              {
                'name': 'depth',
                'in': 'query',
                'description': 'number of levels to automatically populate relationships and uploads',
                'schema': { 'type': 'number' },
              },
              {
                'name': 'locale',
                'in': 'query',
                'description': 'retrieves document(s) in a specific locale',
                'schema': { 'type': 'string' },
              },
              {
                'name': 'fallback-locale',
                'in': 'query',
                'description': 'specifies a fallback locale if no locale value exists',
                'schema': { 'type': 'string' },
              },
            ],
            'responses': { '200': { '$ref': '#/components/responses/my-globalResponse' } },
          },
          'post': {
            'summary': 'Updates the My Global',
            'description': 'Updates the My Global',
            'tags': ['global my-global'],
            'security': [{ 'basicAuth': [], 'cookieAuth': [] }],
            'parameters': [
              {
                'name': 'depth',
                'in': 'query',
                'description': 'number of levels to automatically populate relationships and uploads',
                'schema': { 'type': 'number' },
              },
              {
                'name': 'locale',
                'in': 'query',
                'description': 'retrieves document(s) in a specific locale',
                'schema': { 'type': 'string' },
              },
              {
                'name': 'fallback-locale',
                'in': 'query',
                'description': 'specifies a fallback locale if no locale value exists',
                'schema': { 'type': 'string' },
              },
            ],
            'requestBody': { '$ref': '#/components/requestBodies/my-globalRequest' },
            'responses': { '200': { '$ref': '#/components/responses/my-globalUpsertConfirmationResponse' } },
          },
        },
        '/globals/my-global/greet': {
          'get': {
            'summary': 'custom operation',
            'description': 'custom operation',
            'tags': ['global my-global'],
            'parameters': [],
            'responses': {
              '200': {
                'description': 'succesful operation',
                'content': { 'application/json': { 'schema': { 'type': 'object' } } },
              },
            },
          },
        },
        '/access': {
          'get': {
            'summary': "Current user's resource access",
            'description': "Lists the user's access per resource",
            'tags': ['auth'],
            'security': [{ 'basicAuth': [], 'cookieAuth': [] }],
            'responses': { '200': { '$ref': '#/components/responses/accessResponse' } },
          },
        },
        '/config': {
          'get': {
            'summary': 'custom operation',
            'description': 'custom operation',
            'tags': ['custom'],
            'parameters': [],
            'responses': {
              '200': {
                'description': 'succesful operation',
                'content': { 'application/json': { 'schema': { 'type': 'object' } } },
              },
            },
            'servers': [{ 'url': '' }],
          },
        },
      },
      'components': {
        'securitySchemes': {
          'basicAuth': { 'type': 'http', 'scheme': 'bearer', 'bearerFormat': 'jwt' },
          'cookieAuth': { 'in': 'cookie', 'type': 'apiKey', 'name': 'payload-token' },
        },
        'schemas': {
          'error': {
            'title': 'Error response message',
            'type': 'object',
            'additionalProperties': false,
            'properties': {
              'errors': {
                'type': 'array',
                'items': {
                  'type': 'object',
                  'additionalProperties': false,
                  'properties': { 'message': { 'type': 'string' } },
                  'required': ['message'],
                },
              },
            },
            'required': ['errors'],
          },
          'confirmation': {
            'title': 'Confirmation response message',
            'type': 'object',
            'additionalProperties': false,
            'properties': { 'message': { 'type': 'string' } },
            'required': ['message'],
          },
          'where': {
            'title': 'Where clause',
            'type': 'object',
            'additionalProperties': {
              'anyOf': [
                { 'type': 'object', 'properties': { 'equals': {} }, 'additionalProperties': false },
                { 'type': 'object', 'properties': { 'not_equals': {} }, 'additionalProperties': false },
                {
                  'type': 'object',
                  'properties': { 'greater_than': { 'anyOf': [{ 'type': 'string' }, { 'type': 'number' }] } },
                  'additionalProperties': false,
                },
                {
                  'type': 'object',
                  'properties': { 'greater_than_equal': { 'anyOf': [{ 'type': 'string' }, { 'type': 'number' }] } },
                  'additionalProperties': false,
                },
                {
                  'type': 'object',
                  'properties': { 'less_than': { 'anyOf': [{ 'type': 'string' }, { 'type': 'number' }] } },
                  'additionalProperties': false,
                },
                {
                  'type': 'object',
                  'properties': { 'less_than_equal': { 'anyOf': [{ 'type': 'string' }, { 'type': 'number' }] } },
                  'additionalProperties': false,
                },
                { 'type': 'object', 'properties': { 'like': { 'type': 'string' } }, 'additionalProperties': false },
                { 'type': 'object', 'properties': { 'contains': { 'type': 'string' } }, 'additionalProperties': false },
                { 'type': 'object', 'properties': { 'in': { 'type': 'string' } }, 'additionalProperties': false },
                { 'type': 'object', 'properties': { 'not_in': { 'type': 'string' } }, 'additionalProperties': false },
                { 'type': 'object', 'properties': { 'exists': { 'type': 'boolean' } }, 'additionalProperties': false },
                { 'type': 'object', 'properties': { 'near': { 'type': 'string' } }, 'additionalProperties': false },
              ],
            },
            'properties': {
              'or': { 'type': 'array', 'items': { '$ref': '#/components/schemas/where' } },
              'and': { 'type': 'array', 'items': { '$ref': '#/components/schemas/where' } },
            },
            'example': {
              'or': [
                { 'color': { 'equals': 'mint' } },
                { 'and': [{ 'color': { 'equals': 'white' } }, { 'featured': { 'equals': false } }] },
              ],
            },
          },
          'access': {
            'title': 'Access',
            'type': 'object',
            'additionalProperties': false,
            'properties': {
              'canAccessAdmin': { 'type': 'boolean' },
              'collections': {
                'type': 'object',
                'additionalProperties': {
                  'type': 'object',
                  'additionalProperties': false,
                  'properties': {
                    'create': {
                      'type': 'object',
                      'additionalProperties': false,
                      'properties': { 'permission': { 'type': 'boolean' } },
                      'required': ['permission'],
                    },
                    'read': {
                      'type': 'object',
                      'additionalProperties': false,
                      'properties': { 'permission': { 'type': 'boolean' } },
                      'required': ['permission'],
                    },
                    'update': {
                      'type': 'object',
                      'additionalProperties': false,
                      'properties': { 'permission': { 'type': 'boolean' } },
                      'required': ['permission'],
                    },
                    'delete': {
                      'type': 'object',
                      'additionalProperties': false,
                      'properties': { 'permission': { 'type': 'boolean' } },
                      'required': ['permission'],
                    },
                    'fields': {
                      'type': 'object',
                      'additionalProperties': {
                        'type': 'object',
                        'additionalProperties': false,
                        'properties': {
                          'create': {
                            'type': 'object',
                            'additionalProperties': false,
                            'properties': { 'permission': { 'type': 'boolean' } },
                            'required': ['permission'],
                          },
                          'read': {
                            'type': 'object',
                            'additionalProperties': false,
                            'properties': { 'permission': { 'type': 'boolean' } },
                            'required': ['permission'],
                          },
                          'update': {
                            'type': 'object',
                            'additionalProperties': false,
                            'properties': { 'permission': { 'type': 'boolean' } },
                            'required': ['permission'],
                          },
                        },
                        'required': ['create', 'read', 'update'],
                      },
                    },
                  },
                  'required': ['create', 'read', 'update', 'delete', 'fields'],
                },
              },
            },
            'required': ['canAccessAdmin', 'collections'],
          },
          'pages': {
            'title': 'Page',
            'type': 'object',
            'additionalProperties': false,
            'properties': {
              'id': { 'type': 'string' },
              'title': { 'type': 'string' },
              'createdAt': { 'type': 'string' },
              'updatedAt': { 'type': 'string' },
            },
            'required': ['id', 'createdAt', 'updatedAt'],
          },
          'pagess': {
            'type': 'object',
            'title': 'Pages',
            'properties': {
              'docs': { 'type': 'array', 'items': { '$ref': '#/components/schemas/pages' } },
              'totalDocs': { 'type': 'number' },
              'limit': { 'type': 'number' },
              'totalPages': { 'type': 'number' },
              'page': { 'type': 'number' },
              'pagingCounter': { 'type': 'number' },
              'hasPrevPage': { 'type': 'boolean' },
              'hasNextPage': { 'type': 'boolean' },
              'prevPage': { 'type': 'number' },
              'nextPage': { 'type': 'number' },
            },
            'required': ['docs', 'totalDocs', 'limit', 'totalPages', 'page', 'pagingCounter', 'hasPrevPage', 'hasNextPage'],
          },
          'pagesUpsertConfirmation': {
            'type': 'object',
            'title': 'Page upsert confirmation',
            'properties': { 'doc': { '$ref': '#/components/schemas/pages' }, 'message': { 'type': 'string' } },
            'required': ['doc', 'message'],
          },
          'users': {
            'title': 'User',
            'type': 'object',
            'additionalProperties': false,
            'properties': {
              'id': { 'type': 'string' },
              'email': { 'type': 'string' },
              'resetPasswordToken': { 'type': 'string' },
              'resetPasswordExpiration': { 'type': 'string' },
              'loginAttempts': { 'type': 'number' },
              'lockUntil': { 'type': 'string' },
              'createdAt': { 'type': 'string' },
              'updatedAt': { 'type': 'string' },
              'password': { 'type': 'string' },
            },
            'required': ['id', 'createdAt', 'updatedAt'],
          },
          'userss': {
            'type': 'object',
            'title': 'Users',
            'properties': {
              'docs': { 'type': 'array', 'items': { '$ref': '#/components/schemas/users' } },
              'totalDocs': { 'type': 'number' },
              'limit': { 'type': 'number' },
              'totalPages': { 'type': 'number' },
              'page': { 'type': 'number' },
              'pagingCounter': { 'type': 'number' },
              'hasPrevPage': { 'type': 'boolean' },
              'hasNextPage': { 'type': 'boolean' },
              'prevPage': { 'type': 'number' },
              'nextPage': { 'type': 'number' },
            },
            'required': ['docs', 'totalDocs', 'limit', 'totalPages', 'page', 'pagingCounter', 'hasPrevPage', 'hasNextPage'],
          },
          'usersUpsertConfirmation': {
            'type': 'object',
            'title': 'User upsert confirmation',
            'properties': { 'doc': { '$ref': '#/components/schemas/users' }, 'message': { 'type': 'string' } },
            'required': ['doc', 'message'],
          },
          'usersMe': {
            'title': 'Me',
            'type': 'object',
            'additionalProperties': false,
            'properties': {
              'user': { '$ref': '#/components/schemas/users', 'nullable': true },
              'token': { 'type': 'string' },
              'exp': { 'type': 'number' },
            },
            'required': ['user'],
          },
          'my-global': {
            'title': 'MyGlobal',
            'type': 'object',
            'additionalProperties': false,
            'properties': { 'id': { 'type': 'string' }, 'title': { 'type': 'string' } },
            'required': ['id'],
          },
          'my-globalUpsertConfirmation': {
            'type': 'object',
            'title': 'My Global upsert confirmation',
            'properties': { 'doc': { '$ref': '#/components/schemas/my-global' }, 'message': { 'type': 'string' } },
            'required': ['doc', 'message'],
          },
        },
        'responses': {
          'InvalidRequestErrorResponse': {
            'description': 'invalid request',
            'content': { 'application/json': { 'schema': { '$ref': '#/components/schemas/error' } } },
          },
          'UnauthorizedErrorResponse': {
            'description': 'unauthorized',
            'content': { 'application/json': { 'schema': { '$ref': '#/components/schemas/error' } } },
          },
          'NotFoundErrorResponse': {
            'description': 'not found',
            'content': { 'application/json': { 'schema': { '$ref': '#/components/schemas/error' } } },
          },
          'confirmationResponse': {
            'description': 'confirmed',
            'content': { 'application/json': { 'schema': { '$ref': '#/components/schemas/confirmation' } } },
          },
          'NoUserErrorResponse': {
            'description': 'no user',
            'content': { 'application/json': { 'schema': { '$ref': '#/components/schemas/error' } } },
          },
          'InvalidTokenErrorResponse': {
            'description': 'invalid token',
            'content': { 'application/json': { 'schema': { '$ref': '#/components/schemas/error' } } },
          },
          'accessResponse': {
            'description': 'ok',
            'content': { 'application/json': { 'schema': { '$ref': '#/components/schemas/access' } } },
          },
          'pagesResponse': {
            'description': 'ok',
            'content': { 'application/json': { 'schema': { '$ref': '#/components/schemas/pages' } } },
          },
          'pagessResponse': {
            'description': 'ok',
            'content': { 'application/json': { 'schema': { '$ref': '#/components/schemas/pagess' } } },
          },
          'pagesUpsertConfirmationResponse': {
            'description': 'ok',
            'content': { 'application/json': { 'schema': { '$ref': '#/components/schemas/pagesUpsertConfirmation' } } },
          },
          'pagesBulkResponse': {
            'description': 'ok',
            'content': {
              'application/json': {
                'schema': {
                  'type': 'object',
                  'properties': {
                    'message': { 'type': 'string' },
                    'errors': { 'type': 'array', 'items': { 'type': 'string' } },
                    'docs': { 'type': 'array', 'items': { '$ref': '#/components/schemas/pages' } },
                  },
                },
              },
            },
          },
          'usersResponse': {
            'description': 'ok',
            'content': { 'application/json': { 'schema': { '$ref': '#/components/schemas/users' } } },
          },
          'userssResponse': {
            'description': 'ok',
            'content': { 'application/json': { 'schema': { '$ref': '#/components/schemas/userss' } } },
          },
          'usersUpsertConfirmationResponse': {
            'description': 'ok',
            'content': { 'application/json': { 'schema': { '$ref': '#/components/schemas/usersUpsertConfirmation' } } },
          },
          'usersBulkResponse': {
            'description': 'ok',
            'content': {
              'application/json': {
                'schema': {
                  'type': 'object',
                  'properties': {
                    'message': { 'type': 'string' },
                    'errors': { 'type': 'array', 'items': { 'type': 'string' } },
                    'docs': { 'type': 'array', 'items': { '$ref': '#/components/schemas/users' } },
                  },
                },
              },
            },
          },
          'usersMeResponse': {
            'description': 'ok',
            'content': { 'application/json': { 'schema': { '$ref': '#/components/schemas/usersMe' } } },
          },
          'my-globalResponse': {
            'description': 'ok',
            'content': { 'application/json': { 'schema': { '$ref': '#/components/schemas/my-global' } } },
          },
          'my-globalUpsertConfirmationResponse': {
            'description': 'ok',
            'content': { 'application/json': { 'schema': { '$ref': '#/components/schemas/my-globalUpsertConfirmation' } } },
          },
        },
        'requestBodies': {
          'loginRequest': {
            'content': {
              'application/json': {
                'schema': {
                  'title': 'Login request',
                  'type': 'object',
                  'additionalProperties': false,
                  'properties': { 'email': { 'type': 'string' }, 'password': { 'type': 'string' } },
                  'required': ['email', 'password'],
                },
              },
            },
          },
          'unlockRequest': {
            'content': {
              'application/json': {
                'schema': {
                  'type': 'object',
                  'additionalProperties': false,
                  'properties': { 'email': { 'type': 'string' } },
                  'required': ['email'],
                },
              },
            },
          },
          'pagesRequest': { 'content': { 'application/json': { 'schema': { '$ref': '#/components/schemas/pages' } } } },
          'usersRequest': { 'content': { 'application/json': { 'schema': { '$ref': '#/components/schemas/users' } } } },
          'my-globalRequest': { 'content': { 'application/json': { 'schema': { '$ref': '#/components/schemas/my-global' } } } },
        },
      },
      'externalDocs': { 'description': 'Payload REST API documentation', 'url': 'https://payloadcms.com/docs/rest-api/overview' },
      'servers': [{ 'url': '/api' }],
    });
  });
});
