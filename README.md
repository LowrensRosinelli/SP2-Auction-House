# SP2 Auction House

SP2 Auction House is a student-only auction frontend made for Semester Project 2 at Noroff.

The app uses the Noroff API v2 (Auction House) so a user can register, log in, create listings and place bids.

Live site:  
https://lowrensrosinelli.github.io/SP2-Auction-House/

## Features

Register a new user (using stud.noroff.no email)  
Log in and keep the user stored in localStorage  
View all listings  
View a single listing with bid history  
Create a new listing  
Update and delete your own listings  
Place bids on other users' listings  
View your profile  
See your available credits  

Visitors can:
Browse listings  
View listing details  

Authentication is done with JWT (access token from the Noroff Auth API) together with an API key.

## Tech stack

HTML  
Tailwind CSS v3 (built locally, no CDN)  
Vanilla JavaScript (ES6 modules)  
Noroff API v2 (Auth + Auction House)  

No frontend frameworks (React, Vue, Angular) are used. :) 