import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errMsg: ''}

  updateUsername = event => {
    this.setState({username: event.target.value})
  }

  updatePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitForm = async event => {
    const {username, password} = this.state
    event.preventDefault()
    const url = 'https://apis.ccbp.in/login'
    const userDetails = {
      username,
      password,
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      Cookies.set('jwt_token', data.jwt_token, {expires: 30})
      const {history} = this.props
      history.replace('/')
    } else {
      this.setState({errMsg: data.error_msg})
    }
  }

  render() {
    const {username, password, errMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container d-flex justify-content-around align-items-center">
        <img
          src="https://iili.io/JgGKzeS.png"
          className="login-image"
          alt="website login"
        />
        <form className="login-form p-5" onSubmit={this.onSubmitForm}>
          <div className="logo-container text-center">
            <img
              src="https://iili.io/JgGBJeV.png"
              className="insta-logo"
              alt="website logo"
            />
            <h1 className="logo-name">Insta Share</h1>
          </div>
          <div className="username-input">
            <label className="d-block" htmlFor="username">
              USERNAME
            </label>
            <input
              className="form-input"
              placeholder="Rahul|"
              type="input"
              id="username"
              value={username}
              onChange={this.updateUsername}
            />
          </div>
          <br />
          <div className="username-input">
            <label className="d-block" htmlFor="password">
              PASSWORD
            </label>
            <input
              placeholder="********"
              className="form-input"
              type="password"
              id="password"
              value={password}
              onChange={this.updatePassword}
            />
          </div>
          <p className="err-msg">{errMsg}</p>
          <button type="submit" className="btn btn-primary login-button">
            Login
          </button>
        </form>
      </div>
    )
  }
}

export default Login
