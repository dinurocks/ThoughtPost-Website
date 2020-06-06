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
      disabledShareButton: -1,
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
      file: "",
    };
  }

  showUserData = () =>
    profileInfo(this.props.usrid)
      .then((res) => {
        this.setState({ userInfo: res.data });
        this.setState({
          name: this.state.userInfo.name,
          email: this.state.userInfo.email,
          mobile: JSON.stringify(this.state.userInfo.mobile),
        });
        this.setState({ postName: this.state.name });
      })
      .catch((err) => {
        console.log(err);
      });

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
    let fd = new FormData();
    fd.append("id", this.props.usrid);
    fd.append("post", this.state.post);
    fd.append("myImage", this.state.file);

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

  componentDidMount() {
    this.showUserData();
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
    this.setState({ onShare: !this.state.onShare, sharePostId: postId });
  };

  toggleProfile = () => {
    this.setState({ onProfile: !this.state.onProfile });
  };

  handleShare = (userId) => {
    this.setState({ disabledShareButton: userId, shareButtonText: true });
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
        updateProfileInfo(
          this.props.usrid,
          this.state.name,
          this.state.email,
          this.state.mobile
        )
          .then((res) => {
            this.setState({
              editable: true,
              submitp: "Edit",
              nameError: "",
              emailError: "",
              mobileError: "",
            });

            updatePostUserName(this.props.usrid, this.state.name).catch(
              (err) => {
                console.log(err);
              }
            );

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

            this.showUserData();
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

    // console.log("data", postArray);
    return (
      <div className={"bckgrnd1"}>
        <div className="container ">
          <div className="row" style={{ paddingTop: 20 }}>
            <div>
              <input
                type="text"
                value={this.state.searchFollowUser}
                name="searchFollowUser"
                placeholder="Search users to follow"
                onChange={this.handleChange}
                className="form-control fa fa-search form-control-feedback  "
                style={{
                  width: 500,
                  marginRight: 435,
                  marginLeft: 70,
                  marginTop: -2,
                }}
              />
            </div>

            <div className="row">
              <button
                style={{ border: "none", marginLeft: -220, marginTop: -3 }}
                className=" profileButton"
                onClick={this.toggleProfile}
              >
                <FontAwesomeIcon
                  icon={faUser}
                  size="lg"
                  color="black"
                  style={{ marginRight: 160 }}
                />
                <p
                  style={{
                    fontSize: 17,
                    fontWeight: "bold",
                    color: "black",
                    marginTop: -25,
                  }}
                >
                  {this.state.postName}
                </p>
              </button>
            </div>

            <div className="logout" style={{ marginLeft: 20 }}>
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
          </div>

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
                      <p
                        style={{
                          marginTop: 22,
                          fontSize: 20,
                          marginRight: 90,
                          marginBottom: 20,
                          marginLeft: 40,
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
                        width: "30%",
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
                    <div>
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
                                    style={{ marginBottom: -45 }}
                                    className="row"
                                  >
                                    <img
                                      src={
                                        " http://localhost:3003/static/" +
                                        show.postImage
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
                                      <p style={{ color: "grey" }}>
                                        ({moment(show.time).fromNow()})
                                      </p>{" "}
                                    </p>
                                  </div>
                                </p>
                              ) : (
                                <div
                                  className="row"
                                  style={{ marginBottom: -45 }}
                                >
                                  <img
                                    src={
                                      " http://localhost:3003/static/" +
                                      show.postImage
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
                                    <p style={{ color: "grey" }}>
                                      ({moment(show.time).fromNow()})
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

                            <p style={{ marginBottom: -17 }}>
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
                                    height: "50%",
                                    objectFit: "cover",
                                    marginTop: -17,
                                  }}
                                  alt="postImages"
                                />
                              )}
                            </p>

                            <hr />

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
                                  marginLeft: 430,
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
                                  style={{ backgroundColor: "grey" }}
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
                                    backgroundColor: "rgb(232, 232, 232)",
                                  }}
                                >
                                  <div>
                                    <tbody style={{ flex: 1 }}>
                                      {showShareUsers.map((kk, i) => (
                                        <tr key={i}>
                                          <td>
                                            <p
                                              style={{
                                                fontSize: 20,
                                                marginRight: 90,
                                                marginBottom: 20,
                                              }}
                                            >
                                              {kk.name}
                                            </p>
                                          </td>

                                          <td style={{}}>
                                            <button
                                              style={{
                                                backgroundColor:
                                                  "rgb(232, 232, 232)",
                                                border: "none",
                                                marginLeft: 200,
                                                marginBottom: 18,
                                              }}
                                              onClick={() => {
                                                this.handleShare(kk._id);
                                              }}
                                              disabled={
                                                this.state
                                                  .disabledShareButton ===
                                                kk._id
                                              }
                                            >
                                              {this.state.shareButtonText &&
                                              this.state.disabledShareButton ===
                                                kk._id ? (
                                                <FontAwesomeIcon
                                                  icon={faCheckCircle}
                                                  size="2x"
                                                  color="green"
                                                />
                                              ) : (
                                                <FontAwesomeIcon
                                                  icon={faShareSquare}
                                                  size="lg"
                                                  color="grey"
                                                />
                                              )}
                                            </button>
                                          </td>
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
                                  </div>
                                </Modal.Body>
                              </Modal>

                              <Modal
                                show={this.state.onProfile}
                                onHide={this.toggleProfile}
                              >
                                <Modal.Header>
                                  <Modal.Title className="w-100 text-center">
                                    User Info
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
