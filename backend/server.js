import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import User from "./dbSchema.js";
import { authenticateToken } from "./middleware/auth.js";
import axios from "axios";
import swaggerUi from "swagger-ui-express";
import specs from "./swagger.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173", // Vite dev server
  "http://localhost:3000", // Local development
  "https://carzy.vercel.app", // Production
  "https://www.carzy.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400, // 24 hours
  })
);

// Additional headers for extra CORS support
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// connecting to the database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_STRING, {});
    console.log("MongoDB is now connected");

    // Access the 'carzy' database and 'userdata' collection
    const database = mongoose.connection.db;
    global.userData = database.collection("userdata"); // Declare globally for use in routes
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

// Add this helper function at the top
const generateUniqueUrl = (title) => {
  const timestamp = Date.now().toString(36);
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug}-${timestamp}`;
};

const generateShowcaseUrl = (name) => {
  const timestamp = Date.now().toString(36);
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug}-${timestamp}`;
};

// ROUTES

// "/"
app.get("/", (req, res) => {
  res.send("Welcome to Carzy API!");
});

// AUTHENTICATION

//SIGNUP/REGISTER
/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 */
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already registered with Carzy" });
    }

    const showcaseUrl = generateShowcaseUrl(req.body.name);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
      showcaseUrl: showcaseUrl,
    });

    // Create token for immediate login after registration
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// LOGIN

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not Registered with Carzy" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password or Email" });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });

    // Return the token and user name in the response
    res.json({
      token,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create a new car
/**
 * @swagger
 * /api/cars:
 *   get:
 *     summary: Get all cars for authenticated user
 *     tags: [Cars]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of cars
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     summary: Create a new car
 *     tags: [Cars]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               car_type:
 *                 type: string
 *               company:
 *                 type: string
 *               dealer:
 *                 type: string
 *     responses:
 *       201:
 *         description: Car created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
app.post("/api/cars", authenticateToken, async (req, res) => {
  try {
    const { title, description, images, tags, car_type, company, dealer } =
      req.body;

    if (images.length > 10) {
      return res.status(400).json({ message: "Maximum 10 images allowed" });
    }

    const publicUrl = generateUniqueUrl(title);

    const newCar = {
      _id: new mongoose.Types.ObjectId(),
      title,
      description,
      images,
      tags,
      car_type,
      company,
      dealer,
      publicUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { cars: newCar },
        updatedAt: new Date(),
      },
      { new: true }
    );

    res.status(201).json(newCar);
  } catch (error) {
    res.status(500).json({ message: "Failed to create car" });
  }
});

// Get all cars for the authenticated user
app.get("/api/cars", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.cars || []);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cars" });
  }
});

// Get a specific car
app.get("/api/cars/:id", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const car = user.cars.find((car) => car._id.toString() === req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json(car);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch car" });
  }
});

// Update a car
app.put("/api/cars/:id", authenticateToken, async (req, res) => {
  try {
    const { title, description, images, tags, car_type, company, dealer } =
      req.body;

    if (images && images.length > 10) {
      return res.status(400).json({ message: "Maximum 10 images allowed" });
    }

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: req.user._id,
        "cars._id": req.params.id,
      },
      {
        $set: {
          "cars.$.title": title,
          "cars.$.description": description,
          "cars.$.images": images,
          "cars.$.tags": tags,
          "cars.$.car_type": car_type,
          "cars.$.company": company,
          "cars.$.dealer": dealer,
          "cars.$.updatedAt": new Date(),
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    const updatedCar = updatedUser.cars.find(
      (car) => car._id.toString() === req.params.id
    );
    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json(updatedCar);
  } catch (error) {
    res.status(500).json({ message: "Failed to update car" });
  }
});

// Delete a car
app.delete("/api/cars/:id", authenticateToken, async (req, res) => {
  try {
    // Convert string ID to MongoDB ObjectId
    const carId = new mongoose.Types.ObjectId(req.params.id);

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $pull: { cars: { _id: carId } },
        $set: { updatedAt: new Date() },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Failed to delete car" });
  }
});

// Add this new endpoint before your other routes
app.get("/api/public/cars", async (req, res) => {
  try {
    const users = await User.find({});
    const allCars = users.reduce((acc, user) => {
      return acc.concat(user.cars || []);
    }, []);

    // Sort by newest first
    allCars.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(allCars);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cars" });
  }
});

app.get("/api/public/cars/:publicUrl", async (req, res) => {
  try {
    const user = await User.findOne({ "cars.publicUrl": req.params.publicUrl });
    if (!user) {
      return res.status(404).json({ message: "Car not found" });
    }

    const car = user.cars.find((car) => car.publicUrl === req.params.publicUrl);
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch car" });
  }
});

// Get showcase by name
app.get("/api/showcase/:name", async (req, res) => {
  try {
    const decodedName = decodeURIComponent(req.params.name);
    const user = await User.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${decodedName}$`, "i") } }, // Case-insensitive exact match
        { showcaseUrl: decodedName },
      ],
    });

    if (!user) {
      return res.status(404).json({
        message: `Showcase not found for '${decodedName}'`,
      });
    }

    // Ensure cars array exists and is valid
    const cars = user.cars || [];

    // Send only necessary user data and cars
    res.json({
      name: user.name,
      showcaseUrl: user.showcaseUrl,
      cars: cars.map((car) => ({
        _id: car._id,
        title: car.title,
        description: car.description,
        images: car.images || [],
        tags: car.tags || [],
        car_type: car.car_type,
        company: car.company,
      })),
    });
  } catch (error) {
    console.error("Showcase error:", error);
    res.status(500).json({ message: "Failed to load showcase" });
  }
});

// Add this endpoint to handle Lexica API requests
app.get("/api/proxy/lexica", async (req, res) => {
  try {
    const { q } = req.query;
    const response = await axios.get(
      `https://lexica.art/api/v1/search?q=${encodeURIComponent(q)}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Lexica API error:", error);
    res.status(500).json({
      message: "Failed to fetch images",
      error: error.message,
    });
  }
});

// API Documentation route
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs));

// Start Server
connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
