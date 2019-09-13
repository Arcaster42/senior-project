import React, { Component } from 'react'
import { View, Button, Text, Image, StyleSheet, TextInput } from 'react-native'
import { connect } from 'react-redux'
import axios from 'axios'
import { apiUrl } from '../environment.js'
import Profile from './Profile'
import Results from './Results'
import Inbox from './Inbox'

interface Props {
  toggleView: Function
  setAllUsers: Function
  activeView: String
  context: Function
}

class Main extends Component<Props> {
  async componentDidMount() {
    this.props.socket.send(`l0 ${this.props.email}`)
    this.props.socket.onmessage = (event) => {
      const message = event.data.split(' ')
      if (message[0] === 'm0') {
        //GET CHAT AGAIN

      }
    }
    // this.props.setAllUsers(res.data.data.Users)
  }

  render() {
    let mainView

    if (this.props.activeView === 'profile') {
      mainView = <Profile />
    } else if (this.props.activeView === 'results') {
      mainView = <Results />
    } else if (this.props.activeView === 'chats') {
      mainView = <Inbox socket={this.props.socket} />
    }
    return <View style={styles.main}>{mainView}</View>
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 11,
    backgroundColor: 'white'
  }
})

const mapStateToProps = state => {
  return {
    activeView: state.activeView,
    allUsers: state.allUsers,
    email: state.user.email
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setActiveView: activeView => {
      dispatch({
        type: 'SET_ACTIVE_VIEW',
        activeView: activeView
      })
    },
    setAllUsers: allUsers => {
      dispatch({
        type: 'SET_ALL_USERS',
        allUsers: allUsers
      })
    },
    updateChat: chat => {
      dispatch({
        type: "SHOW_CHAT",
        messages: chat
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main)
