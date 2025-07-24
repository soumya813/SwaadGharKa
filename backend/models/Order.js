const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer is required']
  },
  items: [{
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    specialInstructions: {
      type: String,
      maxlength: 200
    },
    customizations: [{
      name: String,
      option: String,
      extraCost: {
        type: Number,
        default: 0,
        min: 0
      }
    }]
  }],
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    tax: {
      type: Number,
      required: true,
      min: 0
    },
    deliveryFee: {
      type: Number,
      required: true,
      min: 0
    },
    packagingFee: {
      type: Number,
      default: 0,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  deliveryAddress: {
    street: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    pincode: {
      type: String,
      required: true,
      match: [/^[1-9][0-9]{5}$/, 'Please enter a valid Indian pincode']
    },
    landmark: {
      type: String,
      trim: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contactInfo: {
    phone: {
      type: String,
      required: true,
      match: [/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/, 'Please enter a valid Indian phone number']
    },
    alternatePhone: {
      type: String,
      match: [/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/, 'Please enter a valid Indian phone number']
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    }
  },
  orderType: {
    type: String,
    enum: ['delivery', 'pickup'],
    default: 'delivery'
  },
  paymentInfo: {
    method: {
      type: String,
      enum: ['card', 'upi', 'cod', 'wallet'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paymentGateway: {
      type: String,
      enum: ['stripe', 'razorpay', 'paytm', 'phonepe', 'googlepay']
    },
    paidAmount: {
      type: Number,
      min: 0
    },
    paymentDate: Date,
    refundId: String,
    refundAmount: {
      type: Number,
      min: 0
    },
    refundDate: Date
  },
  status: {
    type: String,
    enum: [
      'placed',           // Order placed by customer
      'confirmed',        // Order confirmed by restaurant
      'preparing',        // Food is being prepared
      'ready',           // Food is ready for pickup/delivery
      'out-for-delivery', // Order is out for delivery
      'delivered',        // Order delivered successfully
      'picked-up',        // Order picked up by customer
      'cancelled',        // Order cancelled
      'refunded'         // Order refunded
    ],
    default: 'placed'
  },
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }],
  scheduledDelivery: {
    isScheduled: {
      type: Boolean,
      default: false
    },
    scheduledDate: Date,
    scheduledTime: String
  },
  estimatedDeliveryTime: {
    type: Date
  },
  actualDeliveryTime: {
    type: Date
  },
  preparationTime: {
    estimated: {
      type: Number,
      min: 0
    },
    actual: {
      type: Number,
      min: 0
    }
  },
  specialInstructions: {
    type: String,
    maxlength: 500
  },
  rating: {
    food: {
      type: Number,
      min: 1,
      max: 5
    },
    delivery: {
      type: Number,
      min: 1,
      max: 5
    },
    overall: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  review: {
    type: String,
    maxlength: 500
  },
  deliveryPartner: {
    name: String,
    phone: String,
    vehicleNumber: String
  },
  cancellation: {
    reason: {
      type: String,
      enum: [
        'customer-request',
        'restaurant-unavailable',
        'item-unavailable',
        'payment-failed',
        'delivery-issues',
        'other'
      ]
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: Date,
    refundProcessed: {
      type: Boolean,
      default: false
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ 'paymentInfo.status': 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ estimatedDeliveryTime: 1 });

// Virtual for full delivery address
orderSchema.virtual('fullDeliveryAddress').get(function() {
  if (!this.deliveryAddress) return '';
  
  const { street, city, state, pincode, landmark } = this.deliveryAddress;
  let address = `${street}, ${city}, ${state} - ${pincode}`;
  if (landmark) {
    address = `${street}, ${landmark}, ${city}, ${state} - ${pincode}`;
  }
  return address;
});

// Virtual for order summary
orderSchema.virtual('itemSummary').get(function() {
  return this.items.map(item => `${item.name} x ${item.quantity}`).join(', ');
});

// Virtual for total items count
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for order age in minutes
orderSchema.virtual('orderAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60));
});

// Virtual for delivery status
orderSchema.virtual('isDelivered').get(function() {
  return ['delivered', 'picked-up'].includes(this.status);
});

// Virtual for can cancel
orderSchema.virtual('canCancel').get(function() {
  return ['placed', 'confirmed'].includes(this.status) && 
         this.paymentInfo.status !== 'completed';
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Generate unique order number
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Find the count of orders today
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);
    
    const orderCount = await this.constructor.countDocuments({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    });
    
    const orderSeq = (orderCount + 1).toString().padStart(3, '0');
    this.orderNumber = `SGK${year}${month}${day}${orderSeq}`;
    
    // Add initial status to history
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

// Pre-save middleware to update status history
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

// Pre-save middleware to calculate estimated delivery time
orderSchema.pre('save', function(next) {
  if (this.isNew) {
    // Calculate estimated delivery time based on preparation time + delivery time
    const totalPrepTime = this.items.reduce((total, item) => {
      // Assuming each item has a base prep time, we'll use 15 minutes as default
      return Math.max(total, 15);
    }, 0);
    
    const deliveryTime = this.orderType === 'delivery' ? 30 : 0; // 30 mins for delivery
    const estimatedMinutes = totalPrepTime + deliveryTime;
    
    this.estimatedDeliveryTime = new Date(Date.now() + estimatedMinutes * 60 * 1000);
    this.preparationTime.estimated = totalPrepTime;
  }
  next();
});

// Static method to find orders by customer
orderSchema.statics.findByCustomer = function(customerId) {
  return this.find({ customer: customerId }).sort({ createdAt: -1 });
};

// Static method to find active orders
orderSchema.statics.findActive = function() {
  return this.find({ 
    status: { $nin: ['delivered', 'picked-up', 'cancelled', 'refunded'] },
    isActive: true 
  });
};

// Static method to find orders by status
orderSchema.statics.findByStatus = function(status) {
  return this.find({ status, isActive: true }).sort({ createdAt: -1 });
};

// Static method to get today's orders
orderSchema.statics.getTodaysOrders = function() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  
  return this.find({
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay
    },
    isActive: true
  }).sort({ createdAt: -1 });
};

// Instance method to update status
orderSchema.methods.updateStatus = function(newStatus, updatedBy, notes) {
  this.status = newStatus;
  
  if (updatedBy) {
    this.statusHistory[this.statusHistory.length - 1].updatedBy = updatedBy;
  }
  
  if (notes) {
    this.statusHistory[this.statusHistory.length - 1].notes = notes;
  }
  
  // Set actual delivery time for completed orders
  if (['delivered', 'picked-up'].includes(newStatus)) {
    this.actualDeliveryTime = new Date();
  }
  
  return this.save();
};

// Instance method to calculate total amount
orderSchema.methods.calculateTotal = function() {
  const subtotal = this.items.reduce((total, item) => {
    const itemTotal = item.price * item.quantity;
    const customizationTotal = item.customizations.reduce(
      (customTotal, custom) => customTotal + (custom.extraCost || 0),
      0
    );
    return total + itemTotal + customizationTotal;
  }, 0);
  
  this.pricing.subtotal = subtotal;
  this.pricing.total = subtotal + this.pricing.tax + this.pricing.deliveryFee + 
                      this.pricing.packagingFee - this.pricing.discount;
  
  return this.pricing.total;
};

module.exports = mongoose.model('Order', orderSchema);
