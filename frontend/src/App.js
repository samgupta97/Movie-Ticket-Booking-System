import { Routes, Route } from "react-router-dom";
import Header from "./NavbarComponent/Header";
import AdminRegisterForm from "./UserComponent/AdminRegisterForm";
import UserLoginForm from "./UserComponent/UserLoginForm";
import UserRegister from "./UserComponent/UserRegister";
import HomePage from "./PageComponent/HomePage";

import ViewAllCustomers from "./UserComponent/ViewAllCustomers";
import AddLocation from "./LocationComponents/AddLocation";
import ViewAllLocations from "./LocationComponents/ViewAllLocations";
import Footer from "./NavbarComponent/Footer";
import LandingPage from "./PageComponent/LandingPage";
import ViewAllTheatreManagers from "./UserComponent/ViewAllTheatreManagers";
import AddTheatreForm from "./TheatreComponents/AddTheatreForm";
import TheatreDetail from "./TheatreComponents/TheatreDetail";
import ViewPendingTheatres from "./TheatreComponents/ViewPendingTheatres";
import ViewApprovedTheatres from "./TheatreComponents/ViewApprovedTheatres";
import AddMovieForm from "./MovieComponents/AddMovieForm";
import AddScreenForm from "./ScreenComponents/AddScreenForm";
import ViewTheatreScreens from "./ScreenComponents/ViewTheatreScreens";
import ViewTheatreMovies from "./MovieComponents/ViewTheatreMovies";

import AddShowForm from "./ShowsComponents/AddShowForm";
import ViewTheatreShows from "./ShowsComponents/ViewTheatreShows";
import ViewShowDetail from "./ShowsComponents/ViewShowDetail";
import TheatreWallet from "./UserComponent/TheatreWallet";
import CustomerWallet from "./UserComponent/CustomerWallet";
import TheatreShows from "./ShowsComponents/TheatreShows";
import CustomerBookings from "./ShowBookingComponents/CustomerBookings";
import TheatreBookings from "./ShowBookingComponents/TheatreBookings";
import AllTheatreBookings from "./ShowBookingComponents/AllTheatreBookings";
import ViewAllTheatreShows from "./ShowsComponents/ViewAllTheatreShows";
import ViewAllTheatreMovies from "./MovieComponents/ViewAllTheatreMovies";
import ViewAllTheatreScreens from "./ScreenComponents/ViewAllTheatreScreens";
import AddMovieReview from "./ReviewComponent/AddMovieReview";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/theatres" element={<HomePage />} />
        <Route path="/user/admin/register" element={<AdminRegisterForm />} />
        <Route path="/user/login" element={<UserLoginForm />} />
        <Route path="/user/customer/register" element={<UserRegister />} />
        <Route path="/user/theatre/register" element={<UserRegister />} />
        <Route
          path="/food/category/:categoryId/:categoryName"
          element={<HomePage />}
        />
        <Route path="/admin/customer/all" element={<ViewAllCustomers />} />
        <Route path="/location/add" element={<AddLocation />} />
        <Route path="/location/view/all" element={<ViewAllLocations />} />
        <Route path="/theatre/add" element={<AddTheatreForm />} />
        <Route path="/theatre/detail/view" element={<TheatreDetail />} />
        <Route path="/theatre/pending" element={<ViewPendingTheatres />} />
        <Route path="/theatre/approved" element={<ViewApprovedTheatres />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/theatre/show/detail/:showId" element={<ViewShowDetail />} />
        <Route
          path="/admin/theatre/manager/all"
          element={<ViewAllTheatreManagers />}
        />
        <Route path="/theatre/movie/add" element={<AddMovieForm />} />
        <Route path="/theatre/screen/add" element={<AddScreenForm />} />
        <Route path="/theatre/screen/view" element={<ViewTheatreScreens />} />
        <Route path="/theatre/movie/view" element={<ViewTheatreMovies />} />

        <Route path="/theatre/show/add" element={<AddShowForm />} />
        <Route path="/theatre/show/view" element={<ViewTheatreShows />} />
        {/* <Route path="/theatre/show/detail" element={<ViewShowDetail />} /> */}
        <Route path="/theatre/wallet/detail" element={<TheatreWallet />} />
        <Route path="/customer/wallet/detail" element={<CustomerWallet />} />
        <Route
          path="/customer/theatre/:theatreId/shows"
          element={<TheatreShows />}
        />
        <Route path="/customer/show/bookings" element={<CustomerBookings />} />
        <Route path="/theatre/show/bookings" element={<TheatreBookings />} />
        <Route
          path="/admin/theatre/show/bookings"
          element={<AllTheatreBookings />}
        />
        <Route
          path="/admin/theatre/show/all"
          element={<ViewAllTheatreShows />}
        />
        <Route
          path="/admin/theatre/movies/all"
          element={<ViewAllTheatreMovies />}
        />
        <Route
          path="/admin/theatre/screen/all"
          element={<ViewAllTheatreScreens />}
        />

        <Route
          path="/theatre/movie/:movieId/review/add"
          element={<AddMovieReview />}
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
