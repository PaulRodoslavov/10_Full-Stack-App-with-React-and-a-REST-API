'use strict';

// load modules
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
   user: {
     type: Schema.Types.ObjectId,
     ref: 'users',
   },
   title: {
     type: String
   },
   description: {
     type: String
   },
   estimatedTime: String,
   materialsNeeded: String,
 });

const Course = mongoose.model('course', CourseSchema);

function validateCourse(course) {
   const schema = {
      user: Joi.objectId().required(),
      title: Joi.string().min(5).max(255).required(),
      description: Joi.string().min(5).required(),
      estimatedTime: Joi.string().allow('').optional(),
      materialsNeeded: Joi.string().allow('').optional(),
   };
   return Joi.validate(course, schema);
}


module.exports = { Course, validateCourse };
