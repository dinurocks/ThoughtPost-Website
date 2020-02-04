import React, { Component } from 'react'
import {checkUserMobPassword} from './http.service'
import { myActionTkn} from '../actions/action';
import { connect } from 'react-redux';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
         
            mobile: "",
            mobileError:"",
            password: "",
            passwordError:"",
            token:"",
            userId: ""
        };
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    //Validation
    validate = () => {
        
      
        let mobileError = "";
        let passwordError="";
      
        let mobreg = /^[7-9][0-9]{9}$/
        !mobreg.test(this.state.mobile) ? mobileError = "Invalid mobile number!"
            : mobileError = "";

        let passwrd=/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d^a-zA-Z0-9].{5,50}$/;
        !passwrd.test(this.state.password) ? 
        passwordError = "Min chars '6', 1 letter " //should contain 1 letter and 1 number
        : passwordError= "";
        if ( mobileError || passwordError ) {
            this.setState({mobileError, passwordError});
            return false;
        }
        return true;
    };


    handleSubmit = (event) => {
        event.preventDefault();
        if (this.validate()) {
        checkUserMobPassword(this.state).then( (res) => {
            console.log(res);
            this.setState({
                token: res.headers.auth,
                userId:res.data.userid
            });
            //  let token=res.headers.auth;
            localStorage.setItem("Token", res.headers.auth);
            
           this.props.save(this.state.token, this.state.userId);
            console.log("state token id user",this.state.userId);
            this.props.history.push("/homepage");
        }).catch( (err) => {
            if(err.response) {
               
                console.log(err.response.data);
            } 
            else {
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
                 <div className="col-md-5 offset-md-4 tp">
                            <h3 >User Login</h3>
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Mobile</label>
                                    <div className="col-sm-7">
                                        <input type="text" onChange={this.handleChange} value={this.state.name} className="form-control" name="mobile" placeholder="Enter your mobile number" />
                                    </div>
                                </div>
                                <p className="adj">{this.state.mobileError}</p>
                                <div className="form-group row">
                                    <label className="col-sm-2 col-form-label">Password</label>
                                    <div className="col-sm-7">
                                        <input type="password" onChange={this.handleChange} value={this.state.name} className="form-control" name="password" placeholder="Enter your password" />
                                    </div>
                                </div>
                                <p className="adj">{this.state.passwordError}</p>
                                <div>
                                <button type="submit" className="btn btn-success">Login</button>
                                </div>
               </form>
               </div>
                </div>
                </div>
            </div>        )
    }
}

const mapStateToProps = (state) => ({
    token: state.myReducertkn.tkn
});

const mapDispatchToProps = (dispatch) => ({
    save: (token,userId) => { 
        dispatch(myActionTkn(token,userId));
     }
  
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);


