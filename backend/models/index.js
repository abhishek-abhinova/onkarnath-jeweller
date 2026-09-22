const mongoose = require('mongoose');
const { Schema } = mongoose;

const toJSON = {
  virtuals: false,
  versionKey: false,
  transform(_doc, ret) {
    if (ret._id && ret._id.toString) ret._id = ret._id.toString();
    if (ret.updatedAt && ret.updatedAt.toISOString) ret.updatedAt = ret.updatedAt.toISOString();
    if (ret.createdAt && ret.createdAt.toISOString) ret.createdAt = ret.createdAt.toISOString();
    return ret;
  },
};

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin'], default: 'admin' },
  },
  { timestamps: true, toJSON }
);

const productSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    purity: { type: String, default: '' },
    weight: { type: String, default: '' },
    description: { type: String, default: '' },
    images: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON }
);

const categorySchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
  },
  { timestamps: true, toJSON }
);

const rateSchema = new Schema(
  {
    metal: { type: String, required: true, enum: ['gold', 'silver'] },
    purity: { type: String, required: true },
    label: { type: String, default: '' },
    am: { type: Number, default: null },
    pm: { type: Number, default: null },
    unit: { type: String, default: '10g' },
    source: { type: String, default: 'ibja' },
    timestamp: { type: Date, default: Date.now },
    apiUpdatedAt: { type: String, default: '' },
  },
  { timestamps: true, toJSON }
);
rateSchema.index({ metal: 1, purity: 1 }, { unique: true });

const rateHistorySchema = new Schema(
  {
    metal: { type: String, required: true, enum: ['gold', 'silver'] },
    purity: { type: String, required: true },
    am: { type: Number, default: null },
    pm: { type: Number, default: null },
    unit: { type: String, default: '10g' },
    source: { type: String, default: 'ibja' },
  },
  { timestamps: true, toJSON }
);
rateHistorySchema.index({ createdAt: -1 });

const galleryItemSchema = new Schema(
  {
    title: { type: String, trim: true, default: '' },
    image: { type: String, required: true },
    category: { type: String, trim: true, default: '' },
  },
  { timestamps: true, toJSON }
);

const settingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, default: '' },
  },
  { timestamps: true, toJSON }
);

const enquirySchema = new Schema(
  {
    name: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    message: { type: String, default: '' },
    product: { type: String, default: '' },
  },
  { timestamps: true, toJSON }
);

module.exports = {
  User: mongoose.models.User || mongoose.model('User', userSchema),
  Product: mongoose.models.Product || mongoose.model('Product', productSchema),
  Category: mongoose.models.Category || mongoose.model('Category', categorySchema),
  Rate: mongoose.models.Rate || mongoose.model('Rate', rateSchema),
  RateHistory: mongoose.models.RateHistory || mongoose.model('RateHistory', rateHistorySchema),
  GalleryItem: mongoose.models.GalleryItem || mongoose.model('GalleryItem', galleryItemSchema),
  Setting: mongoose.models.Setting || mongoose.model('Setting', settingSchema),
  Enquiry: mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema),
};