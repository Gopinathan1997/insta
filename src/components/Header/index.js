import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { AiFillCloseCircle } from "react-icons/ai";
import Cookies from "js-cookie";
import "./index.css";
import SearchContext from "../../context/SearchContext";
import { useState } from "react";

const Header = () => {
  const [searchInput, setSearchInput] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const navigate = useNavigate(); // Replaces history.push
  const location = useLocation(); // Replaces match.path

  const showContent = () => {
    setIsClicked((prev) => !prev);
    setSearchBarVisible(false);
  };

  const showSearchBar = () => {
    setSearchBarVisible((prev) => !prev);
  };

  const updateSearchInput = (event) => {
    setSearchInput(event.target.value);
  };

  const onLoggingOut = () => {
    Cookies.remove("jwt_token");
    navigate("/login"); // Navigate to login page after logout
  };

  const renderSearchButton = () => (
    <SearchContext.Consumer>
      {(value) => {
        const { getSearchData } = value;
        const onSearchList = () => {
          getSearchData(searchInput);
          navigate("/search"); // Navigate to search results page
          setSearchInput("");
        };

        return (
          <button
            aria-label="button"
            type="button"
            data-testid="searchIcon"
            className="s-i-cont btn"
            onClick={onSearchList}
          >
            <FaSearch size={20} className="search-icon" />
          </button>
        );
      }}
    </SearchContext.Consumer>
  );

  const isProfile = location.pathname === "/my-profile"; // Replaces match.path logic

  return (
    <>
      <div className="mobile_container">
        <div className="top_div">
          <div className="title_div">
            <Link to="/">
              <img
                src="https://res.cloudinary.com/dziwdneks/image/upload/v1675419223/login_icon_ekrs85.png"
                className="login-website-logo-image"
                alt="website logo"
              />
            </Link>
            <h1 className="title_heading">Insta Share</h1>
          </div>
          <button
            aria-label="button"
            onClick={showContent}
            data-testid="hamburgerIcon"
            className="hamburgerButton"
            type="button"
          >
            <IoMenu className="hamburgerIcon" />
          </button>
        </div>
        {isClicked && (
          <div className="links_div">
            <ul className="nav_bar">
              <Link to="/" className="nav_item">
                <li className={isProfile ? "black" : "blue"}>Home</li>
              </Link>
              <Link to="/my-profile" className="nav_item">
                <li className={isProfile ? "blue" : ""}>Profile</li>
              </Link>
              <li onClick={showSearchBar}>Search</li>
            </ul>
            <button
              onClick={onLoggingOut}
              type="button"
              className="logout_button btn btn-primary"
            >
              Logout
            </button>
            <button
              aria-label="button"
              onClick={showContent}
              type="button"
              className="hamburgerButton"
            >
              <AiFillCloseCircle className="hamburgerIcon" />
            </button>
          </div>
        )}
        {searchBarVisible && (
          <div className="search_div">
            <input
              onChange={updateSearchInput}
              className="searchBar"
              type="search"
              placeholder="Search Caption"
            />
            {renderSearchButton()}
          </div>
        )}
      </div>
      <nav className="large-device  nav-bar">
        <div className="d-flex align-center">
          <Link to="/" className="header-logo-container">
            <img
              src="https://iili.io/JgGBJeV.png"
              className="header-logo"
              alt="website logo"
            />
          </Link>
          <h1 className="header-logo-name">Insta Share</h1>
        </div>

        <div className="d-flex header-search-container">
          <input
            type="search"
            onChange={updateSearchInput}
            className="header-search-input"
            placeholder="Search Caption"
          />
          {renderSearchButton()}
        </div>
        <ul>
          <li>
            <Link
              className={isProfile ? " home black" : "home"}
              to="/"
              value="home"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className={isProfile ? "profile blue" : "profile"}
              to="/my-profile"
              value="profile"
            >
              Profile
            </Link>
          </li>
          <li>
            <button
              type="button"
              className="logout btn btn-primary"
              onClick={onLoggingOut}
            >
              Logout
            </button>
          </li>
        </ul>

        <hr className="hr" />
      </nav>
    </>
  );
};

export default Header;
