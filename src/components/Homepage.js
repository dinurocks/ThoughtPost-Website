import React, { Component } from "react";
import { connect } from "react-redux";
import {
  showUserPost,
  feedpost,
  delUser,
  getUsersByID,
  updatePostLike,
  getUsers,
  updateFollowUsers,
  updateSharedPosts,
  profileInfo,
  updateProfileInfo,
  updateUserFollowingName,
  updatePostUserName,
  updateUserSharedName,
} from "./http.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as fill,
  faTrash,
  faSignOutAlt,
  faPaperPlane,
  faUserPlus,
  faUserCheck,
  faShare,
  faShareSquare,
  faUser,
  faCamera,
  faSpaceShuttle,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart, faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";

// import { myActionTkn } from "../actions/action";

export class Homepage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showtkn: this.props.showtkn,
      userid: this.props.usrid,
      post: "",
      showing: [],
      remainingLength: 200,
      time: "",
      username: this.props.username,
      search: "",
      setLiked: false,
      registeredUsers: [],
      searchFollowUser: "",
      searchShareUser: "",
      onShare: false,
      sharePostId: "",
      disableShareButton: [],
      shareButtonText: false,
      onProfile: false,
      name: "",
      email: "",
      mobile: "",
      editable: true,
      submitp: "Edit",
      userInfo: [],
      nameError: "",
      emailError: "",
      mobileError: "",
      postName: "",
      file: null,
      userPhoto: null,
      showLikeNames: [],
      showLikePostId: "",
      likesNameVisible: false,
    };
  }

  delUser = (id, index) => {
    if (window.confirm("Do you want to delete this post?")) {
      delUser(id)
        .then(() => {
          let { showing } = this.state;
          showing.splice(index, 1);
          this.setState({ showing });
          showUserPost()
            .then((res) => {
              this.setState({ showing: res.data });
            })
            .catch((err) => {
              if (err.response) {
                console.log(err.response.data);
              } else {
                console.log(err);
              }
            });
        })
        .catch((err) => {
          if (err.response) {
            console.log(err.response.data);
          } else {
            console.log(err);
          }
        });
    }
  };

  handleSubmit = (event) => {
    console.log(this.state.file);
    event.preventDefault();
    let userImage = this.state.registeredUsers.filter(
      (x) => x._id === this.props.usrid
    );
    let fd = new FormData();
    fd.append("id", this.props.usrid);
    fd.append("post", this.state.post);
    this.state.file && fd.append("myImage", this.state.file);
    fd.append("userPhoto", userImage[0].userPhoto);

    for (var value of fd.values()) {
      console.log(value);
    }

    feedpost(fd)
      .then((res1) => {
        this.setState({ post: "", remainingLength: 200, file: "" });
        showUserPost()
          .then((res) => {
            this.setState({ showing: res.data });
          })
          .catch((err) => {
            if (err.response) {
              console.log(err.response.data);
            } else {
              console.log(err);
            }
          });
      })
      .catch((err) => {
        console.error("error occoured while user post", err.response.data);
      });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    const remainingLength = 200 - value.length;
    if (remainingLength >= 0 && e.target.name === "post") {
      this.setState({ [name]: value, remainingLength });
    }
    this.setState({ [e.target.name]: e.target.value });
  };

  showUserData = () =>
    profileInfo(this.props.usrid)
      .then((res) => {
        this.setState({ userInfo: res.data });
        this.setState({
          name: this.state.userInfo.name,
          email: this.state.userInfo.email,
          mobile: JSON.stringify(this.state.userInfo.mobile),
          userPhoto: this.state.userInfo.userPhoto,
        });
        this.setState({ postName: this.state.name });
      })
      .catch((err) => {
        console.log(err);
      });

  componentDidMount() {
    showUserPost()
      .then((res) => {
        this.setState({ showing: res.data });
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response.data);
        } else {
          console.log(err);
        }
      });

    getUsers()
      .then((res) => {
        this.setState({ registeredUsers: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
    this.showUserData();
  }

  handleLogout = () => {
    if (window.confirm("Are you sure you want to Logout")) {
      getUsersByID(this.props.usrid)
        .then((res) => {
          localStorage.clear();
          localStorage.removeItem("Token");
          this.props.history.push("/login");
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    }
  };

  handleLike = (postId, likeUsername, likeCount) => {
    updatePostLike({
      id: postId,
      userLikedName: this.state.username,
      likeCount: likeCount,
    })
      .then((res1) => {
        showUserPost()
          .then((res) => {
            this.setState({ showing: res.data });
          })
          .catch((err) => {
            if (err.response) {
              console.log("show user post err response", err.response.data);
            } else {
              console.log(err);
            }
          });
      })
      .catch((err) => {
        console.log("couldnot update like status", err);
      });
  };

  addFollowing = (registerId) => {
    updateFollowUsers({
      id: registerId,
      followUserName: this.state.postName,
      userId: this.props.usrid,
    })
      .then((res1) => {
        getUsers()
          .then((res) => {
            this.setState({ registeredUsers: res.data });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log("couldnot update user following");
      });
  };

  toggleOverlay = (postId) => {
    this.setState({
      onShare: !this.state.onShare,
      sharePostId: postId,
      disableShareButton: [],
    });
  };

  toggleProfile = () => {
    this.setState({ onProfile: !this.state.onProfile });
  };

  handleShare = (userId) => {
    // this.setState({ disabledShareButton: userId, shareButtonText: true });
    updateSharedPosts({
      id: userId,
      postId: this.state.sharePostId,
      sharedBy: this.state.postName,
      sharedById: this.props.usrid,
    })
      .then((res1) => {
        getUsers()
          .then((res) => {
            this.setState({ registeredUsers: res.data });
          })
          .catch((err) => {
            console.log(err);
          });

        this.setState({
          disableShareButton: [...this.state.disableShareButton, userId],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  validate = () => {
    let nameError = "";
    let emailError = "";
    let mobileError = "";
    let em = this.state.registeredUsers.filter(
      (x) => x.email !== this.state.userInfo.email
    );
    let b = em.map((x) => x.email);
    let c = b.filter((z) => z === this.state.email);

    let mob = this.state.registeredUsers.filter(
      (x) => x.mobile !== parseInt(this.state.userInfo.mobile)
    );

    let mobArr = mob.map((z) => z.mobile);
    let finalMob = mobArr.filter((h) => h === parseInt(this.state.mobile));

    let nmtch = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    !this.state.name
      ? (nameError = "Name cannot be blank!")
      : !nmtch.test(this.state.name)
      ? (nameError = "No special characters!")
      : (nameError = "");

    // let emreg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let emreg = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;
    !emreg.test(this.state.email)
      ? (emailError = "Please enter a valid email")
      : c.length
      ? (emailError = "Email already taken")
      : (emailError = "");

    let mobreg = /^[7-9][0-9]{9}$/;
    !mobreg.test(this.state.mobile)
      ? (mobileError = "Invalid mobile number!")
      : finalMob.length
      ? (mobileError = "Mobile already taken")
      : (mobileError = "");

    if (nameError || emailError || mobileError) {
      this.setState({ nameError, emailError, mobileError });
      return false;
    }
    return true;
  };

  save = () => {
    if (this.state.submitp === "Edit") {
      this.setState({ editable: false, submitp: "Save" });
    } else {
      if (this.validate()) {
        let newFd = new FormData();
        newFd.append("id", this.props.usrid);
        newFd.append("name", this.state.name);
        newFd.append("email", this.state.email);
        newFd.append("mobile", this.state.mobile);
        this.state.userPhoto && newFd.append("userPhoto", this.state.userPhoto);
        updateProfileInfo(newFd)
          .then((res) => {
            this.setState({
              editable: true,
              submitp: "Edit",
              nameError: "",
              emailError: "",
              mobileError: "",
            });
            this.showUserData()
              .then((ress) => {
                updatePostUserName(
                  this.props.usrid,
                  this.state.name,
                  this.state.userPhoto
                )
                  .then((res) => {
                    console.log("post photo name update");
                  })
                  .catch((err) => {
                    console.log(err);
                  });

                showUserPost()
                  .then((res) => {
                    this.setState({ showing: res.data });
                  })
                  .catch((err) => {
                    if (err.response) {
                      console.log(err.response.data);
                    } else {
                      console.log(err);
                    }
                  });
              })
              .catch((err) => {
                console.log(err);
              });

            showUserPost()
              .then((res) => {
                this.setState({ showing: res.data });
              })
              .catch((err) => {
                if (err.response) {
                  console.log(err.response.data);
                } else {
                  console.log(err);
                }
              });

            updateUserFollowingName(this.props.usrid, this.state.name).catch(
              (err) => {
                console(err);
              }
            );

            updateUserSharedName(this.props.usrid, this.state.name).catch(
              (err) => {
                console(err);
              }
            );

            getUsers()
              .then((res) => {
                this.setState({ registeredUsers: res.data });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  cancel = () => {
    this.setState({
      editable: true,
      submitp: "Edit",
      nameError: "",
      emailError: "",
      mobileError: "",
    });
    this.showUserData();
  };

  fileUpload = (e) => {
    this.setState({ file: e.target.files[0] });
  };

  uploadUserPhoto = (e) => {
    this.setState({ userPhoto: e.target.files[0] });
    console.log("userPhoto", this.state.userPhoto);
  };

  showMoreLikes = (postId) => {
    let likeName = this.state.showing.filter((x) => x._id === postId);
    let ln = likeName.map((x) => x.likes.map((y) => y.username));

    ln = ln[0].slice(1);
    this.setState({
      showLikeNames: ln,
      showLikePostId: postId,
      likesNameVisible: true,
    });
  };

  hideLikeName = () => {
    this.setState({ likesNameVisible: false });
  };

  render() {
    let showFollowUsers = [];
    if (this.state.searchFollowUser.length > 0) {
      showFollowUsers = this.state.registeredUsers.filter(
        (user) =>
          user.name
            .toLowerCase()
            .includes(this.state.searchFollowUser.toLowerCase()) &&
          user.name !== this.state.postName
      );
      showFollowUsers.sort(compare);
    }

    let showShareUsers = this.state.registeredUsers.filter((x) =>
      x.following.find((y) => y.username === this.state.postName)
    );
    function compare(a, b) {
      const bandA = a.name.toUpperCase();
      const bandB = b.name.toUpperCase();

      let comparison = 0;
      if (bandA > bandB) {
        comparison = 1;
      } else if (bandA < bandB) {
        comparison = -1;
      }
      return comparison;
    }
    showShareUsers.sort(compare);

    if (this.state.searchShareUser.length > 0) {
      showShareUsers = showShareUsers.filter((user) =>
        user.name
          .toLowerCase()
          .includes(this.state.searchShareUser.toLowerCase())
      );
    }

    var postArray = [];

    const result = this.state.registeredUsers.filter((x) =>
      x.following.find((y) => y.username === this.state.postName)
    );
    let namesArray = result.map((x) => x.name);

    postArray = this.state.showing.filter(
      (x) => namesArray.includes(x.user) || x.user === this.state.postName
    );
    const currentLoggedInUser = this.state.registeredUsers.filter(
      (x) => x.name === this.state.postName
    );
    if (currentLoggedInUser.length > 0) {
      currentLoggedInUser[0].sharedPosts.map((x) => {
        const sharedPost = this.state.showing.filter((y) => y._id === x.postId);
        let modifiedSharePost = {};
        if (sharedPost.length > 0) {
          modifiedSharePost = {
            _id: sharedPost[0]._id,
            user: sharedPost[0].user,
            post: sharedPost[0].post,
            userPhoto: sharedPost[0].userPhoto,
            postImage: sharedPost[0].postImage,
            time: x.sharedTime,
            likeCount: sharedPost[0].likeCount,
            likes: sharedPost[0].likes,
            sharedBy: x.userName,
          };
        }
        postArray.push(modifiedSharePost);
      });
    }
    postArray.sort((a, b) => {
      return new Date(b.time) - new Date(a.time);
    });

    // console.log("post", postArray);
    return (
      <div className={"bckgrnd1"}>
        <div
          style={{
            backgroundColor: "rgb(245,245,245)",
            padding: 20,
          }}
        >
          <div
            className="row"
            style={
              {
                // paddingTop: "20px",
              }
            }
          >
            <div
              className="col-md-2"
              style={{
                marginTop: -10,
              }}
            >
              <img
                src={require("../images/think.png")}
                height="50"
                width="50"
              />
            </div>
            <div className="col-md-6" style={{ marginLeft: "-5%" }}>
              <input
                type="text"
                value={this.state.searchFollowUser}
                name="searchFollowUser"
                placeholder="Search users to follow"
                onChange={this.handleChange}
                className="form-control fa fa-search form-control-feedback  "
                style={{ width: "80%" }}
              />
            </div>
            <div className="col-md-2" style={{ paddingLeft: "2%" }}>
              <button
                style={{
                  border: "none",
                }}
                className=" profileButton"
                onClick={this.toggleProfile}
              >
                <div className="row">
                  <FontAwesomeIcon
                    icon={faUser}
                    size="lg"
                    color="black"
                    style={{ marginRight: 10 }}
                  />
                  <div
                    style={{
                      fontWeight: "bolder",
                      textDecorationLine: "underline",
                    }}
                  >
                    {this.state.postName}
                  </div>
                </div>
              </button>
            </div>
            <div className="col-md-2" style={{}}>
              <button
                type="button"
                className="btn logout "
                style={{ boxShadow: "0px 39px 80px -9px #000" }}
                onClick={this.handleLogout}
                value="Submit"
              >
                <FontAwesomeIcon icon={faSignOutAlt} size="lg" color="white" />
              </button>
            </div>
          </div>
        </div>

        <div className="container ">
          {/* <div className="row" style={{ paddingTop: 20 }}>
            <div style={{ width: "40%" }}>
              <input
                type="text"
                value={this.state.searchFollowUser}
                name="searchFollowUser"
                placeholder="Search users to follow"
                onChange={this.handleChange}
                className="form-control fa fa-search form-control-feedback  "
              />
            </div>
            <div
            // className="row"
            // style={{ marginLeft: "55%", marginTop: "-3.5%" }}
            >
              <div
                // style={{ minWidth: "30%" }}
                style={{ flexDirection: "row" }}
              >
                <button
                  style={{
                    border: "none",
                    //  marginLeft: -220,
                    // marginTop: -3,
                  }}
                  className=" profileButton"
                  onClick={this.toggleProfile}
                >
                  <div
                  //  style={{ marginLeft: "45%" }}
                  >
                    <FontAwesomeIcon icon={faUser} size="lg" color="black" />
                  </div>
                </button>
              </div>
              <div
              //  style={{ marginLeft: "100%", width: "100%" }}
              >
                <p
                  style={{
                    fontSize: 17,
                    fontWeight: "bold",
                    color: "black",

                    // marginTop: -25,
                    // minWidth: "50%",
                  }}
                >
                  {this.state.postName}
                </p>
              </div>
            </div>

            <div
              className="logout"
              style={{ marginLeft: "17%", marginTop: "-3%" }}
            >
              <button
                type="button"
                className="btn "
                style={{ boxShadow: "0px 39px 80px -9px #000" }}
                onClick={this.handleLogout}
                value="Submit"
              >
                <FontAwesomeIcon icon={faSignOutAlt} size="lg" color="white" />
              </button>
            </div>
          </div> */}

          <div>
            <table
              className=""
              style={{
                marginLeft: 55,
                marginTop: 10,

                backgroundColor: "rgba(255, 255, 255, 0.9)",
                width: 500,
                borderRadius: 10,
                boxShadow: "0px 39px 80px -9px #000",
                zIndex: 100,
              }}
            >
              <tbody style={{ flex: 1 }}>
                {showFollowUsers.map((mk, i) => (
                  <tr key={i}>
                    <td>
                      <img
                        src={
                          mk.userPhoto
                            ? " http://localhost:3003/static/" + mk.userPhoto
                            : require("../images/user.png")
                        }
                        style={{
                          height: 40,
                          width: 40,
                          borderRadius: 20,
                          marginLeft: 10,
                          objectFit: "cover",
                        }}
                        alt="user image"
                      />
                    </td>
                    <td>
                      <p
                        style={{
                          marginTop: 12,
                          fontSize: 18,
                          marginRight: 230,
                          // marginBottom: 20,
                          // marginLeft: 40,
                          padding: 10,
                          textAlign: "left",
                        }}
                      >
                        {mk.name}
                      </p>
                    </td>

                    <td style={{}}>
                      {mk.following.find(
                        (follow) => follow.username === this.state.postName
                      ) ? (
                        <button
                          className="followButton"
                          style={{
                            backgroundColor: "white",
                            border: "none",

                            padding: 5,
                          }}
                          onClick={() => {
                            this.addFollowing(mk._id);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faUserCheck}
                            color="green"
                            size="lg"
                          />
                        </button>
                      ) : (
                        <button
                          className="followButton"
                          style={{
                            backgroundColor: "white",
                            border: "none",

                            padding: 5,
                          }}
                          onClick={() => {
                            this.addFollowing(mk._id);
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faUserPlus}
                            color="black"
                            size="lg"
                          />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ flex: 1 }}>
              {this.state.searchFollowUser.length > 0 &&
              showFollowUsers.length === 0 ? (
                <p
                  style={{
                    fontSize: 20,
                    textAlign: "left",
                    marginLeft: 210,
                    fontWeight: "bolder",
                  }}
                >
                  No matching users found
                </p>
              ) : (
                <> </>
              )}
            </div>
          </div>

          {this.state.searchFollowUser.length === 0 && (
            <div>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <label className="font">What's happening?</label>
                <label className="fonto">{this.state.remainingLength}</label>
              </div>

              <div className="">
                <form onSubmit={this.handleSubmit}>
                  <div className="row">
                    <textarea
                      maxLength={200}
                      style={{ resize: "none" }}
                      value={this.state.post}
                      onChange={this.handleChange}
                      name="post"
                      className=" ll"
                      rows="2"
                      placeholder="Enter your thoughts here"
                    ></textarea>
                    {/* <input
                      type="file"
                      name="myImage"
                      onChange={this.fileUpload}
                    /> */}
                    {/* bootstrap file upload */}
                    <div
                      className="custom-file "
                      style={{
                        width: "25%",
                        marginLeft: 20,
                        marginTop: 15,
                        marginRight: 40,
                      }}
                    >
                      <input
                        type="file"
                        className="custom-file-input"
                        accept="image/*"
                        name="myImage"
                        // multiple="multiple"
                        onChange={this.fileUpload}
                      />
                      <label className="custom-file-label" htmlFor="customFile">
                        {this.state.file
                          ? this.state.file.name
                          : "No File Chosen"}
                      </label>
                    </div>
                    {/* bootstrap file upload  */}
                    <div style={{ marginLeft: "-3%" }}>
                      <button
                        type="submit"
                        className="btn  sp"
                        style={{ boxShadow: "0px 39px 80px -9px #000" }}
                        value="Submit"
                        disabled={
                          this.state.file === "" && this.state.post.length === 0
                        }
                      >
                        <FontAwesomeIcon
                          icon={faPaperPlane}
                          size="lg"
                          color="white"
                        />
                      </button>
                    </div>
                  </div>
                </form>

                {postArray.length === 0 ? (
                  <p
                    style={{
                      paddingBottom: 380,
                      textAlign: "center",
                      paddingTop: 40,
                      fontSize: 20,
                    }}
                  >
                    Follow users to see their posts
                  </p>
                ) : (
                  <div className="kk" style={{ flex: 1, zIndex: 1 }}>
                    <div className="table" style={{}}>
                      {postArray.map((show, i) => (
                        <div key={i} className="tr11" style={{ flex: 1 }}>
                          <div>
                            <p
                              className="  shownameadj "
                              style={{
                                flexDirection: "row",
                                fontWeight: "bold",
                              }}
                            >
                              {" "}
                              {show.sharedBy ? (
                                <p>
                                  <p
                                    style={{
                                      color: "grey",
                                    }}
                                  >
                                    (Shared By: {show.sharedBy}){" "}
                                  </p>
                                  <div
                                    style={{ marginBottom: -35 }}
                                    className="row"
                                  >
                                    <img
                                      src={
                                        show.userPhoto &&
                                        show.userPhoto !== "null"
                                          ? " http://localhost:3003/static/" +
                                            show.userPhoto
                                          : require("../images/user.png")
                                      }
                                      style={{
                                        height: 48,
                                        width: 48,
                                        borderRadius: "50%",
                                        marginLeft: 15,
                                        marginRight: 10,
                                        marginTop: 1,
                                      }}
                                    />
                                    <p>
                                      {show.user}{" "}
                                      <p
                                        style={{ color: "grey", fontSize: 13 }}
                                      >
                                        ({moment(new Date(show.time)).fromNow()}
                                        )
                                      </p>{" "}
                                    </p>
                                  </div>
                                </p>
                              ) : (
                                <div
                                  className="row"
                                  style={{ marginBottom: -35 }}
                                >
                                  <img
                                    src={
                                      show.userPhoto &&
                                      show.userPhoto !== "null"
                                        ? " http://localhost:3003/static/" +
                                          show.userPhoto
                                        : require("../images/user.png")
                                    }
                                    style={{
                                      height: 48,
                                      width: 48,
                                      borderRadius: "50%",
                                      marginLeft: 15,
                                      marginRight: 10,
                                      marginTop: 1,
                                    }}
                                  />
                                  <p>
                                    {" "}
                                    {show.user}
                                    <p style={{ color: "grey", fontSize: 13 }}>
                                      ({moment(new Date(show.time)).fromNow()})
                                    </p>
                                  </p>
                                </div>
                              )}
                            </p>

                            {show.post && (
                              <p className="postswrap">
                                <br />
                                {show.post}
                                <br />
                              </p>
                            )}

                            <hr />

                            <p style={{ paddingTop: 5, marginBottom: -10 }}>
                              {show.postImage && (
                                <img
                                  // src="http://localhost:3003/static//15907626979034.png" // ye toh ffixx kr diya
                                  src={
                                    " http://localhost:3003/static/" +
                                    show.postImage
                                  }
                                  style={{
                                    // marginLeft: -5,
                                    // maxWidth: "1",
                                    width: "100%",
                                    height: "500px",
                                    objectFit: "contain",
                                    marginTop: -17,
                                  }}
                                  alt="postImages"
                                />
                              )}
                            </p>

                            <hr />
                            {show.likeCount !== 0 && (
                              <div>
                                <p
                                  style={{
                                    fontSize: 13,

                                    // marginRight: 10,
                                  }}
                                  className="row"
                                >
                                  <p
                                    className="row"
                                    style={{
                                      fontWeight: "bold",
                                      // marginRight: 5,
                                      marginLeft: 30,
                                      marginBottom: -10,
                                    }}
                                  >
                                    <p>Liked by: </p>
                                    {show.likeCount &&
                                      show.likes.map((x, i) => (
                                        <p
                                          style={{
                                            fontWeight: "600",
                                            marginLeft: 3,
                                            // marginRight: 10,
                                          }}
                                        >
                                          {i === 0 ? x.username : ""}
                                          {/* {x.username},{" "} */}
                                        </p>
                                      ))}
                                    <div>
                                      {show.likeCount > 1 && (
                                        <button
                                          style={{
                                            position: "absolute",
                                            marginTop: -1,
                                            // marginLeft: -2,
                                            fontSize: 13,
                                            // color: "skyblue",
                                            fontWeight: "bold",
                                          }}
                                          type="button"
                                          className="  showMore "
                                          // onClick={() => {
                                          //   this.showMoreLikes(show._id);
                                          // }}
                                          onMouseOver={() => {
                                            this.showMoreLikes(show._id);
                                          }}
                                          onMouseLeave={this.hideLikeName}
                                        >
                                          and {show.likes.length - 1}{" "}
                                          {show.likes.length - 1 === 1
                                            ? "other"
                                            : "others"}
                                        </button>
                                      )}
                                    </div>
                                    {this.state.showLikePostId === show._id &&
                                      this.state.likesNameVisible && (
                                        <div
                                          style={{
                                            backgroundColor:
                                              "rgba(222, 216, 215,0.9)",
                                            marginLeft: 150,
                                            marginTop: 20,
                                            padding: 8,
                                            fontWeight: "600",
                                            borderRadius: 10,
                                            position: "absolute",
                                            boxShadow:
                                              " 0px 39px 80px -9px #000",
                                          }}
                                        >
                                          {this.state.showLikeNames.map((x) => (
                                            <div> {x} </div>
                                          ))}
                                        </div>
                                      )}
                                  </p>
                                </p>
                              </div>
                            )}
                            <p>
                              {show.likes &&
                              show.likes.find(
                                (like) => like.username === this.state.postName
                              ) ? (
                                <button
                                  onClick={() =>
                                    this.handleLike(
                                      show._id,
                                      show.likes.username,
                                      show.likeCount
                                    )
                                  }
                                  className=" xbutton "
                                >
                                  <FontAwesomeIcon
                                    icon={fill}
                                    color="red"
                                    size="lg"
                                  />{" "}
                                  : {show.likeCount}
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    this.handleLike(
                                      show._id,
                                      show.likes.username,
                                      show.likeCount
                                    )
                                  }
                                  className=" xbutton "
                                >
                                  {" "}
                                  <FontAwesomeIcon
                                    icon={faHeart}
                                    size="lg"
                                  /> : {show.likeCount}
                                </button>
                              )}

                              <button
                                type="button"
                                className="shareButton"
                                data-toggle="modal"
                                data-target="#exampleModalLong"
                                style={{
                                  marginLeft: 360,
                                  backgroundColor: "rgba(247, 247, 247,0)",
                                  border: "none",
                                }}
                                onClick={() => {
                                  this.toggleOverlay(show._id);
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faShare}
                                  size="lg"
                                  color="black"
                                />
                              </button>

                              <Modal
                                show={this.state.onShare}
                                onHide={() => {
                                  this.toggleOverlay(show._id);
                                }}
                              >
                                <Modal.Header
                                  style={{
                                    backgroundColor: "rgb(250,250,250)",
                                  }}
                                >
                                  <Modal.Title>
                                    <div>
                                      <input
                                        type="text"
                                        value={this.state.searchShareUser}
                                        name="searchShareUser"
                                        placeholder="Search users to share"
                                        onChange={this.handleChange}
                                        className="form-control fa fa-search form-control-feedback  "
                                        style={{ width: 450 }}
                                      />
                                    </div>
                                  </Modal.Title>
                                </Modal.Header>
                                <Modal.Body
                                  style={{
                                    backgroundColor: "rgba(255, 255, 255,0.2)",
                                  }}
                                >
                                  <table>
                                    <tbody style={{ flex: 1 }}>
                                      {showShareUsers.map((kk, i) => (
                                        <tr key={i} className="shareModalTr">
                                          <td style={{}}>
                                            <img
                                              src={
                                                kk.userPhoto
                                                  ? " http://localhost:3003/static/" +
                                                    kk.userPhoto
                                                  : require("../images/user.png")
                                              }
                                              style={{
                                                height: 40,
                                                width: 40,
                                                borderRadius: 20,
                                                marginLeft: 10,
                                                objectFit: "cover",
                                              }}
                                              alt="user image"
                                            />
                                          </td>
                                          <td>
                                            <p
                                              style={{
                                                fontSize: 18,
                                                marginLeft: 10,
                                                marginBottom: 2,
                                                borderBottomWidth: 2,
                                                borderBottomColor: "black",
                                              }}
                                            >
                                              {kk.name}
                                            </p>
                                          </td>

                                          <td style={{}}>
                                            <button
                                              style={{
                                                backgroundColor:
                                                  "rgb(255, 255, 255)",
                                                border: "none",
                                                marginLeft: 230,
                                                // marginBottom: 18,
                                                // float: "right",
                                              }}
                                              onClick={() => {
                                                this.handleShare(kk._id);
                                              }}
                                              disabled={this.state.disableShareButton.find(
                                                (x) => x === kk._id
                                              )}
                                            >
                                              {this.state.disableShareButton.find(
                                                (x) => x === kk._id
                                              ) ? (
                                                <FontAwesomeIcon
                                                  icon={faCheck}
                                                  size="lg"
                                                  color="green"
                                                />
                                              ) : (
                                                <FontAwesomeIcon
                                                  icon={faShare}
                                                  size="lg"
                                                  color="grey"
                                                />
                                              )}
                                            </button>
                                          </td>
                                          <br />
                                          <br />
                                          <br />
                                        </tr>
                                      ))}
                                    </tbody>
                                    {}
                                    {this.state.searchShareUser.length > 0 &&
                                    showShareUsers.length === 0 ? (
                                      <p
                                        style={{
                                          fontSize: 20,
                                          textAlign: "center",
                                        }}
                                      >
                                        No matching users found
                                      </p>
                                    ) : showShareUsers.length === 0 ? (
                                      <p
                                        style={{
                                          fontSize: 20,
                                          textAlign: "center",
                                        }}
                                      >
                                        Follow some users to share :){" "}
                                      </p>
                                    ) : (
                                      <> </>
                                    )}
                                  </table>
                                </Modal.Body>
                              </Modal>

                              <Modal
                                show={this.state.onProfile}
                                onHide={this.toggleProfile}
                              >
                                <Modal.Header>
                                  <Modal.Title className="w-100 text-center">
                                    User Info
                                    <div>
                                      <img
                                        src={
                                          this.state.userPhoto
                                            ? "http://localhost:3003/static/" +
                                              this.state.userPhoto
                                            : require("../images/user.png")
                                        }
                                        style={{
                                          height: 75,
                                          width: 75,
                                          borderRadius: 37.5,
                                        }}
                                      />
                                      <div
                                        style={{
                                          marginTop: -25,
                                          marginLeft: 60,
                                        }}
                                      >
                                        <label for="file-input">
                                          <FontAwesomeIcon
                                            icon={faCamera}
                                            size="1x"
                                            // onClick={this.uploadUserPhoto}
                                            style={{ cursor: "pointer" }}
                                          />
                                        </label>

                                        <input
                                          id="file-input"
                                          type="file"
                                          name="userPhoto"
                                          style={{
                                            display: "none",
                                          }}
                                          onChange={this.uploadUserPhoto}
                                          disabled={this.state.editable}
                                        />
                                      </div>
                                    </div>
                                  </Modal.Title>
                                </Modal.Header>
                                <Modal.Body style={{ margin: "auto" }}>
                                  <div className="form-group row formAlign1">
                                    <label className="col-form-label text1">
                                      Name
                                    </label>
                                    <div className="input1">
                                      <input
                                        type="text"
                                        onChange={this.handleChange}
                                        value={this.state.name}
                                        className="form-control "
                                        name="name"
                                        placeholder="Enter your name"
                                        disabled={this.state.editable}
                                      />
                                    </div>
                                  </div>
                                  <p>{this.state.nameError}</p>

                                  <div className="form-group row formAlign1">
                                    <label className="col-form-label text1">
                                      Email
                                    </label>
                                    <div className="input1">
                                      <input
                                        type="text"
                                        onChange={this.handleChange}
                                        value={this.state.email}
                                        className="form-control"
                                        name="email"
                                        placeholder="Enter your email "
                                        disabled={this.state.editable}
                                      />
                                    </div>
                                  </div>
                                  <p>{this.state.emailError}</p>

                                  <div className="form-group row formAlign1">
                                    <label className="col-form-label text1">
                                      Mobile
                                    </label>
                                    <div className="input1">
                                      <input
                                        type="text"
                                        onChange={this.handleChange}
                                        value={this.state.mobile}
                                        className="form-control"
                                        name="mobile"
                                        placeholder="Enter your mobile number"
                                        disabled={this.state.editable}
                                      />
                                    </div>
                                  </div>
                                  <p>{this.state.mobileError}</p>
                                  <div style={{ margin: "auto" }}>
                                    <button
                                      className="btn"
                                      onClick={this.save}
                                      style={
                                        this.state.submitp === "Edit"
                                          ? {
                                              backgroundColor: "skyblue",
                                              height: 40,
                                              width: "auto",
                                              borderRadius: 8,
                                              alignSelf: "center",
                                            }
                                          : {
                                              backgroundColor: "green",
                                              height: 40,
                                              width: "auto",
                                              borderRadius: 8,
                                            }
                                      }
                                    >
                                      <p
                                        style={{
                                          color: "white",
                                          fontSize: 17,
                                          textAlign: "center",

                                          fontWeight: "bold",
                                        }}
                                      >
                                        {this.state.submitp}
                                      </p>
                                    </button>

                                    {!this.state.editable && (
                                      <button
                                        className="btn"
                                        onClick={this.cancel}
                                        style={{
                                          backgroundColor: "lightgrey",
                                          height: 40,
                                          width: "auto",
                                          borderRadius: 8,
                                        }}
                                      >
                                        <p
                                          style={{
                                            color: "white",
                                            fontSize: 17,
                                            textAlign: "center",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          Cancel
                                        </p>
                                      </button>
                                    )}
                                  </div>
                                </Modal.Body>
                              </Modal>

                              {this.state.postName === show.user ? (
                                <button
                                  onClick={() => {
                                    this.delUser(show._id, i);
                                  }}
                                  className=" ybutton "
                                >
                                  <FontAwesomeIcon
                                    icon={faTrash}
                                    size="lg"
                                    color="tomato"
                                  />
                                </button>
                              ) : (
                                <> </>
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state,
  showtkn: state.myReducertkn.jwt,
  usrid: state.myReducertkn.id,
  username: state.myReducertkn.username,
});

export default connect(mapStateToProps)(Homepage);
