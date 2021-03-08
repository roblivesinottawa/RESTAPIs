const Joi = require('joi')
const express = require('express')
const app = express()

// add a json middleware
app.use(express.json())

const courses = [
    { id: 1, name: 'math'},
    { id: 2, name: 'compsci'},
    { id: 3, name: 'programming'}
]


// define a route
app.get('/', (req, res) => {
    res.send("hello from express")
})

// get all the courses
app.get('/api/courses', (req, res) => {
    res.send(courses)
})


// create an HTTP request to create a course
app.post('/api/courses', (req, res) => {
    // define a schema, add some input validation
    const { error } = validateCourse(req.body)
    if ( error ) return res.status(400).send(error.details[0].message)
    
    // manually assign an id so because there is no database
    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course)
    res.send(course)
})

// updating a course
app.put('/api/courses/:id', (req, res) => {
    // look up course
    // 404 if it doesn't exist
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send('the course with the given ID was not found')
    
    // validate
   const { error } = validateCourse(req.body)
    // if invalid, return 400
    if (error) return res.status(400).send(error.details[0].message)
    // update the course
    course.name = req.body.name
    // return the updated course
    res.send(course)
})


// function to refactor validation repetition
function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(course, schema)
};



app.delete('/api/courses/:id', (req, res) => {
    // look up the course, ifit doesn't exist, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send('The course with the given ID was not found.')
    // delete course
    const index = courses.indexOf(course)
    courses.splice(index, 1)
    // return the same course
    res.send(course)
})

// create a route to get just one course
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send('the course with the given ID was not found')
    res.send(course)
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening on port: ${port}`))