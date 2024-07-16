import {Component} from 'react'
import {Link} from 'react-router-dom'
import {BsHeart} from 'react-icons/bs'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'
import {FcLike} from 'react-icons/fc'

import './index.css'

class PostItem extends Component {
  onLike = () => {
    const {postItemDetails, initiateSearchPostLikeApi} = this.props
    const {postId} = postItemDetails
    initiateSearchPostLikeApi(postId, true)
  }

  onUnLike = () => {
    const {postItemDetails, initiateSearchPostLikeApi} = this.props
    const {postId} = postItemDetails
    initiateSearchPostLikeApi(postId, false)
  }

  render() {
    const {postItemDetails} = this.props
    const {
      profilePic,
      postDetails,
      comments,
      createdAt,
      likesCount,
      postId,
      userId,
      likeStatus,
      userName,
    } = postItemDetails

    return (
      <li key={postId} className="posts-container">
        <div className="d-flex align-center">
          <img
            src={profilePic}
            alt="post author profile"
            className="post-user-dp"
          />
          <Link to={`/users/${userId}`} className="post-user-detail">
            <p className="post-username">{userName}</p>
          </Link>
        </div>

        <img src={postDetails.imageUrl} alt="post" className="post-image" />
        <div className="padding">
          <div className="d-flex icon-container">
            {likeStatus ? (
              <button
                type="button"
                aria-label="button"
                className="btn"
                onClick={this.onUnLike}
                data-testid="unLikeIcon"
              >
                <FcLike size={24} className="icon" />
              </button>
            ) : (
              <button
                type="button"
                className="btn"
                data-testid="likeIcon"
                aria-label="button"
                onClick={this.onLike}
              >
                <BsHeart size={24} className="icon" />
              </button>
            )}
            <button
              data-testid="comment icon"
              type="button"
              aria-label="button"
              className="btn"
            >
              <FaRegComment size={24} className="icon" />
            </button>
            <button
              type="button"
              data-testid="share icon"
              aria-label="button"
              className="btn"
            >
              <BiShareAlt size={24} className="icon" />
            </button>
          </div>
          <p className="like">{likesCount} likes</p>
          <p>{postDetails.caption}</p>
          <ul className="render-comments">
            {comments.map(each => (
              <li className="comment-container" key={each.user_id}>
                <p className="like">
                  <span>{each.userName}</span>
                  {each.comment}
                </p>
              </li>
            ))}
          </ul>
          <p className="created">{createdAt}</p>
        </div>
      </li>
    )
  }
}
export default PostItem
