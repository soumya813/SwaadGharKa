const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  console.log('👥 Seeding users...');
  
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = new User({
    name: 'Admin User',
    email: 'admin@swaadgharka.com',
    phone: '+919876543210',
    password: adminPassword,
    role: 'admin',
    address: {
      street: '123 Admin Street',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001'
    },
    emailVerified: true,
    phoneVerified: true
  });

  // Create sample customers
  const customerPassword = await bcrypt.hash('customer123', 12);
  const customers = [
    {
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '+919876543211',
      password: customerPassword,
      address: {
        street: '456 Customer Lane',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110002'
      },
      preferences: {
        dietary: ['vegetarian'],
        spiceLevel: 'medium'
      }
    },
    {
      name: 'Priya Patel',
      email: 'priya@example.com',
      phone: '+919876543212',
      password: customerPassword,
      address: {
        street: '789 Food Street',
        city: 'Gurgaon',
        state: 'Haryana',
        pincode: '122001'
      },
      preferences: {
        dietary: ['vegan'],
        spiceLevel: 'mild'
      }
    }
  ];

  try {
    await User.deleteMany({});
    await User.create([admin, ...customers]);
    console.log('✅ Users seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
};

const seedMenuItems = async () => {
  console.log('🍽️ Seeding menu items...');
  
  const admin = await User.findOne({ role: 'admin' });
  
  const menuItems = [
    // Appetizers
    {
      name: 'Samosa (2 pieces)',
      description: 'Crispy deep-fried pastry filled with spiced potatoes and peas, served with mint and tamarind chutneys',
      price: 40,
      category: 'appetizers',
      cuisine: 'north-indian',
      tags: ['vegetarian', 'crispy', 'traditional'],
      spiceLevel: 'medium',
      preparationTime: 15,
      servingSize: '1 person',
      ingredients: [
        { name: 'Refined flour', quantity: '100g' },
        { name: 'Potatoes', quantity: '200g' },
        { name: 'Green peas', quantity: '50g' },
        { name: 'Spices', quantity: 'as needed' }
      ],
      images: [
        { url: '/images/samosa.jpg', alt: 'Fresh hot samosas', isPrimary: true }
      ],
      isSpecial: false,
      isFeatured: true,
      createdBy: admin._id
    },
    {
      name: 'Paneer Tikka',
      description: 'Grilled cottage cheese cubes marinated in yogurt and spices, served with onions and mint chutney',
      price: 180,
      category: 'appetizers',
      cuisine: 'north-indian',
      tags: ['vegetarian', 'healthy', 'restaurant-style'],
      spiceLevel: 'medium',
      preparationTime: 25,
      servingSize: '1 person',
      ingredients: [
        { name: 'Paneer', quantity: '200g' },
        { name: 'Yogurt', quantity: '100g' },
        { name: 'Bell peppers', quantity: '100g' },
        { name: 'Onions', quantity: '100g' }
      ],
      images: [
        { url: '/images/paneer-tikka.jpg', alt: 'Grilled paneer tikka', isPrimary: true }
      ],
      isSpecial: true,
      isFeatured: true,
      createdBy: admin._id
    },

    // Main Course
    {
      name: 'Butter Chicken',
      description: 'Tender chicken pieces in a rich, creamy tomato-based gravy with butter and cream',
      price: 280,
      category: 'main-course',
      cuisine: 'north-indian',
      tags: ['non-vegetarian', 'creamy', 'comfort-food'],
      spiceLevel: 'mild',
      preparationTime: 35,
      servingSize: '2-3 people',
      ingredients: [
        { name: 'Chicken', quantity: '500g' },
        { name: 'Tomatoes', quantity: '400g' },
        { name: 'Cream', quantity: '100ml' },
        { name: 'Butter', quantity: '50g' }
      ],
      images: [
        { url: '/images/butter-chicken.jpg', alt: 'Creamy butter chicken', isPrimary: true }
      ],
      isSpecial: true,
      isFeatured: true,
      createdBy: admin._id
    },
    {
      name: 'Dal Makhani',
      description: 'Slow-cooked black lentils in a rich, creamy gravy with butter and cream',
      price: 160,
      category: 'dal-curry',
      cuisine: 'north-indian',
      tags: ['vegetarian', 'comfort-food', 'traditional'],
      spiceLevel: 'mild',
      preparationTime: 45,
      servingSize: '2-3 people',
      ingredients: [
        { name: 'Black lentils', quantity: '200g' },
        { name: 'Kidney beans', quantity: '50g' },
        { name: 'Cream', quantity: '100ml' },
        { name: 'Butter', quantity: '30g' }
      ],
      images: [
        { url: '/images/dal-makhani.jpg', alt: 'Rich dal makhani', isPrimary: true }
      ],
      isSpecial: false,
      isFeatured: true,
      createdBy: admin._id
    },

    // Rice & Biryani
    {
      name: 'Chicken Biryani',
      description: 'Aromatic basmati rice layered with spiced chicken, cooked in dum style, served with raita and pickle',
      price: 320,
      originalPrice: 350,
      category: 'rice-biryani',
      cuisine: 'hyderabadi',
      tags: ['non-vegetarian', 'traditional', 'family-pack'],
      spiceLevel: 'medium',
      preparationTime: 60,
      servingSize: '2-3 people',
      ingredients: [
        { name: 'Basmati rice', quantity: '300g' },
        { name: 'Chicken', quantity: '500g' },
        { name: 'Yogurt', quantity: '100g' },
        { name: 'Fried onions', quantity: '100g' }
      ],
      images: [
        { url: '/images/chicken-biryani.jpg', alt: 'Aromatic chicken biryani', isPrimary: true }
      ],
      isSpecial: true,
      isFeatured: true,
      createdBy: admin._id
    },
    {
      name: 'Vegetable Pulao',
      description: 'Fragrant basmati rice cooked with mixed vegetables and whole spices',
      price: 140,
      category: 'rice-biryani',
      cuisine: 'north-indian',
      tags: ['vegetarian', 'healthy', 'home-style'],
      spiceLevel: 'mild',
      preparationTime: 30,
      servingSize: '2-3 people',
      ingredients: [
        { name: 'Basmati rice', quantity: '250g' },
        { name: 'Mixed vegetables', quantity: '200g' },
        { name: 'Whole spices', quantity: 'as needed' }
      ],
      images: [
        { url: '/images/veg-pulao.jpg', alt: 'Colorful vegetable pulao', isPrimary: true }
      ],
      isSpecial: false,
      isFeatured: false,
      createdBy: admin._id
    },

    // Bread & Roti
    {
      name: 'Butter Naan (2 pieces)',
      description: 'Soft, fluffy bread baked in tandoor and brushed with butter',
      price: 60,
      category: 'bread-roti',
      cuisine: 'north-indian',
      tags: ['vegetarian', 'traditional'],
      spiceLevel: 'mild',
      preparationTime: 15,
      servingSize: '1 person',
      ingredients: [
        { name: 'Refined flour', quantity: '150g' },
        { name: 'Yogurt', quantity: '30g' },
        { name: 'Butter', quantity: '20g' }
      ],
      images: [
        { url: '/images/butter-naan.jpg', alt: 'Fresh butter naan', isPrimary: true }
      ],
      isSpecial: false,
      isFeatured: false,
      createdBy: admin._id
    },

    // Beverages
    {
      name: 'Masala Chai',
      description: 'Traditional Indian tea brewed with milk, spices and cardamom',
      price: 25,
      category: 'beverages',
      cuisine: 'north-indian',
      tags: ['vegetarian', 'traditional', 'quick-bite'],
      spiceLevel: 'mild',
      preparationTime: 10,
      servingSize: '1 person',
      ingredients: [
        { name: 'Tea leaves', quantity: '5g' },
        { name: 'Milk', quantity: '150ml' },
        { name: 'Spices', quantity: 'as needed' }
      ],
      images: [
        { url: '/images/masala-chai.jpg', alt: 'Hot masala chai', isPrimary: true }
      ],
      isSpecial: false,
      isFeatured: false,
      createdBy: admin._id
    },
    {
      name: 'Fresh Lime Water',
      description: 'Refreshing lime juice with mint leaves, salt, and a hint of black pepper',
      price: 30,
      category: 'beverages',
      cuisine: 'north-indian',
      tags: ['vegetarian', 'healthy', 'fresh'],
      spiceLevel: 'mild',
      preparationTime: 5,
      servingSize: '1 person',
      ingredients: [
        { name: 'Fresh lime', quantity: '1 piece' },
        { name: 'Mint leaves', quantity: '10g' },
        { name: 'Salt', quantity: 'pinch' }
      ],
      images: [
        { url: '/images/lime-water.jpg', alt: 'Fresh lime water', isPrimary: true }
      ],
      isSpecial: false,
      isFeatured: false,
      createdBy: admin._id
    }
  ];

  try {
    await MenuItem.deleteMany({});
    await MenuItem.create(menuItems);
    console.log('✅ Menu items seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding menu items:', error);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting database seeding...');
    
    await seedUsers();
    await seedMenuItems();
    
    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
