# BYQR Backend - Unified Backend for Mobile App and Admin Interface

The **BYQR Backend** is the server-side implementation of the BYQR marketplace. It supports both the BYQR mobile application (React Native) and the BYQR admin interface (React web app), enabling eco-conscious and health-conscious individuals to shop for bicycles and related equipment. The backend is built with **Node.js** and **Express.js**, and it integrates with **MongoDB Atlas** and **AWS S3** for data and file storage.

---

## v1.0.0 - Current Features

### API Endpoints
1. **Authentication**:
   - User login and sign-up.
   - Admin role verification via separate middleware.
2. **Product Management**:
   - Fetch all products (accessible to users and admins).
   - Add, edit, and delete products from the product catalogue (admin only).
3. **Cart Management**:
   - Add and remove products in the user's cart.
   - Update product quantities in the cart.
4. **Wishlist Management**:
   - Add and remove products from the user's wishlist.
   - Retrieve the user's wishlist.

### Key Functionalities
- **Authentication & Authorization**:
   - Token-based authentication using **JWT**.
   - Middleware ensures role-based access control.
- **Product Management**:
   - Products stored in **MongoDB Atlas** with details like name, price, description, category, stock, and image URLs.
   - Images are stored in **AWS S3**, with URLs linked in the database.
- **Cart & Wishlist**:
   - Persistent cart and wishlist data tied to user accounts.
- **Unified Backend**:
   - Serves both the React Native app and the React admin interface.

---

## Technology Stack

### Core Technologies
- **Node.js** with **Express.js** for server-side logic.
- **MongoDB Atlas** for database storage.
- **AWS S3** for storing and retrieving product images.
- **Heroku** for backend hosting.

### Key Libraries
- **Mongoose**: Object Data Modeling (ODM) for MongoDB.
- **AWS SDK**: Integration with AWS S3 for image management.
- **bcrypt**: Secure password hashing.
- **jsonwebtoken (JWT)**: Token-based authentication.
- **dotenv**: Secure environment variable management.

---

## Installation & Setup Instructions

### Prerequisites
- **Node.js** and **npm** installed on your system.
- A **MongoDB Atlas** cluster set up.
- An **AWS S3** bucket for image storage.

### Steps to Set Up the Backend Locally

#### 1. Clone the Repository
```bash
$ git clone https://github.com/Illuminatus66/byqr_backend.git
$ cd byqr_backend
```

#### 2. Install Dependencies
```bash
$ npm install
```

#### 3. Configure Environment Variables
- Create a `.env` file in the project root directory with the following variables:
```
PORT=5000
MONGO_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<your-jwt-secret>

AWS_ACCESS_KEY_ID=<your-aws-access-key-id>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key>
AWS_BUCKET_NAME=<your-s3-bucket-name>
```

#### 4. Start the Server
```bash
$ npm start
```
The backend server will start at `http://localhost:5000/`.

---

## API Documentation

### Authentication
- **POST /user/signup**: Register a new user.
- **POST /user/login**: Log in an existing user and return a JWT token.
- **PATCH /user/update/:_id**: Update a user's details
- **POST /user/admin/login**: Log the admin in and return a JWT token.

### Products
- **GET /products/fetchall**: Fetch all available products.
- **POST /products/admin/add**: Add a new product (admin only).
- **PATCH /products/admin/edit**: Edit an existing product (admin only).
- **DELETE /products/admin/delete/:id**: Delete a product (admin only).

### Cart
- **GET /cart/fetch/:user_id**: Retrieve the user's cart.
- **POST /cart/add**: Add a product to the cart.
- **PATCH /cart/update**: Update product quantity in the cart.
- **POST /cart/remove**: Remove a product from the cart.

### Wishlist
- **GET /wishlist/fetch/:user_id**: Retrieve the user's wishlist.
- **POST /wishlist/add**: Add a product to the wishlist.
- **POST /wishlist/remove**: Remove a product from the wishlist.

---

## Deployment

### Hosting on Heroku
1. Log in to your Heroku account and create a new app.
2. Set the environment variables in the Heroku dashboard.
3. Deploy the backend using the Heroku CLI:
```bash
$ heroku login
$ heroku git:remote -a <your-app-name>
$ git push heroku main
```

---

## Future Development (v2.0.0)

### Planned Features
1. **Order Management**:
   - APIs for placing, tracking, and managing orders.
2. **Analytics for Admins**:
   - Add endpoints to fetch analytics data like user activity and order trends.
3. **Payment Gateway Integration**:
   - Integrate APIs for payment processing via **Stripe** or other platforms.

---

## Contributing
Contributions are welcome! If you'd like to improve the backend, open an issue or submit a pull request.

Built with ❤️ for eco-conscious and health-conscious communities.

