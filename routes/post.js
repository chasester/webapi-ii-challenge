const express = require('express');
const db = require('../data/db');
const router = express.Router();

const commmentRoutes = require('./comments');

router.use('/:id/comments', commmentRoutes);



router.get('/', (req, res) => {
    db.find()
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json({error: err}))
});

router.get('/:id', (req,res) =>
{
    const id = req.params.id;
    db.findById(id)
    .then(result => 
    {
        if(!result || result.length === 0) return res.status(400).send("post id does not exist");
        res.status(200).json(result[0]);
    })
});


router.get('/:id/comments/', (req,res) => 
{
    const id = req.params.id;
    if(!id) return res.status(400).send("post id does not exist" + id);
    db.findPostComments(id)
    .then(result =>
    {
        if(!result || result.length === 0) return res.status(400).send("post id does not exist " + id);
        res.status(200).json(result);
    })
    .catch(error => res.status(400).send("post id doesnt exist"))
});


router.post('/:id/comments/', (req,res)=>{
    const id = req.params.id;
    if(!id) return res.status(400).send("post id does not exist " + id);

    const comment = 
    {
            text: req.body.text, // String, required
            post_id: id, // Integer, required, must match the id of a post entry in the database
            created_at: Date.now(), // Date, defaults to current date
            updated_at: Date.now() // Date, defaults to current date
    }

    let pass = true;
    Object.keys(comment).forEach(x=> {if(comment[x] === undefined || comment[x] === "") pass=false; });
    if(!pass) return res.status(400).send("comment is bad data");

    db.insertComment(comment)
    .then(result=> {
        res.status(201).json(result);
    })
    .catch(error => res.status(400).send("post id doesnt exist"))
});

router.delete('/:id', (req,res) =>
{
    const id = req.params.id;
    if(!id) return res.status(400).send("post id does not exist" + id);

    db.remove(id)
    .then(result =>
    {
        res.status(200).json(result);
    })
    .catch(error => res.status(500).send("post can not be deleted"));
});

router.put('/:id', (req,res) =>
{
    const id = req.params.id;
    if(!id) return res.status(400).send("post id does not exist" + id);

    db.findById(id)
    .then(result =>
    {
        if(!result || result.length === 0) return res.status(400).send("post id does not exist" + id);
        let post = 
        {
            title: req.body.title,
            contents: req.body.contents,
            id: id,
            created_at: result[0].created_at,
            updated_at: Date.now()
        }
        let pass = true;
        Object.keys(post).forEach(x=> {if(post[x] === undefined || post[x] === "") pass=false; });
        if(!pass) return res.status(400).send("post has bad data");

        db.update(id, post)
        .then(() =>
        {
            res.status(201).json(post);
        })
        .catch(error => res.status(500).send(`error: ${error}`));
    })
    .catch(error => res.status(400).send("post id doesnt exist"))
});

router.post("/", (req,res) =>
{
    let post = 
    {
        title: req.body.title,
        contents: req.body.contents,
        created_at: Date.now(),
        updated_at: Date.now()
    }
    let pass = true;
    Object.keys(post).forEach(x=> {if(post[x] === undefined || post[x] === "") pass=false; });
    if(!pass) return res.status(400).send("post has bad data");
    
    db.insert(post)
    .then(result =>
    {
        //this is a hack ....
        post.id = result.id;
        res.status(201).json(post);
    }) 
    .catch(error => res.status(400).send("could not create post"))
});
module.exports = router;