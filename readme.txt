EJS BLOG - Prototype
This is an EJS Blog using Node, Express, EJS, Body-Parser and MongoDB/Mongoose.
Really simple once you get a hang of the basic functionality

0.1 - Basic Structure of the blog. Ejs templating for each post. You can compose a post accessing the /compose/ route.
    - Each post is saved as an object to the main allPost variable in the app.js file.
    - Home Page displays all posts in a date descending order.
    - There is no DB yet, if server is restarted post data is lost.

-Possible implementations -> Possibility of adding an image from an outside url
                          -> Adding a DB for the posts, which I guess if I'm adding MongoDB, images will have to be stored as url,
                          will have to be loaded dynamically with ejs.
                          -> Add dynamic rendering for pages of posts. (Found out what I meant was actually "Pagination")
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

0.2.3 - Finished find functionality, its very basic and probably bad optimized, but
      it will find all posts who's content or title includes the keyWord
      which was put in the search box.
      - Changed around a couple of titles in the tag.ejs

0.2.4 - Fixed bug with find functionality, looping a NO CONTENT h1 tag everytime a post didn't match
      the correct keyWord

0.3 - Added Bootstrap Pagination, for more than 9 posts, you will have a pagination.
      -> future implementation should be adding the pagination to search results.
      -> Also adding AUTH to compose.
      After this two things the page could possibly be finished,
      maybe add user upload image.

0.4 - Fixed minor html bug in subscribe page
    - Added Auth for /compose route, will now require a user and a Hashed Password
    using Md5.

0.5 - Added Archive route, will show all posts, sorted by Year, and Month.
    - Still some tweaks are needed in order to have a nice, rounded Archive.
    - Still missing a better Auth workaround, maybe using cookies, and generating an admin panel in order
    to CRUD our database, making it more user friendly.
    0.5.1 - Added a Switch, for case by case, to display month as "november" instead of 11 for example.
          - Need to style the archive, and need to take the archive for a basic admin panel with crud functions.
    0.5.2 - Started working on Acordion style archive, for the /archive.
          - Still need to debug....

0.6 - Archive route done, shows all posts, by Year Month, each one directs to the posts URL.
    - Compose route has now an Added CK editor, for rich text editing on posts.
    - Missing a way to display only TEXT for front Page image cards.