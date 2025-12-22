/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - fullName
 *         - password
 *         - email
 *         - companyName
 *         - position
 *       properties:
 *         fullName:
 *           type: string
 *           example: Olayemi Joshua
 *         password:
 *           type: string
 *           format: password
 *           example: password123--vb
 *         companyName:
 *           type: string
 *           example: Tay Enterprise
 *         position:
 *           type: string
 *           example: Manager
 *         phoneNo:
 *           type: string
 *           example: "080454545549"
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *
 *     LoginUserRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: password123
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         fullName:
 *           type: string
 *           example: Olayemi Joshua
 *         companyName:
 *           type: string
 *           example: Tay Enterprise
 *         position:
 *           type: string
 *           example: Manager
 *         phoneNo:
 *           type: string
 *           example: "080454545549"
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *
 *     UserResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 201
 *         message:
 *           type: string
 *           example: User created successfully!
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: "#/components/schemas/User"
 *
 *     UserLoginResponse:
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
 *             user:
 *               $ref: "#/components/schemas/User"
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
 *     UserLogoutResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: User successfully logged out!
 *
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *           example: Olayemi Joshua
 *         companyName:
 *           type: string
 *           example: Tay Enterprise
 *         position:
 *           type: string
 *           example: Manager
 *       description: >
 *         At least one field must be provided.
 *
 *     UpdateUserPasswordRequest:
 *       type: object
 *       required:
 *         - password
 *       properties:
 *         password:
 *           type: string
 *           format: password
 *           example: new_password123
 *
 *     DeleteUserResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: User successfully deleted!
 *
 *     UploadAvatarRequest:
 *       type: object
 *       required:
 *         - avatar
 *       properties:
 *         avatar:
 *           type: string
 *           format: binary
 *           description: Avatar image file
 *
 *     UploadAvatarResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: Avatar uploaded successfully!
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: "#/components/schemas/User"
 *             avatarUrl:
 *               type: string
 *               format: uri
 *               example: https://cdn.example.com/avatars/user123.png
 */
