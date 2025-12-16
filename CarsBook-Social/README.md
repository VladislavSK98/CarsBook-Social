CarBook – Social Network for Car Enthusiasts
Table of Contents

Project Overview

Application Structure

Public Part

Private Part

Features

Cars

Posts

Tracks

Laps

Technologies and Tools

Project Architecture

Installation and Setup

Routing and Pages

React Concepts Used

Error Handling and Validation

Folder Structure

Bonus Features

Assessment Notes

Project Overview

CarBook is a web application designed for car enthusiasts to share and explore:

Their cars

Posts about car-related experiences

Racing tracks they have driven on

Lap times on different tracks

The application provides a public area for guests and a private area for registered users. Users can create, edit, and delete content, while guests can only view public data.
----------------------------------------
Application Structure

Public Part

Accessible without authentication:

Home Page – featured cars, latest posts, top tracks, quotes

Login and Registration Forms

Catalogs for cars, tracks, and posts (read-only)
 -------------------------------------

Private Part (User Area)

Accessible only to logged-in users:

Personal Garage with user’s cars and posts

Ability to add/edit/delete cars, posts, tracks, and lap times

Add lap times to tracks and manage personal performance

Interact with other users’ public posts

Features
Cars

View top cars on Home Page

Add new cars to user Garage

Edit or delete owned cars

Cars have images, make, model, and power

Posts

Create, edit, and delete posts

View public posts on Home Page

Display post author and date

Guests can view posts but cannot interact

Tracks

View tracks and track details

Add new tracks to the system

Each track displays laps and fastest times

Top tracks on Home Page sorted by number of laps

Laps

Users can add lap times for a track using a selected car

Delete only their own laps

Tracks display fastest laps in sorted order

Technologies and Tools

Frontend: React.js, JSX, CSS Modules

Backend: Node.js, Express.js

Database: MongoDB

HTTP Client: Axios

Authentication: JWT Tokens

Routing: React Router v6

State Management: Context API (bonus: React Redux possible)

Project Architecture

React Components divided into functional and stateless components

Context API for user authentication and global state

Client-Server Communication via REST API

CRUD Operations implemented for cars, posts, tracks, and laps

Installation and Setup
Prerequisites

Node.js >= 18.x

MongoDB running locally or via cloud service

Steps

Clone the repository:

git clone https://github.com/username/CarBook.git
cd CarBook


Install backend dependencies:

cd server
npm install


Configure .env with MongoDB URI and JWT secret:

MONGO_URI=mongodb://localhost:27017/carbook
JWT_SECRET=your_jwt_secret
PORT=5000


Start backend server:

npm run dev


Install frontend dependencies:

cd ../client
npm install


Start frontend:

npm start


Open browser: http://localhost:5173

Routing and Pages

/ – Home Page (public)

/login – Login Page (public, guests only)

/register – Registration Page (public, guests only)

/parking – All Cars Catalog (public)

/garage – User Garage (private)

/tracks – Tracks Catalog (public)

/tracks/:id – Track Details (private)

/posts/:id – Post Details (public)

React Concepts Used

Hooks: useState, useEffect, useContext

Context API for user auth

Bound Forms with controlled inputs

Synthetic Events for form submission and button clicks

Component Lifecycle: mount, update, unmount effects

Stateful & Stateless Components

Error Handling and Validation

Forms validate required fields

User input validated before sending to backend

Backend responds with proper HTTP status codes

UI displays user-friendly error messages