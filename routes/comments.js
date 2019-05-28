const express = require('express');
const db = require('../data/db');
const router = express.Router();

router.get('/comments', (req,res) => 
{
    const id = req.params.id;
    if(!id) return res.status(400).send("post id does not exist" + id);
    db.findCommentById(id)
    .then(result =>
    {
        console.log(result);
        if(!result || result.length === 0) return res.status(400).send("post id does not exist " + id);
        res.status(200).json(result);
    })
    .catch(error => res.status(400).send("post id doesnt exist"))
});

router.post('/', (req,res)=>{
    console.log(req.body);
    const id = req.params.id;
    if(!id) return res.status(400).send("post id does not exist " + id);

    const comment = 
    {
            text: req.body.text, // String, required
            post_id: id, // Integer, required, must match the id of a post entry in the database
            created_at: Date.now(), // Date, defaults to current date
            updated_at: Date.now() // Date, defaults to current date
    }

    console.log(comment);
    let pass = true;
    Object.keys(comment).forEach(x=> {if(x === undefined) pass=false; });
    if(!pass) return res.status(400).send("comment is bad data");

    db.insertComment(comment)
    .then(result=> {
        res.status(201).json(result);
    })
    .catch(error => res.status(400).send("post id doesnt exist"))
});

module.exports = router;