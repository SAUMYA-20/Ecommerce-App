# E‑Commerce Application

An advanced e‑commerce web application built with a Node.js/Express/MongoDB backend and a React (Create React App) frontend. The application offers user authentication, product management, cart & wishlist functionalities, order processing with payment integration (Razorpay), and admin features.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User Authentication**  
  Register, login, and account management using JWT-based authentication.
- **Product Management**  
  Create, update, delete, and view single or multiple products. Includes file uploads for photos.

- **Cart & Wishlist**  
  Users can add products to cart or wishlist. Wishlist functionality is secured and requires authentication.

- **Order Processing & Payment Gateway**  
  Integration with Razorpay for order creation, payment verification, and order status updates.

- **Filtering & Search**  
  Browse and filter products by category, price range, and keywords.

- **Admin Features**  
  Manage orders, update order status, and view delivered order details (accessible via protected routes).

---

## Project Structure

```
e-commerce/
├── client/               # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── styles/       # Custom CSS (e.g., ProductDetails.css)
│   │   └── App.js
│   └── README.md         # Frontend README
├── controllers/          # Express controllers (auth, product, order, etc.)
├── models/               # Mongoose models (User, Product, Order, etc.)
├── routes/               # Express route definitions
├── middleware/           # Custom middleware (e.g., authMiddleware.js)
├── server.js             # Express server entry point
├── .env                  # Environment variables
└── package.json          # Project package file (scripts for server)
```

---

## Technology Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Razorpay, and Razorpay Node SDK.
- **Frontend:** React (Create React App), Axios, Ant Design, SweetAlert2.
- **Other:** Razorpay Payment Gateway integration, slugify for URL-friendly strings, and dotenv for environment variable management.

---

## Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/yourusername/e-commerce.git
cd e-commerce
```

### Setup the Backend

1. Install backend dependencies:
   ```bash
   npm install
   ```
2. Create an **.env** file in the project root and add the following (adjust values as needed):
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=8080
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```
3. Start the backend server:
   ```bash
   npm run dev   # or npm start if not using nodemon
   ```

### Setup the Frontend

1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Create a **.env** file in the `client` folder with:
   ```
   REACT_APP_API=http://localhost:8080
   ```
4. Start the React development server:
   ```bash
   npm start
   ```

---

## Environment Variables

- **Backend (.env):**

  - `MONGODB_URI`: MongoDB connection string.
  - `PORT`: Port number for the server (default: 8080).
  - `JWT_SECRET`: Secret key for signing JWT tokens.
  - `RAZORPAY_KEY_ID`: Your Razorpay key ID.
  - `RAZORPAY_KEY_SECRET`: Your Razorpay key secret.

- **Frontend (client/.env):**
  - `REACT_APP_API`: Base URL for your backend API (e.g., http://localhost:8080).

---

## Running the Application

- **Backend:**  
  From the project root, run:
  ```bash
  npm run dev
  ```
- **Frontend:**  
  From the `client` folder, run:
  ```bash
  npm start
  ```

Visit [http://localhost:3000](http://localhost:3000) to use the application.

---

## API Endpoints

Some key API endpoints include:

- **Authentication:**

  - `POST /api/v1/auth/register` – Register user.
  - `POST /api/v1/auth/login` – Login user.
  - `POST /api/v1/auth/forgot-password` – Reset password.

- **Products:**

  - `GET /api/v1/product/get-product/:slug` – Get single product.
  - `GET /api/v1/product/get-products` – Get multiple products.
  - `POST /api/v1/product/create-product` – Create new product.
  - `PUT /api/v1/product/update-product/:pid` – Update product.
  - `DELETE /api/v1/product/delete-product/:pid` – Delete product.
  - Additional endpoints for filtering, searching, and related products.

- **Wishlist:**

  - `GET /api/v1/product/get-wishlist` – Retrieve user's wishlist.
  - `DELETE /api/v1/product/remove-wishlist/:productId` – Remove item from wishlist.

- **Orders & Payments:**
  - `POST /api/v1/order/create-order` – Create new order with Razorpay.
  - `POST /api/v1/order/verify-payment` – Verify payment signature.

_Refer to individual controller files for more details._

---

## Troubleshooting

- **Authentication Issues:**  
  Ensure that every protected route passes through your authentication middleware and that the frontend sends the token with the `Authorization` header.

- **Razorpay Integration:**  
  Verify that your Razorpay API credentials are correct and that the environment variables are properly set.

- **Database Connection:**  
  Make sure your MongoDB URI is valid and your database is running. Check for connection errors in the backend logs.

- **CORS Issues:**  
  If you experience CORS errors, adjust your backend configurations to allow requests from your frontend’s origin.

---

## Contributing

Contributions are welcome!

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Submit a pull request with a clear description of your changes.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

Happy coding!
