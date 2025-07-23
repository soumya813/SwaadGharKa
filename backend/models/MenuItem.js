const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    minlength: [2, 'Item name must be at least 2 characters long'],
    maxlength: [100, 'Item name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Item description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [1, 'Price must be at least ₹1'],
    max: [10000, 'Price cannot exceed ₹10,000']
  },
  originalPrice: {
    type: Number,
    validate: {
      validator: function(v) {
        return !v || v >= this.price;
      },
      message: 'Original price must be greater than or equal to current price'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: [
        'appetizers',
        'main-course',
        'rice-biryani',
        'bread-roti',
        'dal-curry',
        'vegetables',
        'snacks',
        'sweets-desserts',
        'beverages',
        'combo-meals',
        'regional-specials',
        'chef-special'
      ],
      message: '{VALUE} is not a valid category'
    }
  },
  cuisine: {
    type: String,
    required: [true, 'Cuisine type is required'],
    enum: {
      values: [
        'north-indian',
        'south-indian',
        'gujarati',
        'punjabi',
        'bengali',
        'maharashtrian',
        'rajasthani',
        'kerala',
        'tamil',
        'hyderabadi',
        'mughlai',
        'street-food',
        'chinese',
        'continental'
      ],
      message: '{VALUE} is not a valid cuisine type'
    }
  },
  tags: [{
    type: String,
    enum: [
      'vegetarian',
      'vegan',
      'jain',
      'halal',
      'gluten-free',
      'dairy-free',
      'spicy',
      'mild',
      'sweet',
      'tangy',
      'crispy',
      'healthy',
      'comfort-food',
      'traditional',
      'fusion',
      'home-style',
      'restaurant-style',
      'quick-bite',
      'family-pack',
      'single-serve'
    ]
  }],
  spiceLevel: {
    type: String,
    enum: ['mild', 'medium', 'spicy', 'extra-spicy'],
    default: 'medium'
  },
  preparationTime: {
    type: Number,
    required: [true, 'Preparation time is required'],
    min: [5, 'Preparation time must be at least 5 minutes'],
    max: [120, 'Preparation time cannot exceed 120 minutes']
  },
  servingSize: {
    type: String,
    required: [true, 'Serving size is required'],
    enum: ['1 person', '2-3 people', '4-5 people', 'family pack']
  },
  ingredients: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: String,
      required: true
    },
    isAllergen: {
      type: Boolean,
      default: false
    }
  }],
  nutritionalInfo: {
    calories: {
      type: Number,
      min: 0
    },
    protein: {
      type: Number,
      min: 0
    },
    carbs: {
      type: Number,
      min: 0
    },
    fat: {
      type: Number,
      min: 0
    },
    fiber: {
      type: Number,
      min: 0
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    availableDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    availableHours: {
      start: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM']
      },
      end: {
        type: String,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM']
      }
    },
    maxOrdersPerDay: {
      type: Number,
      min: 1,
      default: 100
    },
    currentOrdersToday: {
      type: Number,
      default: 0
    }
  },
  ratings: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  isSpecial: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
menuItemSchema.index({ category: 1, isActive: 1 });
menuItemSchema.index({ cuisine: 1, isActive: 1 });
menuItemSchema.index({ tags: 1 });
menuItemSchema.index({ 'ratings.average': -1 });
menuItemSchema.index({ price: 1 });
menuItemSchema.index({ name: 'text', description: 'text' });
menuItemSchema.index({ isSpecial: 1, isActive: 1 });
menuItemSchema.index({ isFeatured: 1, isActive: 1 });

// Virtual for discount percentage
menuItemSchema.virtual('discountPercentage').get(function() {
  if (!this.originalPrice || this.originalPrice <= this.price) {
    return 0;
  }
  return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
});

// Virtual for primary image
menuItemSchema.virtual('primaryImage').get(function() {
  const primaryImg = this.images.find(img => img.isPrimary);
  return primaryImg || (this.images.length > 0 ? this.images[0] : null);
});

// Virtual for availability status
menuItemSchema.virtual('isCurrentlyAvailable').get(function() {
  if (!this.availability.isAvailable) return false;
  
  const now = new Date();
  const currentDay = now.toLocaleLowerCase().substring(0, 3) + 
                     now.toLocaleLowerCase().substring(3);
  const currentTime = now.getHours().toString().padStart(2, '0') + 
                      ':' + now.getMinutes().toString().padStart(2, '0');
  
  // Check if today is available
  if (this.availability.availableDays.length > 0 && 
      !this.availability.availableDays.includes(currentDay)) {
    return false;
  }
  
  // Check if current time is within available hours
  if (this.availability.availableHours.start && this.availability.availableHours.end) {
    if (currentTime < this.availability.availableHours.start || 
        currentTime > this.availability.availableHours.end) {
      return false;
    }
  }
  
  // Check if daily order limit is reached
  if (this.availability.currentOrdersToday >= this.availability.maxOrdersPerDay) {
    return false;
  }
  
  return true;
});

// Pre-save middleware to update lastModified
menuItemSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastModified = new Date();
  }
  next();
});

// Pre-save middleware to ensure only one primary image
menuItemSchema.pre('save', function(next) {
  const primaryImages = this.images.filter(img => img.isPrimary);
  if (primaryImages.length > 1) {
    // Keep only the first primary image, set others to false
    this.images.forEach((img, index) => {
      if (img.isPrimary && index > 0) {
        img.isPrimary = false;
      }
    });
  } else if (primaryImages.length === 0 && this.images.length > 0) {
    // If no primary image is set, make the first one primary
    this.images[0].isPrimary = true;
  }
  next();
});

// Static method to find available items
menuItemSchema.statics.findAvailable = function() {
  return this.find({ 
    isActive: true,
    'availability.isAvailable': true 
  });
};

// Static method to find by category
menuItemSchema.statics.findByCategory = function(category) {
  return this.find({ 
    category: category,
    isActive: true 
  });
};

// Static method to find featured items
menuItemSchema.statics.findFeatured = function() {
  return this.find({ 
    isFeatured: true,
    isActive: true 
  }).sort({ 'ratings.average': -1 });
};

// Static method to find special items
menuItemSchema.statics.findSpecial = function() {
  return this.find({ 
    isSpecial: true,
    isActive: true 
  }).sort({ createdAt: -1 });
};

// Instance method to update rating
menuItemSchema.methods.updateRating = async function(newRating) {
  const totalRating = (this.ratings.average * this.ratings.count) + newRating;
  this.ratings.count += 1;
  this.ratings.average = totalRating / this.ratings.count;
  return this.save();
};

module.exports = mongoose.model('MenuItem', menuItemSchema);
