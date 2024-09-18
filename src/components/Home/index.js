import { Component } from "react";
import { TailSpin } from "react-loader-spinner";
import Cookies from "js-cookie";
import Slider from "react-slick";
import "./index.css";

import Header from "../Header";
import PostItem from "../PostItem";

const apiconstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

class Home extends Component {
  state = {
    storiesData: [],
    postsData: [],
    storiesApi: apiconstants.initial,
    postsApi: apiconstants.initial,
  };

  componentDidMount() {
    this.getStoriesData();
    this.getPostsData();
  }

  getStoriesData = async () => {
    this.setState({ storiesApi: apiconstants.inProgress });
    const token = Cookies.get("jwt_token");
    const url = "https://apis.ccbp.in/insta-share/stories";
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, options);
    if (response.ok) {
      const storiesData = await response.json();
      const formatedStoriesData = {
        total: storiesData.total,
        usersStories: storiesData.users_stories.map((each) => ({
          userId: each.user_id,
          storyUrl: each.story_url,
          userName: each.user_name,
        })),
      };
      this.setState({
        storiesApi: apiconstants.success,
        storiesData: formatedStoriesData,
      });
    } else {
      this.setState({ storiesApi: apiconstants.failure });
    }
  };

  getPostsData = async () => {
    this.setState({ postsApi: apiconstants.inProgress });
    const url = "https://apis.ccbp.in/insta-share/posts";
    const token = Cookies.get("jwt_token");

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, options);
    if (response.ok) {
      const postsData = await response.json();

      const formattedPostsData = {
        total: postsData.total,
        posts: postsData.posts.map((each) => ({
          createdAt: each.created_at,
          likesCount: each.likes_count,
          postId: each.post_id,
          profilePic: each.profile_pic,
          userId: each.user_id,
          likeStatus: false,
          userName: each.user_name,
          comments: each.comments.map((eachComment) => ({
            comment: eachComment.comment,
            userId: eachComment.user_id,
            userName: eachComment.user_name,
          })),
          postDetails: {
            caption: each.post_details.caption,
            imageUrl: each.post_details.image_url,
          },
        })),
      };
      this.setState({
        postsData: formattedPostsData,
        postsApi: apiconstants.success,
      });
    } else {
      this.setState({ postsApi: apiconstants.failure });
    }
  };

  initiateSearchPostLikeApi = async (postId, likeStatus) => {
    const { postsData } = this.state;
    const jwtToken = Cookies.get("jwt_token");
    const likeDetails = {
      like_status: likeStatus,
    };
    const apiUrl = `https://apis.ccbp.in/insta-share/posts/${postId}/like`;
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: "POST",
      body: JSON.stringify(likeDetails),
    };
    const response = await fetch(apiUrl, options);
    const data = await response.json();
    let userPostsData = postsData;

    userPostsData = postsData.posts.map((eachObject) => {
      if (eachObject.postId === postId && likeStatus) {
        return {
          ...eachObject,
          message: data.message,
          likesCount: eachObject.likesCount + 1,
          likeStatus: true,
        };
      }
      if (eachObject.postId === postId && !likeStatus) {
        return {
          ...eachObject,
          message: data.message,
          likesCount: eachObject.likesCount - 1,
          likeStatus: false,
        };
      }

      return eachObject;
    });
    const actualData = {
      posts: userPostsData,
      total: userPostsData.length,
    };
    this.setState({ postsData: actualData });
  };

  renderPostSuccessView = () => {
    const { postsData } = this.state;
    return (
      <ul className="posts bg">
        {postsData.posts.map((each) => (
          <li key={each.postId}>
            <PostItem
              postItemDetails={each}
              initiateSearchPostLikeApi={this.initiateSearchPostLikeApi}
            />
          </li>
        ))}
      </ul>
    );
  };

  renderStoryLoadingView = () => (
    <div
      className="story-loader-container d-flex justify-content-center align-items-center"
      data-testid="loader"
    >
      <TailSpin type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  );

  renderLoadingView = () => (
    <div
      className="loader-container m-auto d-flex justify-content-center align-items-center"
      data-testid="loader"
    >
      <TailSpin type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  );

  renderFailureView = () => (
    <div className="d-flex justify-content-center align-center">
      <img
        src="https://iili.io/Jg6GAdX.png"
        className="search-img text-center"
        alt="failure view"
      />
      <p>Something went wrong. Please try again</p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={this.getPostsData()}
      >
        Try again
      </button>
    </div>
  );

  renderAllPosts = () => {
    const { postsApi } = this.state;
    switch (postsApi) {
      case apiconstants.success:
        return this.renderPostSuccessView();
      case apiconstants.failure:
        return this.renderFailureView();
      case apiconstants.inProgress:
        return this.renderLoadingView();
      default:
        return null;
    }
  };

  renderStoryFailureView = () => (
    <div className="failure_view_container">
      <img
        src="https://res.cloudinary.com/dziwdneks/image/upload/v1675454266/HomeFaillureImg_qz05si.png"
        alt="failure view"
        className="user_story_failure_img"
      />
      <h1 className="failure_heading">
        Something went wrong. Please try again
      </h1>
      <button
        onClick={() => this.getStoriesData()}
        type="submit"
        className="failure-button"
      >
        Try Again
      </button>
    </div>
  );

  renderAllstories = () => {
    const { storiesApi } = this.state;
    switch (storiesApi) {
      case apiconstants.success:
        return this.renderStorySuccessView();
      case apiconstants.failure:
        return this.renderStoryFailureView();
      case apiconstants.inProgress:
        return this.renderStoryLoadingView();
      default:
        return null;
    }
  };

  renderStorySuccessView = () => {
    const { storiesData } = this.state;
    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      vertical:false,
      slidesToShow: 5,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 7,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 6,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 1,
          },
        },
      ],
    };

    return (
      <ul className="slider-container">
        <Slider {...settings} className="slider">
          {storiesData.usersStories.map((each) => (
            <li key={each.userId} className="story-item">
              <img
                src={each.storyUrl}
                alt="user story"
                className="story-image"
              />
              <p className="story-name">{each.userName}</p>
            </li>
          ))}
        </Slider>
      </ul>
    );
  };

  render() {
    return (
      <div>
        <Header />
        <div className="home-body">
          {this.renderAllstories()}
          {this.renderAllPosts()}
        </div>
      </div>
    );
  }
}
export default Home;
