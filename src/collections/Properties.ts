import { slugField, type CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'

export const Properties: CollectionConfig = {
  slug: 'properties',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'transactionType', 'city', 'availability', '_status', 'updatedAt'],
    useAsTitle: 'title',
  },
  defaultPopulate: {
    title: true,
    slug: true,
    price: true,
    transactionType: true,
    propertyType: true,
    city: true,
    area: true,
    coverImage: true,
    featured: true,
    availability: true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    { name: 'description', type: 'textarea', required: true },
    {
      name: 'transactionType',
      label: 'Listing type',
      type: 'select',
      options: [
        { label: 'For sale', value: 'sale' },
        { label: 'For rent', value: 'rent' },
      ],
      required: true,
    },
    {
      name: 'propertyType',
      label: 'Property type',
      type: 'select',
      options: [
        { label: 'House', value: 'house' },
        { label: 'Apartment', value: 'apartment' },
        { label: 'Plot', value: 'plot' },
        { label: 'Commercial', value: 'commercial' },
        { label: 'Farmhouse', value: 'farmhouse' },
      ],
      required: true,
    },
    { name: 'price', type: 'number', min: 0, required: true },
    { name: 'city', type: 'text', required: true, index: true },
    { name: 'area', label: 'Area or neighbourhood', type: 'text', required: true, index: true },
    { name: 'address', type: 'text' },
    { name: 'bedrooms', type: 'number', min: 0 },
    { name: 'bathrooms', type: 'number', min: 0 },
    { name: 'areaSize', label: 'Area size', type: 'number', min: 0 },
    {
      name: 'areaUnit',
      type: 'select',
      defaultValue: 'sqft',
      options: [
        { label: 'Square feet', value: 'sqft' },
        { label: 'Square yards', value: 'sqyd' },
        { label: 'Marla', value: 'marla' },
        { label: 'Kanal', value: 'kanal' },
      ],
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media', required: true },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true },
    {
      name: 'availability',
      type: 'select',
      defaultValue: 'available',
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Sold', value: 'sold' },
        { label: 'Rented', value: 'rented' },
      ],
      required: true,
      index: true,
    },
    { name: 'featured', type: 'checkbox', defaultValue: false },
  ],
  timestamps: true,
  versions: {
    drafts: true,
    maxPerDoc: 50,
  },
}
