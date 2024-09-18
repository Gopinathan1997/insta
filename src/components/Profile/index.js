import {Component} from 'react'
import Cookies from 'js-cookie'
import { TailSpin } from "react-loader-spinner";
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import Header from '../Header'
import './index.css'
import SearchContext from '../../context/SearchContext'

const apiconstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Profile extends Component {
  state = { profileDetails: [], apiStatus: apiconstants.initial };

  componentDidMount() {
    this.getProfileDetails();
  }

  renderProfileSuccessView = () => {
    const { profileDetails } = this.state;
    const { profile } = profileDetails;
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
    } = profile;
    return (
      <div className="profile-container">
        <div className="user-details d-flex">
          <img className="profile-pic" src={profilePic} alt="user profile" />
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
          {stories.map((each) => (
            <li key={each.id} className="story-container">
              <img
                className="profile-story-image"
                src={each.image}
                alt="my story"
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
          <ul className="profile-post d-flex flex-wrap justify-content-between">
            {posts.map((eachPost) => (
              <li key={eachPost.id}>
                <img
                  className="profile-post-image"
                  alt="my post"
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
    );
  };

  getProfileDetails = async () => {
    this.setState({ apiStatus: apiconstants.inProgress });
    const url = "https://apis.ccbp.in/insta-share/my-profile";
    const token = Cookies.get("jwt_token");
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, options);
    if (response.ok) {
      const profileDetails = await response.json();
      const formattedProfiledetails = {
        profile: {
          followersCount: profileDetails.profile.followers_count,
          followingCount: profileDetails.profile.following_count,
          id: profileDetails.profile.id,
          postsCount: profileDetails.profile.posts_count,
          profilePic: profileDetails.profile.profile_pic,
          userBio: profileDetails.profile.user_bio,
          userId: profileDetails.profile.user_id,
          userName: profileDetails.profile.user_name,
          stories: profileDetails.profile.stories.map((each) => ({
            id: each.id,
            image: each.image,
          })),
          posts: profileDetails.profile.posts.map((each) => ({
            id: each.id,
            image: each.image,
          })),
        },
      };
      this.setState({
        apiStatus: apiconstants.success,
        profileDetails: formattedProfiledetails,
      });
      this.setSearch();
    } else {
      this.setState({ apiStatus: apiconstants.failure });
    }
  };

  setSearch = () => (
    <SearchContext.Consumer>
      {(value) => {
        const { profileDetails } = this.state;
        const upadtePosttoSearch = value;
        upadtePosttoSearch(profileDetails);
      }}
    </SearchContext.Consumer>
  );

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <TailSpin type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  );

  renderFailureView = () => (
    <div className="search-cont d-flex flex-column justify-content-center align-center">
      <img
        className="failure-img"
        src="https://res.cloudinary.com/dziwdneks/image/upload/v1675454266/HomeFaillureImg_qz05si.png"
        alt="failure view"
      />
      <h1 className="search-not-found">Page Not Found</h1>
      <p className="search-para">Something went wrong. Please try again</p>
      <button
        type="button"
        onClick={() => this.getProfileDetails()}
        className="home-btn btn btn-primary"
      >
        Try again
      </button>
    </div>
  );

  renderCondition = () => {
    const { apiStatus } = this.state;
    switch (apiStatus) {
      case apiconstants.success:
        return this.renderProfileSuccessView();
      case apiconstants.failure:
        return this.renderFailureView();
      case apiconstants.inProgress:
        return this.renderLoader();
      default:
        return null;
    }
  };

  renedrSearchFailure = () => (
    <div className="no-results-container">
      <img
        className="no-results-img"
        src="https://res.cloudinary.com/dziwdneks/image/upload/v1675513323/SearchNotFound_ntqrqa.png"
        alt="search not found"
      />
      <h1 className="no-results-heading">Search Not Found</h1>
      <p className="no-results-para">Try different keyword or search again</p>
    </div>
  );

  render() {
    return (
      <SearchContext.Consumer>
        {(value) => {
          const { searchInput } = value;
          return (
            <>
              {console.log(searchInput)}
              <Header />
              {this.renderCondition()}
            </>
          );
        }}
      </SearchContext.Consumer>
    );
  }
}
export default Profile
