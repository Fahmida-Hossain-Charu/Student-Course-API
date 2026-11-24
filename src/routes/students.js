const express = require('express');

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : value;
}

function createStudentRouter(service) {
  const router = express.Router();

  router.post('/', (req, res) => {
    const student = service.create(req.body);
    res.location(`/students/${student.id}`).status(201).json(student);
  });

  router.get('/', (req, res) => res.status(200).json(service.getAll()));
  router.get('/:id', (req, res) => res.status(200).json(service.getById(parseId(req.params.id))));
  router.put('/:id', (req, res) => res.status(200).json(service.replace(parseId(req.params.id), req.body)));
  router.patch('/:id', (req, res) => res.status(200).json(service.update(parseId(req.params.id), req.body)));
  router.delete('/:id', (req, res) => {
    service.delete(parseId(req.params.id));
    res.status(204).send();
  });

  return router;
}

module.exports = createStudentRouter;
