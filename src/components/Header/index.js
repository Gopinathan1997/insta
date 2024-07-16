import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {FaSearch} from 'react-icons/fa'
import {GoThreeBars} from 'react-icons/go'
import {AiFillCloseCircle} from 'react-icons/ai'
import Cookies from 'js-cookie'
import './index.css'
import SearchContext from '../../context/SearchContext'

class Header extends Component {
  state = {searchInput: '', isClicked: false, searchBarVisible: false}

  showContent = () => {
    this.setState(prev => ({
      isClicked: !prev.isClicked,
      searchBarVisible: false,
    }))
  }

  showSearchBar = () => {
    this.setState(prev => ({searchBarVisible: !prev.searchBarVisible}))
  }

  upadteSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onLoggingOut = () => {
    const {history} = this.props
    console.log(this.props)
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  rendersearchButton = () => (
    <SearchContext.Consumer>
      {value => {
        const {searchInput} = this.state
        const {getSearchData} = value
        const onSearchList = () => {
          getSearchData(searchInput)
          const {history} = this.props
          history.push('/search')
          this.setState({searchInput: ''})
        }

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
        )
      }}
    </SearchContext.Consumer>
  )

  render() {
    const {isClicked, searchBarVisible} = this.state
    const {match} = this.props
    const {path} = match
    const isProfile = path === '/my-profile'
    console.log(window.innerWidth)
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
              onClick={this.showContent}
              data-testid="hamburgerIcon"
              className="hamburgerButton"
              type="button"
            >
              <GoThreeBars className="hamburgerIcon" />
            </button>
          </div>
          {isClicked && (
            <div className="links_div">
              <ul className="nav_bar">
                <Link to="/" className="nav_item">
                  <li className={isProfile ? 'black' : 'blue'}>Home</li>
                </Link>
                <Link to="/my-profile" className="nav_item">
                  <li className={isProfile ? 'blue' : ''}>Profile</li>
                </Link>
                <li onClick={this.showSearchBar}>Search</li>
              </ul>
              <button
                onClick={this.onLoggingOut}
                type="button"
                className="logout_button btn btn-primary"
              >
                Logout
              </button>
              <button
                aria-label="button"
                onClick={this.showContent}
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
                onChange={this.upadteSearchInput}
                className="searchBar"
                type="search"
                placeholder="Search Caption"
              />
              {this.rendersearchButton()}
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
              onChange={this.upadteSearchInput}
              className="header-search-input"
              placeholder="Search Caption"
            />
            {this.rendersearchButton()}
          </div>
          <ul>
            <li>
              <Link
                className={isProfile ? ' home black' : 'home'}
                to="/"
                value="home"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className={isProfile ? 'profile blue' : 'profile'}
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
                onClick={this.onLoggingOut}
              >
                Logout
              </button>
            </li>
          </ul>

          <hr className="hr" />
        </nav>
      </>
    )
  }
}
export default withRouter(Header)
