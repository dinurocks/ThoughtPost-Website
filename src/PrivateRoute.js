import React, { Component } from 'react'
import {Redirect, Route} from 'react-router-dom'


export const PrivateRoute= ({component: Component, ...rest}) => (
    <Route 
        {...rest}
        render= {props =>
            localStorage.getItem("Token")?  ( <Component {...props}/>)
            :(
                <Redirect 
                to={"/login"}
                    />

            )
        
        }
    />

);