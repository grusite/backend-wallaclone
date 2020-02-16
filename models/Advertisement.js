'use strict'

const mongoose = require('mongoose')

const advertisementSchema = mongoose.Schema(
  {
    name: { type: String, required: true, max: 30, index: true },
    description: { type: String, max: 100 },
    type: { type: String, enum: ['buy', 'sell'], required: true, index: true },
    price: { type: Number, required: true },
    picture: { type: String, required: true },
    tags: {
      type: [String],
      enum: ['lifestyle', 'motor', 'mobile', 'work'],
      index: true,
    },
  },
  {
    // Añade las propiedades de created y updated
    timestamps: true,
  }
)

advertisementSchema.index({ type: 1, tags: 1 })

advertisementSchema.statics.list = function({ filter, skip, limit, fields, sort }) {
  const query = this.find(filter)
    .skip(skip)
    .limit(limit)
    .select(fields)
    .sort(sort)
  return query.exec()
}

module.exports = mongoose.model('Ad', advertisementSchema)
