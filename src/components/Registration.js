import React, { Component } from "react";
import { addUser } from "./http.service";

export class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      mobile: "",

      password: "",
      confirmPassword: "",
      nameError: "",
      emailerror: "",
      mobileError: "",

      passwordError: "",
      confirmPasswordError: "",
    };

    localStorage.getItem("Token") && this.props.history.push('/homepage')
  }

  
  validate = () => {
    let nameError = "";
    let emailError = "";
    let mobileError = "";

    let passwordError = "";
    let confirmPasswordError = "";
    let nmtch = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    !this.state.name
      ? (nameError = "Name cannot be blank!")
      : !nmtch.test(this.state.name)
      ? (nameError = "No special characters!")
      : (nameError = "");

    let emreg = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/gim;
    !emreg.test(this.state.email)
      ? (emailError = "Please enter a valid email")
      : (emailError = "");

    let mobreg = /^[7-9][0-9]{9}$/;
    !mobreg.test(this.state.mobile)
      ? (mobileError = "Invalid mobile number!")
      : (mobileError = "");

    let pass = this.state.password;
    pass !== this.state.confirmPassword
      ? (confirmPasswordError = "Password didn't match")
      : (confirmPasswordError = "");

    let passwrd = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d^a-zA-Z0-9].{5,50}$/;
    !passwrd.test(this.state.password)
      ? (passwordError = "Min chars '6', 1 letter ")
      : (passwordError = "");
    if (
      nameError ||
      emailError ||
      mobileError ||
      passwordError ||
      confirmPasswordError
    ) {
      this.setState({
        nameError,
        emailError,
        mobileError,
        passwordError,
        confirmPasswordError,
      });
      return false;
    }
    return true;
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.validate()) {
      addUser(this.state)
        .then((res) => {
          this.props.history.push("/login");
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

  login = () => {
    this.props.history.push("/login");
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
                marginTop: "2%",
                marginBottom: 35,
              }}
            >
              Register to ThoughtPost
            </div>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group row formAlign">
                <label className="col-form-label text">Name</label>
                <div className="input">
                  <input
                    type="text"
                    onChange={this.handleChange}
                    value={this.state.name}
                    className="form-control"
                    name="name"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
              <span>{this.state.nameError}</span>

              <div className="form-group row formAlign">
                <label className=" col-form-label text">Email</label>
                <div className="input">
                  <input
                    type="text"
                    onChange={this.handleChange}
                    value={this.state.email}
                    className="form-control"
                    name="email"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <span>{this.state.emailError}</span>

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

              <div className="form-group row formAlign">
                <label className="col-form-label text">Password</label>
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
              <div className="form-group row formAlign">
                <label className="col-form-label text">
                  Confirm Password
                </label>
                <div className="input">
                  <input
                    type="password"
                    onChange={this.handleChange}
                    value={this.state.confirmPassword}
                    className="form-control"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                  />
                </div>
              </div>
              <span>{this.state.confirmPasswordError}</span>
              <div>
                <button type="submit" className="btn jjj">
                <p style={{color:'white', fontWeight:'bold', height:'auto'}}>Register</p>
                </button>
              </div>
              <div className="row ooo">
              <p id="aaaa">Don't have an account?</p>
                <button
                  id="aaa"
                  className="btn btn-link"
                  onClick={this.login}
                >
                 Login Here
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Registration;
