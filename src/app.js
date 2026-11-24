const express = require('express');
const StudentRepository = require('./repositories/studentRepository');
const CourseRepository = require('./repositories/courseRepository');
const StudentService = require('./services/studentService');
const CourseService = require('./services/courseService');
const createStudentRouter = require('./routes/students');
const createCourseRouter = require('./routes/courses');
const requestLogger = require('./middleware/requestLogger');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

function createApp(options = {}) {
  const app = express();
  const logger = options.logger || console;

  const studentRepository = options.studentRepository || new StudentRepository();
  const courseRepository = options.courseRepository || new CourseRepository();
  const studentService = new StudentService(studentRepository);
  const courseService = new CourseService(courseRepository);

  app.disable('x-powered-by');
  app.use(requestLogger(logger));
  app.use(express.json());

  app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'student-course-api' });
  });
  app.use('/students', createStudentRouter(studentService));
  app.use('/courses', createCourseRouter(courseService));

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
