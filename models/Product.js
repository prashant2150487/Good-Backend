import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true
  },
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  collections: {
    type: [String],
    default: null
  },
  collection: {
    type: String,
    default: null
  },
  plpImages: {
    type: [String],
    default: []
  },
  plpSliderImages: {
    type: [String],
    default: []
  },
  priceRecords: {
    INR: { type: String, required: true },
    USD: { type: String, required: true },
    GBP: { type: String, required: true },
    SGD: { type: String, required: true },
    AED: { type: String, required: true }
  },
  discountedPriceRecords: {
    INR: { type: String, required: true },
    USD: { type: String, required: true },
    GBP: { type: String, required: true },
    SGD: { type: String, required: true },
    AED: { type: String, required: true }
  },
  discount: {
    type: Boolean,
    default: false
  },
  categories: {
    type: [String],
    default: []
  },
  isNew: {
    type: Boolean,
    default: null
  },
  salesBadgeImage: {
    type: String,
    default: ''
  },
  badgeType: {
    type: String,
    default: ''
  },
  markAs: {
    type: String,
    default: null
  },
  childAttributes: [{
    size: { type: String, required: true },
    stock: { type: Number, required: true },
    sku: { type: String, required: true },
    priceRecords: {
      INR: { type: String, required: true },
      USD: { type: String, required: true },
      GBP: { type: String, required: true },
      SGD: { type: String, required: true },
      AED: { type: String, required: true }
    },
    color: { type: String, required: true },
    id: { type: Number, required: true },
    discountedPriceRecords: {
      INR: { type: String, required: true },
      USD: { type: String, required: true },
      GBP: { type: String, required: true },
      SGD: { type: String, required: true },
      AED: { type: String, required: true }
    },
    showStockThreshold: { type: Boolean, default: false }
  }],
  productClass: {
    type: String,
    default: 'Others'
  },
  justAddedBadge: {
    type: String,
    default: null
  },
  inStock: {
    type: Boolean,
    default: true
  },
  altText: {
    type: String,
    required: true
  },
  invisibleFields: {
    type: [String],
    default: []
  },
  partner: {
    type: String,
    default: null
  },
  badge_text: {
    type: String,
    default: null
  },
  is3dimage: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Product= mongoose.model('Product', productSchema);
export default Product;