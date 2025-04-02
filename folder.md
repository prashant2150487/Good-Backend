ecommerce-backend/
├── config/
│   ├── database.js         # MongoDB connection setup
│   ├── passport.js         # Authentication configuration
│   └── config.js           # Environment variables and app configuration
├── controllers/
│   ├── admin/
│   │   ├── authController.js      # Admin authentication logic
│   │   ├── productController.js   # Product management for admins
│   │   ├── orderController.js     # Order management for admins
│   │   ├── userController.js      # User management for admins
│   │   └── dashboardController.js # Admin dashboard data
│   └── user/
│       ├── authController.js      # User authentication
│       ├── productController.js   # Product viewing/filtering for users
│       ├── cartController.js      # Cart management
│       ├── orderController.js     # Order placement and history
│       ├── reviewController.js    # Product reviews
│       └── profileController.js   # User profile management
├── middleware/
│   ├── auth.js             # Authentication middleware
│   ├── role.js             # Role-based access control
│   ├── errorHandler.js     # Global error handling
│   ├── validator.js        # Request validation
│   └── rateLimit.js        # API rate limiting
├── models/
│   ├── User.js             # User schema with role differentiation
│   ├── Product.js          # Product schema
│   ├── Category.js         # Category schema
│   ├── Order.js            # Order schema
│   ├── Review.js           # Review schema
│   ├── Cart.js             # Cart schema
│   └── Payment.js          # Payment schema
├── routes/
│   ├── admin/
│   │   ├── auth.js         # Admin authentication routes
│   │   ├── products.js     # Product management routes
│   │   ├── orders.js       # Order management routes
│   │   ├── users.js        # User management routes
│   │   └── dashboard.js    # Admin dashboard routes
│   └── user/
│       ├── auth.js         # User authentication routes
│       ├── products.js     # Product browsing routes
│       ├── cart.js         # Cart routes
│       ├── orders.js       # Order routes
│       ├── reviews.js      # Review routes
│       └── profile.js      # User profile routes
├── services/
│   ├── paymentService.js   # Payment gateway integration
│   ├── emailService.js     # Email notifications
│   ├── storageService.js   # File storage (for product images)
│   ├── searchService.js    # Product search functionality
│   └── cacheService.js     # Data caching
├── utils/
│   ├── logger.js           # Logging utility
│   ├── validators.js       # Input validation helpers
│   ├── helpers.js          # General helper functions
│   └── constants.js        # Application constants
├── tests/
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── e2e/                # End-to-end tests
├── .env                    # Environment variables
├── .env.example            # Example environment variables
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies
├── README.md               # Project documentation
└── server.js               # Main application entry point


// server.js - Main application entry point
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const passport = require('passport');
const { connectDB } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const adminAuthRoutes = require('./routes/admin/auth');
const adminProductRoutes = require('./routes/admin/products');
const adminOrderRoutes = require('./routes/admin/orders');
const adminUserRoutes = require('./routes/admin/users');
const adminDashboardRoutes = require('./routes/admin/dashboard');

const userAuthRoutes = require('./routes/user/auth');
const userProductRoutes = require('./routes/user/products');
const userCartRoutes = require('./routes/user/cart');
const userOrderRoutes = require('./routes/user/orders');
const userReviewRoutes = require('./routes/user/reviews');
const userProfileRoutes = require('./routes/user/profile');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(passport.initialize());
require('./config/passport')(passport);

// API Routes
// Admin routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);

// User routes
app.use('/api/auth', userAuthRoutes);
app.use('/api/products', userProductRoutes);
app.use('/api/cart', userCartRoutes);
app.use('/api/orders', userOrderRoutes);
app.use('/api/reviews', userReviewRoutes);
app.use('/api/profile', userProfileRoutes);

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// config/database.js - MongoDB connection setup
const mongoose = require('mongoose');

exports.connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// config/config.js - Environment variables and app configuration
module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  mongoURI: process.env.MONGO_URI,
  awsRegion: process.env.AWS_REGION,
  awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
  awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3Bucket: process.env.S3_BUCKET,
  emailFrom: process.env.EMAIL_FROM,
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
  redisUrl: process.env.REDIS_URL,
  clientUrl: process.env.CLIENT_URL,
};

// middleware/auth.js - Authentication middleware
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

// models/User.js - User schema with role differentiation
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpire } = require('../config/config');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    phone: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, jwtSecret, {
    expiresIn: jwtExpire,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;

// models/Product.js - Product schema
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a product description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
      min: [0, 'Price must be positive'],
    },
    priceDiscount: {
      type: Number,
      default: 0,
      validate: {
        validator: function (val) {
          return val <= this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Product must belong to a category'],
    },
    subCategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
      },
    ],
    quantity: {
      type: Number,
      required: [true, 'Please add product quantity'],
      min: [0, 'Quantity cannot be negative'],
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: [String],
    mainImage: String,
    colors: [String],
    sizes: [String],
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating must not be more than 5'],
      set: (val) => Math.round(val * 10) / 10, // 4.666666 = 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Product must belong to a user'],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate with reviews
ProductSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
});

// Create slug from name
ProductSchema.pre('save', function (next) {
  this.slug = this.name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-');
  next();
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;

// controllers/admin/authController.js - Admin authentication logic
const User = require('../../models/User');
const asyncHandler = require('../../utils/asyncHandler');

// @desc    Register admin
// @route   POST /api/admin/auth/register
// @access  Private/Admin
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Create admin
  const admin = await User.create({
    name,
    email,
    password,
    role: 'admin',
  });

  sendTokenResponse(admin, 201, res);
});

// @desc    Login admin
// @route   POST /api/admin/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an email and password',
    });
  }

  // Check for user
  const admin = await User.findOne({ email, role: 'admin' }).select('+password');

  if (!admin) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  // Check if password matches
  const isMatch = await admin.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  sendTokenResponse(admin, 200, res);
});

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// routes/admin/auth.js - Admin authentication routes
const express = require('express');
const { register, login } = require('../../controllers/admin/authController');
const { protect, authorize } = require('../../middleware/auth');

const router = express.Router();

router.post('/register', protect, authorize('admin'), register);
router.post('/login', login);

module.exports = router;

// utils/asyncHandler.js - Async handler for clean error handling
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;

// middleware/errorHandler.js - Global error handling
const errorHandler = (err, req, res, next) => {
  console.error(err);

  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = errorHandler;