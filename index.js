const fs = require('fs')
const express = require('express');
const users = require('./MOCK_DATA.json');
const { json } = require('stream/consumers');
const app = express();
const PORT = 8000;

// Middleware

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    console.log("hello from middleware 1");
    next();

})



// Routes
app.get('/users', (req, res) => {

    const html = `
    
    <ul>
    ${users.map(user => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html);
})

// REST API
app.get('/api/users', (req, res) => {
    res.setHeader("X-MyName", "Shahid Ansari")
    // Always add X to custom headers
    return res.json(users);
})


app
    .route("/api/users/:id")
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        if(!user) return res.status(404).json({ erroe: "User not found"})
        return res.json(user);
    })
    .put((req, res) => {
        // Todo: edit the user with id
        return res.json({ status: "pending" });
    })
    .delete((req, res) => {
        // Todo: Delete the user with id
        return res.json({ status: "pending" });
    })
app.post('/api/users', (req, res) => {
    // Todo create new user
    const body = req.body;
    if(!body || !body.first_name || !body.last_name || !body.email || !body.gender ||!body.job_title ){
        return res.status(400).json({msg: "All fields are required"})
    }
    users.push({ ...body, id: users.length + 1 });
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        return res.status(201).json({ status: 'success', id: users.length });

    });
});








app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
