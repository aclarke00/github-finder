import React, { Fragment, Component } from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import NavBar from './Components/Layout/NavBar'
import Users from './Components/Users/Users'
import Search from './Components/Users/Search'
import Alert from './Components/Layout/Alert'
import About from './Components/Pages/About'
import User from './Components/Users/User'
import axios from 'axios'


class App extends Component {

  state = {
    users: [],
    user: {},
    repos: [],
    loading: false, 
    alert: null
  }

  // async componentDidMount() {

  //   //console.log(process.env.REACT_APP_GITHUB_CLIENT_ID)

  //   this.setState({
  //     loading: true
  //   })
  //   const res = await axios.get(`https://api.github.com/users?client_id${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);

  //   this.setState({
  //     users: res.data,
  //     loading: false
  //   })
  //   console.log(res.data, 'hello')

  // }

  // Search github users
  searchUsers = async (text) => {

    this.setState({
      loading: true
    })

    const res = await axios.get(

      `https://api.github.com/search/users?q=${text}&client_id${
        process.env.REACT_APP_GITHUB_CLIENT_ID
        }&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      );

    this.setState({
      users: res.data.items,
      loading: false
    })
  }

  // FETCH to GET a single user

  getUser = async (username) => {

    this.setState({
      loading: true
    })

    const res = await axios.get(
        `https://api.github.com/users/${username}?client_id${
        process.env.REACT_APP_GITHUB_CLIENT_ID
        }&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      );

    this.setState({
      user: res.data,
      loading: false
    })

  }

  // get user's repos
  
  getUserRepos = async (username) => {

    this.setState({
      loading: true
    })

    const res = await axios.get(
        `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id${
        process.env.REACT_APP_GITHUB_CLIENT_ID
        }&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      );

    this.setState({
      repos: res.data,
      loading: false
    })

  }

  clearUsers = () => {
    this.setState({
      users: [],
      loading: false
    })
  }

  setAlert = (msg, type) => {
    this.setState({
      alert: {
        msg: msg,
        type: type
      }
    })
    setTimeout(() => this.setState({ alert: null }), 5000)
  }

  
  render(){
    
    const { users, user, loading, repos } = this.state

    return (
      <Router>
      <div className="App">
          <NavBar />
          <div className="container">
            <Alert alert={this.state.alert} />
            <Switch>
                <Route exact path="/" render={props => ( 
                  <Fragment>

                    <Search searchUsers={this.searchUsers}
                      clearUsers={this.clearUsers} 
                      showClear={ users.length > 0 ? true : false } 
                      setAlert={this.setAlert} />
                    <Users loading={loading} 
                      users={users}/>


                  </Fragment>
                )} />

                <Route exact path="/about" component={About} />
                <Route exact path="/user/:login" render={props => (
                  <User {...props } getUser={this.getUser} getUserRepos={this.getUserRepos} user={user} loading={loading} repos={repos} />
                )} />

            </Switch>



          </div>
      </div>
      </Router>

    );

  }


}

export default App;
