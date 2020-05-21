import React, { Component } from "react";
import { checkUserMobPassword } from "./http.service";
import { myActionTkn } from "../actions/action";
import { connect } from "react-redux";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: "",
      mobileError: "",
      password: "",
      passwordError: "",
      token: "",
      userId: "",
      username: "",
      useremail: "",
    };

   localStorage.getItem("Token") && this.props.history.push('/homepage')
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  register = () => {
    this.props.history.push("/home");
  };
  
  validate = () => {
    let mobileError = "";
    let passwordError = "";

    let mobreg = /^[7-9][0-9]{9}$/;
    !mobreg.test(this.state.mobile)
      ? (mobileError = "Invalid mobile number!")
      : (mobileError = "");

    let passwrd = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d^a-zA-Z0-9].{5,50}$/;
    !passwrd.test(this.state.password)
      ? (passwordError = "Min chars '6', 1 letter ") 
      : (passwordError = "");
    if (mobileError || passwordError) {
      this.setState({ mobileError, passwordError });
      return false;
    }
    return true;
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.validate()) {
      checkUserMobPassword(this.state)
        .then((res) => {
          console.log(res);
          this.setState({
            token: res.headers.auth,
            userId: res.data.userid,
            username: res.data.name,
            useremail: res.data.email,
          });
          
          localStorage.setItem("Token", res.headers.auth);

          this.props.save(
            this.state.token,
            this.state.userId,
            this.state.username,
            this.state.useremail
          );
          console.log("state token id user", this.state.userId);
          this.props.history.push("/homepage");
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

  render() {
    return (
      <div>
        <div className="container">
          <div className="contentAlign">
            
            <div
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 30,
                marginTop: "10%",
                marginBottom: 35,
              
              }}
            >
              Login To ThoughtPost
            </div>
              
            <form onSubmit={this.handleSubmit}>
              <div className="form-group row formAlign">
                <label className="col-form-label text">Mobile</label>
                <div className="input">
                  <input
                    type="text"
                    onChange={this.handleChange}
                    value={this.state.mobile}
                    className="form-control"
                    name="mobile"
                    placeholder="Enter your mobile number"
                  />
                </div>
              </div>
             
            <span>{this.state.mobileError}</span>
              <div className="form-group row formAlign ">
                <label className=" col-form-label text">Password</label>
                <div className="input">
                  <input
                    type="password"
                    onChange={this.handleChange}
                    value={this.state.password}
                    className="form-control"
                    name="password"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
              <span>{this.state.passwordError}</span>

              <div>
                <button type="submit" className="btn  jjj">
                <p style={{color:'white', fontWeight:'bold', height:'auto'}}>Login</p>
                </button>
              </div>

              <div className="row ooo">
                <p id="aaaa">Don't have an account?</p>
                <button
                  id="aaa"
                  className="btn btn-link"
                  onClick={this.register}
                >
                  Register Here
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  token: state.myReducertkn.tkn,
});

//action creator
const mapDispatchToProps = (dispatch) => ({
  save: (token, userId, username, useremail) => {
    dispatch(myActionTkn(token, userId, username, useremail));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
