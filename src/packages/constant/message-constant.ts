// Seeder Service

export const FAILED_TO_SEED_ROLES = 'Failed to seed roles';
export const FAILED_TO_SEED_USERS = 'Failed to seed users';
export const FAILED_TO_SEED_PERMISSIONS = 'Failed to seed permissions';
export const FAILED_TO_LOAD_ASSETS = 'Failed to load assets';

//role

export const ROLE_NOT_FOUND = (name: string) =>
  `Role with name ${name} was not found`;
export const FAILED_TO_FIND_ROLE = 'Failed to find roles';

//User

export const USER_CREATED_SUCCESSFULLY = (id: string) =>
  `User ${id} created successfully `;
export const USER_SUCCESSFULLY_RETRIEVED = 'User successfully retrieved';

export const USER_NOT_FOUND = (email: string) => `User ${email} was not found `;
export const FAILED_TO_DELETE_USER = 'Failed to delete user';
export const USER_DELETED_SUCCESSFULLY = 'User deleted successfully';
export const USER_UPDATED_SUCCESSFULLY = 'User updated successfully';
export const USER_ROLE_UPDATED_SUCCESSFULLY = (id: string) =>
  `User ${id} role updated successfully`;

//Auth

export const FAILED_TO_LOGIN = 'Failed to login';
export const FAILED_TO_GENERATE_REFRESH_TOKEN =
  'Failed to generate refresh token';
export const UNAUTHORIZED_ACCESS = 'Unauthorized access';
export const LOGGED_OUT_SUCCESSFULLY = 'Logged out successfully';
export const FAILED_TO_VIRIFY_TOKEN = 'Failed to verfiy token';
export const TOKEN_HAS_EXPIRED = 'Token has expired';
export const TOKEN_IS_INVALID = 'Token is invalid';
export const PASSWORD_IS_NOT_CORRECT = 'Password is not correct';
export const MISSING_AUTHORIZATION_HEADER = 'Missing Authorization header';
export const INSUFFICIENT_PERMISSIONS = 'Insufficient permissions';

//product

export const PRODUCT_NOT_FOUND = 'Product not found';
export const PRODUCT_DELETED_SUCCESSFULLY = (id: string) =>
  `Product ${id} deleted successfully`;
export const FAILED_TO_DELETE_PRODUCT = 'Failed to delete product';
export const SUCCESSFULLY_RETREIVED_ALL_PRODUCTS =
  'Successfully retrieved all prodcuts';
export const FAILED_TO_RETRIEVE_PRODUCTS_WITH_FILTER =
  'Failed to retrieve product with filter';
export const FAILED_TO_UPDATE_PRODUCT = 'Failed to update product';
export const FAILED_TO_CREATE_PRODUCT = 'Failed to create product';
export const FAILED_TO_RETRIEVE_ALL_PRODUCTS = 'Failed to retrieve products';
