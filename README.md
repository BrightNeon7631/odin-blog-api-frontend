# Odin Project #26: Blog API (frontend)

The goal of this Odin Project assignment was to create a full-stack blog application. This repo contains the front-end that was built with React. The admin can add posts and manage users, posts and comments. Guests can browse posts and read comments left by others. The user can also add comments to posts but they need to have an account to do that. Ideally there should be two separate front-ends, one for the user and one for the administrator, however I settled on just one for simplicity reasons. I decided to give Tailwind a try and it's pretty good so far. I avoided it earlier due to ugly syntax. 

The back-end was built with Express (and other tools) and can be found in [this repo](https://github.com/brightneon7631/odin-blog-api-backend).

I started and finished this project in September 2024.

## Assignment

[The Odin Project - NodeJS - #26 Blog API](https://www.theodinproject.com/lessons/node-path-nodejs-blog-api)

## Technology

- JavaScript
- React
- React Router
- Tailwind CSS
- Vite
- Axios
- JWT decode

### Additional NPM packages
- date-fns
- react-icons
- react-paginate
- react-spinners

## Key Concepts

- Single-page apps
- Client-side routing
- BrowserRouter & Routes: createBrowserRouter(), createRoutesFromElements() & RouterProvider
- Route, path & element
- Layout Route & Outlet
- Protected routes
- Link & NavLink: navigation, active styling, state & useLocation()
- JWT Decode: decoding JWT tokens client-side (validation of course takes place server-side)
- Consuming REST APIs in React: fetch vs axios, setting the authorization header, performing requests, handling errors, updating state
- useEffect: side effects, syntax, dependencies array, async functions, fetching data from the API, Local Storage
- Context: useContext, createContext, context provider, passing values

## Features

- The user can create a new account or log in to an existing one.
- The user can browse posts, comments and add a new comment. 
- Comments can be edited or deleted. Either from within the Post component or a dedicated dashboard that displays all comments left by the user.
- The user can change their account details such as username, email or password. They can also delete their account.
- The admin can manage posts (add new ones, edit them or delete them).
- The admin can manage all user comments (edit or delete them).
- The admin can manage all users (edit or delete them).


## Links

[Back-end Repo](https://github.com/brightneon7631/odin-blog-api-backend)

[Live Demo](https://bn7631-odin-travel-blog-api.pages.dev)

## Screenshots

### Desktop

#### User

![Desktop Screenshot](screenshots/desktop1.gif)

![Desktop Screenshot](screenshots/desktop2.png)

![Desktop Screenshot](screenshots/desktop3.png)

![Desktop Screenshot](screenshots/desktop4.png)

![Desktop Screenshot](screenshots/desktop5.png)

![Desktop Screenshot](screenshots/desktop6.png)

#### Admin

![Desktop Screenshot](screenshots/desktop7.png)

![Desktop Screenshot](screenshots/desktop8.png)

![Desktop Screenshot](screenshots/desktop9.gif)

![Desktop Screenshot](screenshots/desktop10.gif)

### Mobile

#### Guest

![Mobile Screenshot](screenshots/mobile1.gif)

![Mobile Screenshot](screenshots/mobile2.gif)

#### User

![Mobile Screenshot](screenshots/mobile3.png)

#### Admin

![Mobile Screenshot](screenshots/mobile4.png)

## Image sources

- https://unsplash.com/photos/68aXi4RVhMQ by Moiz K. Malik
- https://unsplash.com/photos/3-esk8zPwPY by Marek Okon
- https://unsplash.com/photos/NYyCqdBOKwc by Lin Mei
- https://unsplash.com/photos/IXFASgZbWLE by Shai Pal
- https://unsplash.com/photos/wJj5Bs1jHxg by Erik Eastman
- https://unsplash.com/photos/xhroyV_upAA by Erik Zünder
- https://unsplash.com/photos/9qqxcajbfMM by Katsuma Tanaka
- https://unsplash.com/photos/NxohuKZmSJ0 by Takuma Tsubaki
- https://unsplash.com/photos/mntnoQyEM2Y by Emily KenCairn of Apiary Studio
- https://unsplash.com/photos/1u0B0akEQx0 by Matteo Ferrero
- https://unsplash.com/photos/-NStkTOhv2I by Yu Kato
- https://unsplash.com/photos/-WQwtk_t4oJI by Kit Suman

## Deployment

You may need to change the axios base url in the .env or main.jsx.

```bash
# clone repo
git clone https://github.com/BrightNeon7631/odin-blog-api-frontend.git

# install project dependencies
npm install

# run vite dev server
npm run dev

# create a production build
npm run build
```
