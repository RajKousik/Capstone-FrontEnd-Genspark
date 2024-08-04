# Vibe Vault - Music Management System Frontend

## Overview

**Vibe Vault - Music Management System Frontend** is the client-side application designed to interact with the Vibe Vault backend. It provides a seamless user experience for managing music, playlists, favorites, and ratings. The frontend supports multiple user roles including Admin, Premium User, Normal User, and Artist, and integrates with Stripe for payment processing. The application is built using React and leverages various libraries and frameworks for state management, routing, and UI components.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Components](#components)
- [Context Management](#context-management)
- [Payment Processing](#payment-processing)
- [Email Notifications](#email-notifications)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Management**: Admin, Premium User, Normal User, Artist
- **Music Management**: Songs, Playlists, Favorites, Ratings
- **Payment Processing**: Stripe integration for premium subscriptions
- **State Management**: Context API for managing global state
- **Responsive Design**: Mobile-friendly interface
- **Email Notifications**: Integration with backend for email notifications

## Technologies

- **Frontend Framework**: React
- **State Management**: Context API
- **Routing**: React Router
- **UI Components**: React-Bootstrap
- **Payment Gateway**: Stripe
- **Others**: Axios, React-Toastify

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/RajKousik/Capstone-FrontEnd-Genspark.git
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the application**:
   ```bash
   npm run dev
   ```

## Configuration

Configure the following settings in the `.env` file:

- **Backend API URL**:

  ```env
  REACT_APP_API_URL=http://localhost:5000/api/v1
  ```

- **Stripe**:
  ```env
  REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
  ```

## Usage

### User Roles

- **Admin**: Manage all aspects of the system.
- **Premium User**: Access premium features such as unlimited playlist creation.
- **Normal User**: Access basic features with limitations.
- **Artist**: Manage their own songs and albums.

### Music Management

- **Songs**: Browse and manage songs.
- **Playlists**: Create, update, and delete playlists.
- **Favorites**: Mark and unmark songs as favorites.
- **Ratings**: Rate songs.

## Components

### Common Components

- **NavbarComponent**: Navigation bar for the application.
- **FooterComponent**: Footer for the application.

### Authentication Components

- **LoginComponent**: User login.
- **RegisterComponent**: User registration.
- **VerificationComponent**: Email verification.

### Dashboard Components

- **AdminDashboard**: Dashboard for admin users.
- **UserDashboard**: Dashboard for premium and normal users.
- **ArtistDashboard**: Dashboard for artist users.

### Music Components

- **SongsComponent**: List and manage songs.
- **PlaylistsComponent**: List and manage playlists.
- **FavoritesComponent**: List favorite songs.
- **RatingsComponent**: Rate songs.

## Context Management

- **AuthContext**: Manages authentication state and user information.
- **MusicContext**: Manages music-related state such as songs, playlists, and favorites.

### Example Usage

```jsx
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";

const MyComponent = () => {
  const { user, login, logout } = useContext(AuthContext);

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

## Payment Processing

**Stripe Integration**: The frontend integrates with Stripe for handling premium subscriptions. Users can upgrade to premium plans using Stripe's secure payment gateway.

### Example Usage

```jsx
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./components/CheckoutForm";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutComponent = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);
```

## Email Notifications

The frontend communicates with the backend to trigger email notifications for various events such as subscription renewals and account verification.

## Project Structure

```
MusicApplicationFrontEnd
├─ .eslintrc.cjs
├─ .github
│  └─ workflows
│     └─ azure-static-web-apps-calm-mud-018043c1e.yml
├─ .gitignore
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  ├─ testing
│  │  └─ audio
│  │     ├─ Come-on-Girls.mp3
│  │     └─ Poo-Nee-Poo.mp3
│  └─ vite.svg
├─ README.md
├─ src
│  ├─ api
│  │  ├─ axiosConfig.js
│  │  ├─ data
│  │  │  ├─ albums
│  │  │  │  └─ album.js
│  │  │  ├─ artists
│  │  │  │  └─ artist.js
│  │  │  ├─ auth
│  │  │  │  └─ auth.js
│  │  │  ├─ favorites
│  │  │  │  └─ favorite.js
│  │  │  ├─ playlists
│  │  │  │  └─ playlist.js
│  │  │  ├─ playlistsongs
│  │  │  │  └─ playlistsongs.js
│  │  │  ├─ ratings
│  │  │  │  └─ rating.js
│  │  │  ├─ songs
│  │  │  │  └─ song.js
│  │  │  └─ users
│  │  │     └─ user.js
│  │  └─ utility
│  │     ├─ commonUtils.js
│  │     ├─ genreTypes.js
│  │     └─ stripePayment.js
│  ├─ App.css
│  ├─ App.jsx
│  ├─ assets
│  │  ├─ images
│  │  │  ├─ ArtistRegisterLoginImage.png
│  │  │  ├─ AudioWave.png
│  │  │  ├─ backgraphics.png
│  │  │  ├─ phone_view_1.png
│  │  │  ├─ phone_view_2.png
│  │  │  ├─ phone_view_3.png
│  │  │  ├─ phone_view_4.png
│  │  │  ├─ premium_upgrade_logo_1.jpg
│  │  │  ├─ premium_upgrade_logo_2.jpg
│  │  │  ├─ premium_upgrade_logo_3.jpg
│  │  │  ├─ RegisterLoginImage.jpg
│  │  │  └─ SongWave2.png
│  │  └─ logo
│  │     ├─ logo.jpg
│  │     └─ logo_no_background.png
│  ├─ cloudinary
│  │  └─ cloudinary.js
│  ├─ Components
│  │  ├─ AdminDashboard
│  │  │  └─ AdminDashboard.jsx
│  │  ├─ AdminProfileComponent
│  │  │  └─ AdminProfileComponent.jsx
│  │  ├─ ArtistComponent
│  │  │  ├─ ArtistComponent.css
│  │  │  └─ ArtistComponent.jsx
│  │  ├─ ArtistDashboard
│  │  │  ├─ ArtistDashboard.css
│  │  │  └─ ArtistDashboard.jsx
│  │  ├─ ArtistLoginPage
│  │  │  └─ ArtistLogin.jsx
│  │  ├─ ArtistProfileComponent
│  │  │  └─ ArtistProfileComponent.jsx
│  │  ├─ ArtistRegisterPage
│  │  │  └─ ArtistRegister.jsx
│  │  ├─ CheckoutComponent
│  │  │  ├─ CheckoutComponent.css
│  │  │  └─ CheckoutComponent.jsx
│  │  ├─ DashboardComponent.jsx
│  │  ├─ LandingPageComponent
│  │  │  ├─ Body
│  │  │  │  ├─ LandingPageBody.css
│  │  │  │  └─ LandingPageBody.jsx
│  │  │  ├─ Footer
│  │  │  │  ├─ Footer.css
│  │  │  │  └─ Footer.jsx
│  │  │  ├─ Header
│  │  │  │  └─ Header.jsx
│  │  │  ├─ LandingPageComponent.css
│  │  │  └─ LandingPageComponent.jsx
│  │  ├─ LoginComponent
│  │  │  └─ LoginComponent.jsx
│  │  ├─ LogoutComponent
│  │  │  └─ LogoutComponent.jsx
│  │  ├─ ManageAlbumComponent
│  │  │  └─ ManageAlbumComponent.jsx
│  │  ├─ ManageArtistComponent
│  │  │  ├─ ManageArtistComponent.css
│  │  │  └─ ManageArtistComponent.jsx
│  │  ├─ ManageArtistSong
│  │  │  ├─ ManageArtistSong.css
│  │  │  └─ ManageArtistSong.jsx
│  │  ├─ ManagePlaylistsComponent
│  │  │  ├─ ManagePlaylistsComponent.css
│  │  │  └─ ManagePlaylistsComponent.jsx
│  │  ├─ ManageSongsComponent
│  │  │  ├─ ManageSongsComponent.css
│  │  │  └─ ManageSongsComponent.jsx
│  │  ├─ ManageUsersComponent
│  │  │  ├─ ManageUsersComponent.css
│  │  │  └─ ManageUsersComponent.jsx
│  │  ├─ MusicPlayerComponent
│  │  │  ├─ MusicPlayer.css
│  │  │  └─ MusicPlayerComponent.jsx
│  │  ├─ NavbarComponent
│  │  │  ├─ NavbarComponent.css
│  │  │  └─ NavbarComponent.jsx
│  │  ├─ PlaylistComponent
│  │  │  ├─ PlaylistComponent.css
│  │  │  └─ PlaylistComponent.jsx
│  │  ├─ PlaylistSongsComponent
│  │  │  ├─ PlaylistSongsComponent.css
│  │  │  └─ PlaylistSongsComponent.jsx
│  │  ├─ PremiumNotificationComponent
│  │  │  └─ PremiumNotificationComponent.jsx
│  │  ├─ ProfileComponent
│  │  │  ├─ ProfileComponent.css
│  │  │  └─ ProfileComponent.jsx
│  │  ├─ RegisterComponent
│  │  │  └─ RegisterComponent.jsx
│  │  ├─ SongComponent
│  │  │  ├─ SongComponent.css
│  │  │  └─ SongComponent.jsx
│  │  ├─ SongsComponent
│  │  │  ├─ SongsComponent.css
│  │  │  ├─ SongsComponent.jsx
│  │  │  └─ SongsPage.jsx
│  │  ├─ UserDashboard
│  │  │  ├─ UserDashboard.css
│  │  │  └─ UserDashboard.jsx
│  │  └─ VerificationComponent
│  │     └─ VerificationComponent.jsx
│  ├─ contexts
│  │  ├─ AuthContext.jsx
│  │  └─ MusicContext.jsx
│  ├─ css
│  │  ├─ LeftNavbar.css
│  │  └─ TopNavbar.css
│  ├─ index.css
│  ├─ main.jsx
│  ├─ ProtectedRoute.jsx
│  └─ routes
│     └─ ArtistProtectedRoute.jsx
├─ staticwebapp.config.json
└─ vite.config.js

```

## Contributing

1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

For detailed documentation, please refer to the source code and comments within the application.
