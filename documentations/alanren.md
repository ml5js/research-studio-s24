# Enhance the ml5.js website with built-in code editor

## [Project Proposal](../projects/alanren.md)

## Interview & Research

At ITP and IMA, nearly all students had been exposed to p5.js (and used p5 web editor), while many were introduced to ml5.js as part of their coursework. However, the ml5.js website itself provides relatively less information for reference. During my interviews with peers and non-ITP/IMA students (a total of 18):

- More than 80% of the students agreed that they would be more motivated to learn if they could see the results of the code first.
- More than 85% of students agree that a good reference page can help them learn independently.

## Inspirations
![alanren-ml5-final-presentation](https://github.com/alanvww/research-studio-s24/assets/10086000/576570c2-de0c-4ae4-bca9-7f914f1cedca)

In my project, I examine the most common in-page code editors that beginners frequently use and address the problems they may encounter. For the p5.js reference page, the code block only displays the code as plain text without syntax highlighting. In contrast, for w3schools, the link opens a new page that executes the code, which is not a true "in-page" code editor. I aim to combine the best of these two tools. 

## Project Goals

- User-Friendly Design:
  - Create a visually appealing, responsive widget that’s easy to navigate.
- Interactive Learning Tools:
  - Embed a robust, interactive code editor within the site to allow users to write, modify, and test code directly on the webpage.

## iterations
![alanren-ml5-final-presentation (1)](https://github.com/alanvww/research-studio-s24/assets/10086000/fa904794-5a5a-4b63-8d26-d25b67c1b527)

- Iteration #1 (left)
  - This is a minimized version of my previous Next.js project. The code is not optimized for a small widget that could be embedded multiple times on a page.
  - The widget requires a large screen size because it was designed to work as a single-page application.
- Iteration #2 (right)
  - I migrated code and logic to use Vite with React and minimized everything else. The result went from 5 MB to 300 KB, which significantly reduced the load time.
  - I also improved the design with functionality to run and stop the sketch.

## Latest Version - [Link](https://alanvww.github.io/ml5-website-v02-docsify/#/learning/p5js-fundamentals)
![alanren-ml5-final-presentation (2)](https://github.com/alanvww/research-studio-s24/assets/10086000/86b65f67-9cf5-4fa3-b254-4870e208c125)

This is the latest version of this project. The new updates include these new features:
 - Color as status indicator
 - Code runs and editor is hidden on first render.
 - Vertical layout and expandable editor size
 - Link to p5 web editor.

## Challenges
 - Performance - minimize from 3mb to 500kb ✅
 - Better design - hopefully ✅
 - Not easy to modify - URL Params ✅
 - 

## Future Plan
 - Iframe
 - JSON files for external loading
 - More learning content = more example codes
 - Auto format
 - Partially editable
 - Video & Audio input options(hopefully also implement something similar in p5 web editor)
