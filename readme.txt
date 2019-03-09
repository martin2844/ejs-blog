EJS BLOG - Prototype

0.1 - Basic Structure of the blog. Ejs templating for each post. You can compose a post accessing the /compose/ route.
    - Each post is saved as an object to the main allPost variable in the app.js file.
    - Home Page displays all posts in a date descending order.
    - There is no DB yet, if server is restarted post data is lost.

-Possible implementations -> Possibility of adding an image from an outside url
                          -> Adding a DB for the posts, which I guess if I'm adding MongoDB, images will have to be stored as url,
                          will have to be loaded dynamically with ejs.
