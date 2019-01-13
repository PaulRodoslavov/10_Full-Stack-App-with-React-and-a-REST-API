import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Courses from './components/Courses';
import Header from './components/Header';
import CourseDetail from './components/CourseDetail';
import CreateCourse from './components/CreateCourse';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import UpdateCourse from './components/UpdateCourse';
import NotFound from './components/NotFound';
import Forbidden from './components/Forbidden';
import UnhandledError from './components/UnhandledError';
import axios from "axios";




class App extends Component {

   state = {
      user: ''
   }

//function for signIn users

   signIn = (email, pass, history) => {
      // console.log(email, pass)
     axios.get('http://localhost:5000/api/users', {
         auth: {username: email, password: pass}
     })
     .then(response => {
       if(response.status === 200) {
          localStorage.setItem('idUserLogin', response.data._id);
          localStorage.setItem('firstName', response.data.firstName);
          localStorage.setItem('lastName', response.data.lastName);
          localStorage.setItem('password', response.data.password);
          localStorage.setItem('emailAddress', response.data.emailAddress);

         const firstName = localStorage.getItem('firstName');
         const lastName = localStorage.getItem('lastName');
         const password = localStorage.getItem('password');
         const emailAddress = localStorage.getItem('emailAddress');
         const idUserLogin = localStorage.getItem('idUserLogin');
         this.setState({
           user: {firstName, lastName, password, emailAddress, idUserLogin}
         });
         history.goBack();
       }
     })
     .catch(err => console.log(err));
   }


  render() {
     const firstName = localStorage.getItem('firstName');
     const lastName = localStorage.getItem('lastName');
     const password = localStorage.getItem('password');
     const emailAddress = localStorage.getItem('emailAddress');
     const idUserLogin = localStorage.getItem('idUserLogin');
     const user = {firstName, lastName, password, emailAddress, idUserLogin}
     const loggedIn = emailAddress;

    return (
      <BrowserRouter>
         <div className="App">
         <Route path="/" render={() => <Header user={user}/>}/>
         <Switch>
            <Route exact path="/" render={ props => <Courses user={user}/>}/>
            <Route exact path="/courses/create" render= {props => <CreateCourse user={user}/>}/>
            <Route path="/courses/:id/update/" render={ props => <UpdateCourse id={props.match.params.id} user={user}/>}/>
            <Route exact path="/courses/:id/" render={ props => <CourseDetail id={props.match.params.id} user={user}/>}/>
            <Route path="/signin" render={ props => <UserSignIn signIn={this.signIn} history={props.path}/>}/>
            <Route path="/signup" render={() => loggedIn ? ( <Redirect to="/"/>) : (<UserSignUp/>)}/>
            <Route path="/forbidden" component={ Forbidden }/>
            <Route path="/error" component={ UnhandledError }/>
            <Route component={ NotFound }/>
         </Switch>
         </div>
      </ BrowserRouter>
    );
  }
}


export default App;
