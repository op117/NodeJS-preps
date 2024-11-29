const fs = require('fs');
const express = require('express')
const app = express();
 
app.use(express.json());

//Create a post
app.post('/blogs', (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).send('Title and content are required!');
  }

  try {
    fs.writeFileSync(title, content);
    res.status(201).send('Post created successfully!');
  } catch (error) {
    res.status(500).send('Error creating post');
  }
});

//Update a post
app.put('/blogs/:title', (req, res) => {
  const { title } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).send('Content is required!');
  }

  if (fs.existsSync(title)) {
    try {
      fs.writeFileSync(title, content);
      res.send('Post updated successfully!');
    } catch (error) {
      res.status(500).send('Error updating post');
    }
  } else {
    res.status(404).send('This post does not exist!');
  }
});

//Delete a post
app.delete('/blogs/:title', (req, res) => {
  const { title } = req.params;

  if (fs.existsSync(title)) {
    try {
      fs.unlinkSync(title);
      res.send('Post deleted successfully!');
    } catch (error) {
      res.status(500).send('Error deleting post');
    }
  } else {
    res.status(404).send('This post does not exist!');
  }
});

//Read a post
app.get('/blogs/:title', (req, res) => {
  const { title } = req.params;

  if (fs.existsSync(title)) {
    try {
      const post = fs.readFileSync(title, 'utf8');
      res.send(post);
    } catch (error) {
      res.status(500).send('Error reading post');
    }
  } else {
    res.status(404).send('This post does not exist!');
  }
});

//Read posts
app.get('/blogs', (_, res) => {
  try {
    const files = fs.readdirSync('./');
    const blogs = files.map(file => ({ title: file }));
    res.json(blogs);
  } catch (error) {
    res.status(500).send('Error reading posts');
  }
});
 
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});