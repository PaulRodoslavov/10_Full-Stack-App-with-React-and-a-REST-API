"use strict";

// load modules
const { Course, validateCourse } = require('../models/course');
const { User, validateUser } = require('../models/users');
const express = require('express');
const router = express.Router();
const auth = require('basic-auth');
const middle = require('../middleware');
const { authLogin } = require('../middleware/AuthCheck');
const cors = require('cors');
const bcrypt = require('bcrypt');

router.param("cID", function(req, res, next, id){
   Course.findById(id, function(err, course){
      if(err) return next (err);
      if(!course) {
         err = new Error("Not Found");
         err.status = 404;
         return next(err);
      }
      req.course = course;
      return next();
   });
});

// setup a friendly greeting for the root route
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});


// GET /courses
// Route for courses collection
router.get('/api/courses', (req, res, next) => {
   // cors(),
   Course.find({})
      .exec((err, listCourses) => {
         if(err) return next(err);
         res.json(listCourses);
      });
});

// GET /course--------------Route for course
// use .populate() to achieve the extra credit part 3
router.get('/api/courses/:id', (req, res, next) => {
   const courseId = req.params.id;
   Course.findById(courseId).
   populate('user', 'firstName lastName').
   exec(function (err, course) {
      if(!course) {
         return res.status(400)
            .send({ message: 'There is no such user with given userId.' });
      }
      if (err) return next(err);
      res.status(200).send(course);
   });
});

// POST /courses
// Route for courses collection

router.post('/api/courses', function(req, res, next){
   const courseProps = req.body;

   const { error } = validateCourse(courseProps);
   if (error) {
      return res.status(400).send({ message: error.details[0].message  });
   }
   const course = new Course(req.body);
   course.save( function (err, course){
      if(err) return res.status(500).json({error});
      res.location(`/api/courses/${course._id}`);
      return res.sendStatus(201);
   });
});

// PUT /courses authLogin,
// Route for courses collection
router.put('/api/courses/:cID', function(req, res){
   const courseProps = req.body;
   const { error } = validateCourse(courseProps);
   if (req.body) {
         if (error) {
            return res.status(400).send({ message: error.details[0].message  });
         }

      req.course.update(req.body, function(err, course){
         if(err) return next(err);
         return res.sendStatus(204);
      })
   } else {
     const error = new Error("Please login to update post.");
     error.status = 400;
     return next(error);
   }



});

// DELETE /courses
// Route for courses collection
router.delete("/api/courses/:cID", function(req, res){
   if (req.body) {
     if (req.course.user.toString() === req.body._id) {
      req.course.remove();
      return res.sendStatus(204);
     } else {
      const error = new Error("You are not authorized to delete this post");
      error.status = 400;
      return next(error);
     }
   } else {
     const error = new Error("Please login to delete post.");
     error.status = 400;
     return next(error);
   }
});

// GET /users
// Route for users collection
router.get('/api/users', (req, res, next) => {
   auth(req)
     ? User.findOne({ emailAddress: auth(req).name }).exec(function(err, user) {
         if (user) {
           if (bcrypt.compareSync(auth(req).pass, user.password)) {
             req.user = user;
             res.json(user);
             next();
           } else {
             return res.status(409).json({
               password: "Invalid password"
             });
           }
         } else {
           return res.status(409).json({
             password: "User not found"
           });
         }
       })
     : next();
});

// POST /users
// Route for users collection

router.post('/api/users', function (req, res, next) {
   // res.json('100')
   const userProps = req.body;
   User.findOne({ emailAddress: userProps.emailAddress })
      .exec((err, user) => {
         if(err) return next(err);
         if (user) {
            return res.status(409).json({
              message: "Email address is already assigned to an account."
            });
         }
         else {
            const user = new User(req.body);
            user.save( (err, user) => {
               if(err) return next(err);
               res.location('/');
               res.sendStatus(201);
            });
         };
      });
});

router.get('/check-auth', authLogin, function (req, res, next) {
   if (auth(req).name === "pasha") {
      res.json('YPA')
   }

})

module.exports = router;
