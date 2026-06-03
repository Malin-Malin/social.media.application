>Assignment: This is an assignment from Noroff. It is focused around JavaScript, Bootstrap and SASS.
Building the front-end client for a social media application.

# Social Media Application

A front-end social media application where users can browse a feed, view profiles, follow/unfollow profiles and create posts.

**Live site:** [https://sosial-media-application.netlify.app/][1]

> **Status:** Active Development - Bootstrap framework implemented, SCSS workflow established. Ongoing improvements to UI, responsiveness, and additional features.


## Features (current & planned)

* [x] Basic layout & Bootstrap styling
* [x] SCSS implementation with custom design variables
* [x] User authentication (login / register)
* [x] Profile details view (avatar, banner, bio, post count)
* [x] Search for profiles
* [x] Fallback images when media is missing
* [x] Follow / Unfollow a profile (UI + API)
* [x] Post feed with author info (`_author=true`)
* [x] Bootstrap Icons integration
* [ ] Single post page (reactions & comments)
* [x] Show followers and following on profile pages
* [ ] Improve Bootstrap customization (Partially completed)
* [x] Responsive design with Bootstrap grid system
* [ ] Adjustment of sections (content fit)
* [ ] Apply a cohesive color theme throughout (in progress)
* [ ] Implement “like post” functionality (in progress, UI only)
* [ ] Improve accessibility (ARIA, color contrast)
* [ ] Work on the Index (Home) page layout and content
* [ ] Loading indicators
* [ ] Display Followers/Following more clearly (in progress)
* [ ] E2E Testing - Playwright or Cypress for user flow testing
* [ ] Code Formatting - Prettier for consistent code style
* [ ] Pre-commit Hooks - Husky + lint-staged for code quality gates
* [ ] ESLint - JavaScript linting and code standards
* [ ] Error Boundary - Better error handling and user feedback


## Pages

* **Home / Landing** – intro content and links to other areas (in progress)
* **Feed** – overview of recent posts from all users, single user and search
* **Post** – single post page (showing reactions and comments -in progress)
* **Profile** – details for user with followers and button to see all posts. Here you can also edit your own profile.
* **Create Post** – form to publish a new post
* **Login** – combined page for login and register. (Trying out SPA app behavior for learning purposes.)
* **404** – not found page for invalid routes


## Tech Stack

* **HTML, CSS, JavaScript (ES Modules)**
* API by **Noroff** (v2) — authentication & key docs referenced above. ([Noroff API Dokumentasjon][4])
* **SCSS** — Custom design system with variables and source maps for customizable styling
* **Bootstrap 5.3.8** — Responsive UI framework with utility classes and component library
* **Bootstrap Icons** — Icon library for consistent iconography
* Hosting: **Netlify**. ([Netlify][2])


## API & Authentication (Noroff v2)

Every request to the v2 API must include the header:

```http
X-Noroff-API-Key: <yourApiKey>
```

* How to create & use the **API Key**: docs show `X-Noroff-API-Key` header together with your access token. ([Noroff API Dokumentasjon][3])
* v2 **Authentication** overview: you need to log in to get an access token and create an API key and send both on each request. ([Noroff API Dokumentasjon][4])
* v2 **Swagger** root if you want to explore endpoints interactively. ([Noroff API][5])


## Development Setup

### Installation (local)

1. **Clone** your repo and open the project folder.
2. **Serve locally** (because ES Modules don’t work from `file://`):
   * VS Code: install **Live Server** → “Open with Live Server”; or
   * Node: `npx serve` (or any static server).
3. **Open** the relevant page (e.g. `/post/feed.html`) and test.


### SCSS Development

* Edit `.scss` files in `/styles/scss/`
* Compile to CSS (source maps included for debugging)
* Custom variables defined in `variables.scss`


## Architecture (DRY & Reusable)

**`storageService.js`** - simple localStorage wrapper.

  ```js
  import { save, load, remove } from "./storageService.js";
  save("token", data.accessToken);
  const token = load("token", parse); //parse = true for JSON parsing
  remove("token");
  ```

**`apiClient.js`** – centralized requests, headers, params, and error handling.

  ```js
  import { get, post, put, del } from "./apiClient.js";
  const posts = await get(endpoint);  
  const data = await post(endpoint, body);
  const updated = await put(endpoint, body);
  await del(endpoint);
  ``` 

**`authService.js`** – single source for authentication and auth state.

  ```js
  import { registerUser, loginUser, logoutUser, isLoggedIn, getUserProfile } from "./authService.js";
  const registerData = await registerUser(name, username, password);
  const loginData = await loginUser(username, password);
  await logoutUser();
  const loggedIn = isLoggedIn();
  const profile = getUserProfile();
  ```

**`profileService.js`** – encapsulated profile-related API calls.

  ```js
  import { getProfile, getAllProfiles, getMyFullProfile,  updateProfile, followProfile, unfollowProfile, isFollowing, isFollower, searchProfiles } from "./profileService.js";
  const profile = await getProfile(profileName, following, follower, posts); //after profileName, optional flags to include extra data
  const profiles = await getAllProfiles(page, limit); //pagination optinal, if omitted defaults to page 1, limit 9
  const myProfile = await getMyFullProfile();
  await updateProfile(profileName, profileData);
  await followProfile(profileName);
  await unfollowProfile(profileName);  
  const following = await isFollowing(profileName);
  const follower = await isFollower(profileName);
  const results = await searchProfiles("query");
  ```


  **`postsService.js`** – encapsulated post-related API calls.
  ```js
  import { getAllPosts, getPostById, createPost, updatePost, deletePost, searchPosts, getPostsByUser } from "./postsService.js";
  //includeAuthor = true to get author details with each post, always optional
  //pagination optional, if omitted defaults to page 1, limit 9
  const posts = await getAllPosts(limit, includeAuthor, page); 
  const post = await getPostById(postId, includeAuthor);
  const userPosts = await getPostsByUser(username, limit, includeAuthor, page);
  const newPost = await createPost(title, body, tags, media);
  await updatePost(postId, postData);
  await deletePost(postId);
  const searchResults = await searchPosts("query");
  ```

**Components** – shared UI: `Header`, `Footer` and `Breadcrumb`-part of header (change once, used everywhere).

```html
<header id="main-header">
	</header>
	<footer id="main-footer">
	</footer>
	<script type="module" src="/js/components/loadComponents.js"></script>
```

*Result: less repetition, easier maintenance, and consistent UI across the app.*


## UI & Accessibility

* Bootstrap spacing utilities (`.container`, `px-*`, `mx-*`) for consistent side margins.
* Keyboard-friendly navigation and semantic landmarks (`<header>`, `<main>`, `<footer>`).
* Alt text for images (fallbacks if API misses `alt`).


### Architecture highlight: 

* The project uses a reusable apiClient.js (centralized requests, headers, params, and error handling) and authService.js (single source of truth for auth state). 
* Paired with small UI components (Header, Footer, Breadcrumb), this keeps the codebase DRY, consistent, and easy to maintain as the app grows.


## Deployment

Hosted on **Netlify**. Push to the main branch to trigger deploys.
  ([Live URL][1])


## License

Creator: Malin Skrettingland.

<p align="center">
  <img src="./image/Cartoon-style-portrait-01.5.png" alt="Cartoon-style portrait" width="400">
</p>


[1]: https://sosial-media-application.netlify.app/ "Home | Social Media App"
[2]: https://www.netlify.com/?utm_source=chatgpt.com "Netlify: Push your ideas to the web"
[3]: https://docs.noroff.dev/docs/v2/auth/api-key?utm_source=chatgpt.com "API Key - Noroff API"
[4]: https://docs.noroff.dev/docs/v2/authentication?utm_source=chatgpt.com "Authentication - Noroff API"
[5]: https://v2.api.noroff.dev/docs/static/index.html "Swagger UI - noroff.dev"
