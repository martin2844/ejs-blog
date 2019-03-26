EJS BLOG - Prototype

0.1 - Basic Structure of the blog. Ejs templating for each post. You can compose a post accessing the /compose/ route.
    - Each post is saved as an object to the main allPost variable in the app.js file.
    - Home Page displays all posts in a date descending order.
    - There is no DB yet, if server is restarted post data is lost.

-Possible implementations -> Possibility of adding an image from an outside url
                          -> Adding a DB for the posts, which I guess if I'm adding MongoDB, images will have to be stored as url,
                          will have to be loaded dynamically with ejs.
                          -> Add dynamic rendering for pages of posts.
                          -> Add post signature
                          -> Add date to posts.


0.2 - Implemented MongoDB database, for localhost.
    - Revamped home.ejs
    - Revamped post.ejs
    - Introduced Posts as image cards, bootstrap.
    - Changed Footer.
    - Changed to bootstrap V4.
    - Added images to blogpost, using outside URL
    - Added youtube URL to compose.ejs which puts a YouTube video on the post.

0.2.1 - Added toggler button to the NavBar
      - Added correct routes for links
      - Added subscribe form & subscribe route
      - Modified Home.ejs, added social media buttons, fixed img cards.
      - Added date to postSchema, which is the day its posted.
      - Added Author variable, which will be changed to a signature later on.

0.2.2 - Add tag to postSchema, this will give a sort of blog tag to each post
      - Added tags to the card at Home, having error at finding the tags. Must resolve.
    (fix) --> tag.ejs is now working, clicking on a card's tag will bring you to a page that
    contains all posts with said tag.