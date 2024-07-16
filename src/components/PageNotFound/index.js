import Cookie from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

const NotFound = props => {
  const onClickHomePage = () => {
    const jwtToken = Cookie.get('jwt_token')
    const {history} = props
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return history.push('/')
  }

  return (
    <div className="search-cont d-flex flex-column justify-content-center align-center">
      <img
        src="https://iili.io/Jg6GAdX.png"
        className="search-img text-center"
        alt="page not found"
      />
      <h1 className="search-not-found">Page Not Found</h1>
      <p className="search-para">
        we are sorry, the page you requested could not be found.Please go back
        to the homepage.
      </p>
      <button
        type="button"
        onClick={onClickHomePage}
        className="home-btn btn btn-primary"
      >
        Home Page
      </button>
    </div>
  )
}

export default NotFound
