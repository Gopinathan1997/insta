import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import Header from '../Header'
import './index.css'

const apiconstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class UserProfile extends Component {
  state = {userProfileDetails: [], apiStatus: apiconstants.initial}

  componentDidMount() {
    this.getDatafromApi()
  }

  renderProfileSuccessView = () => {
    const {userProfileDetails} = this.state
    const {profile} = userProfileDetails
    const {
      followersCount,
      followingCount,
      posts,
      postsCount,
      profilePic,
      stories,
      userBio,
      userId,
      userName,
    } = profile
    return (
      <div className="profile-container container">
        <div className="user-details d-flex">
          <img className="profile-pic" src={profilePic} alt={userName} />
          <div className="bio-details-container">
            <h1 className="profile-username">{userName}</h1>
            <ul className="count-container">
              <li className="list-inline-item profile-list">
                <p>
                  <span>{postsCount} </span> posts
                </p>
              </li>
              <li className="list-inline-item profile-list">
                <p>
                  <span>{followersCount} </span> followers
                </p>
              </li>
              <li className="list-inline-item profile-list">
                <p>
                  <span> {followingCount}</span> following
                </p>
              </li>
            </ul>
            <p className="profile-userid">{userId}</p>
            <p className="profile-bio">{userBio}</p>
          </div>
        </div>
        <br />
        <ul className="profile-story">
          {stories.map(each => (
            <li key={each.id} className="story-container">
              <img
                className="profile-story-image"
                src={each.image}
                alt="user story"
              />
            </li>
          ))}
        </ul>
        <hr className="profile-hr" />
        <br />
        <div className="post-text d-flex align-center">
          <BsGrid3X3 size={24} />
          <h1 className="profile-post-">Posts</h1>
        </div>
        <br />
        {posts.length > 0 ? (
          <ul className="d-flex flex-wrap justify-content-between profile-post">
            {posts.map(eachPost => (
              <li className="" key={eachPost.id}>
                <img
                  className="profile-post-image"
                  alt="user post"
                  src={eachPost.image}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="camera-circle text-center d-flex justify-content-center align-items-center">
              <BiCamera size={45} />
            </div>
            <h1 className="no-post">No Posts Yet</h1>
          </div>
        )}
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        className="user-profile-failure-img"
        src="https://res.cloudinary.com/dziwdneks/image/upload/v1675454266/HomeFaillureImg_qz05si.png"
        alt="failure view"
      />
      <p className="failure-heading">Something went wrong. Please try again</p>
      <button
        onClick={() => this.getDatafromApi()}
        type="submit"
        className="failure-button"
      >
        Try again
      </button>
    </div>
  )

  getDatafromApi = async () => {
    this.setState({apiStatus: apiconstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {userId} = params
    console.log(this.props)
    const url = `https://apis.ccbp.in/insta-share/users/${userId}`
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const profileDetails = await response.json()

      const formattedProfiledetails = {
        profile: {
          followersCount: profileDetails.user_details.followers_count,
          followingCount: profileDetails.user_details.following_count,
          id: profileDetails.user_details.id,
          postsCount: profileDetails.user_details.posts_count,
          profilePic: profileDetails.user_details.profile_pic,
          userBio: profileDetails.user_details.user_bio,
          userId: profileDetails.user_details.user_id,
          userName: profileDetails.user_details.user_name,
          stories: profileDetails.user_details.stories.map(each => ({
            id: each.id,
            image: each.image,
          })),
          posts: profileDetails.user_details.posts.map(each => ({
            id: each.id,
            image: each.image,
          })),
        },
      }
      this.setState({
        apiStatus: apiconstants.success,
        userProfileDetails: formattedProfiledetails,
      })
    } else {
      this.setState({apiStatus: apiconstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderUserProfileCondition = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiconstants.success:
        return this.renderProfileSuccessView()
      case apiconstants.failure:
        return this.renderFailureView()
      case apiconstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderUserProfileCondition()}
      </div>
    )
  }
}
export default UserProfile
