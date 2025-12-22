/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     CreateAdminRequest:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - username
 *         - email
 *         - password
 *       properties:
 *         firstName:
 *           type: string
 *           example: Tayo
 *         lastName:
 *           type: string
 *           example: Yemialao
 *         username:
 *           type: string
 *           example: john343
 *         email:
 *           type: string
 *           format: email
 *           example: admin@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: password123
 *
 *     LoginAdminRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: admin@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: password123
 *
 *     Admin:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         username:
 *           type: string
 *           example: oloaw232
 *         email:
 *           type: string
 *           format: email
 *           example: admin@example.com
 *         role:
 *           type: string
 *           example: admin
 *
 *     AdminResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: Admin created successfully!
 *         data:
 *           type: object
 *           properties:
 *             admin:
 *               $ref: "#/components/schemas/Admin"
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: Login successful
 *         data:
 *           type: object
 *           properties:
 *             admin:
 *               $ref: "#/components/schemas/Admin"
 *             token:
 *               type: string
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Validation failed
 *         errors:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - email is required
 *
 *     LogoutResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: Admin successfully logged out!
 *
 *     UpdateAdminRequest:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           example: Tayo
 *         lastName:
 *           type: string
 *           example: Yemialao
 *         username:
 *           type: string
 *           example: new_username123
 *       description: >
 *         At least one of firstName, lastName, or username must be provided.
 *
 *     UpdateAdminPasswordRequest:
 *       type: object
 *       properties:
 *         password:
 *           type: string
 *           example: new_password123
 *       description: >
 *         password must be provided.
 *
 *     DeleteAdminResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: Admin successfully deleted!
 */
