import React, { Component } from 'react'
import {addUser} from './http.service';

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
            passwordError:"",
            confirmPasswordError:""
        };
    }

    // Validation
    validate = () => {
        
        let nameError = "";
        let emailError = "";
        let mobileError = "";
        let passwordError="";
        let confirmPasswordError="";
        let nmtch = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
        !this.state.name ? nameError = "Name cannot be blank!"
            : !nmtch.test(this.state.name) ? nameError = "No special characters!"
                : nameError = "";

        let emreg = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
        !emreg.test(this.state.email) ? emailError = "Please enter a valid email"
            : emailError = "";

        let mobreg = /^[7-9][0-9]{9}$/
        !mobreg.test(this.state.mobile) ? mobileError = "Invalid mobile number!"
            : mobileError = "";

        let pass= this.state.password;
        pass!=this.state.confirmPassword?confirmPasswordError = "Password didn't match"
            :confirmPasswordError = "";

            let passwrd=/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d^a-zA-Z0-9].{5,50}$/;
            !passwrd.test(this.state.password) ? 
            passwordError = "Min chars '6', 1 letter " //should contain 1 letter and 1 number
            : passwordError= "";
        if (nameError || emailError || mobileError || passwordError || confirmPasswordError) {
            this.setState({ nameError, emailError, mobileError, passwordError, confirmPasswordError });
            return false;
        }
        return true;
    };



    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit= (event) =>{
        event.preventDefault();
        if (this.validate()) {
        addUser(this.state).then((res) => {
            this.props.history.push("/login");
        }).catch((err) => {
            if (err.response) {
               
                console.log(err.response.data);
            } else {
                console.log(err);
            }
        });
    }
}
    render() {
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-11 offset-md-2 tp">
                            <form  onSubmit={this.handleSubmit}>
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Name</label>
                                    <div className="col-sm-7">
                                        <input type="text" onChange={this.handleChange} value={this.state.name} className="form-control" name="name" placeholder="Enter your name" />
                                    </div>
                                </div>
                                    <span >{this.state.nameError}</span>

                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Email</label>
                                    <div className="col-sm-7">
                                        <input type="text" onChange={this.handleChange} value={this.state.email} className="form-control" name="email" placeholder="Enter your email" />
                                    </div>
                                </div>
                                    <span  >{this.state.emailError}</span>

                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Mobile</label>
                                    <div className="col-sm-7">
                                        <input type="text" onChange={this.handleChange} value={this.state.mobile} className="form-control" name="mobile" placeholder="Enter your mobile number" />
                                    </div>
                                </div>
                                    <span >{this.state.mobileError}</span>

                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Password</label>
                                    <div className="col-sm-7">
                                        <input type="password" onChange={this.handleChange} value={this.state.password} className="form-control" name="password" placeholder="Enter your password" />
                                    </div>
                                </div>
                                        <span >{this.state.passwordError}</span>
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Confirm Password</label>
                                    <div className="col-sm-7">
                                        <input type="password" onChange={this.handleChange} value={this.state.confirmPassword} className="form-control" name="confirmPassword" placeholder="Confirm Password" />
                                    </div>
                                </div>
                                    <span >{this.state.confirmPasswordError}</span>
                                <div>
                                <button type="submit" className="btn btn-success">Register</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
              
            </div>
        )
    }
}

export default Registration

