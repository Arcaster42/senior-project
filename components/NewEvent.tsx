import React from 'react'
import {
  StyleSheet,
  Button,
  View,
  Text,
  TextInput,
  ScrollView
} from 'react-native'
import ModalDropdown from 'react-native-modal-dropdown'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { connect } from 'react-redux'
import { createEvent } from '../src/actions/events'
import axios from 'axios'
import Modal from 'react-native-modal'
import * as ImagePicker from 'expo-image-picker'
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import { apiUrl } from '../environment'

interface UserLimited {
  first_name: string
  email: string
  profile_photo: string
}

interface Props {
  visible: boolean
  createEvent: Function
  currentUserLimited: UserLimited
}
interface Event {
  name: string
  location: string
  description: string
  cover_photo: string
  limit: number | null
  start: Date | null
  end: Date | null
  tags: string[]
}
interface State {
  newEvent: Event
  tagsString: string
  showStartDate: boolean
  showEndDate: boolean
}

class NewEvent extends React.Component<Props, State> {
  state = {
    showStartDate: false,
    showEndDate: false,
    tagsString: '',
    newEvent: {
      name: '',
      location: '',
      description: '',
      cover_photo: '',
      limit: 10,
      start: null,
      end: null,
      tags: [],
      creator: this.props.currentUserLimited
    }
  }

  getPermission = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      if (status !== 'granted')
        alert('Sorry, we need camera roll permissions to make this work!')
      else this.pickImage()
    }
    this.pickImage()
  }

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All
    })

    console.log(result)

    if (!result.cancelled) {
      const newEvent = { ...this.state.newEvent }
      newEvent.cover_photo = result.uri
      this.setState({ newEvent }, async () => {
        console.log('This is image', this.state.newEvent.cover_photo)
        const imageURL = await axios.post(`${apiUrl}/upload`, result, {
          headers: {
            'Content-Type': 'image'
          }
        })
        console.log(imageURL)
      })
    }
  }

  render() {
    return (
      <Modal
        isVisible={this.props.visible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={1}
        backdropColor="white"
      >
        <ScrollView contentContainerStyle={styles.newEvent}>
          <View style={styles.text__formgroup}>
            <Text style={styles.input__text}>Name your Event!</Text>
            <TextInput
              style={styles.event__input}
              onChangeText={text =>
                this.setState({
                  newEvent: { ...this.state.newEvent, name: text }
                })
              }
            />
            <Text style={styles.input__text}>Set a Location!</Text>
            <TextInput
              style={styles.event__input}
              onChangeText={text =>
                this.setState({
                  newEvent: { ...this.state.newEvent, location: text }
                })
              }
            />
            <Text style={styles.input__text}>Tell us about it!</Text>
            <TextInput
              style={styles.event__input}
              onChangeText={text =>
                this.setState({
                  newEvent: { ...this.state.newEvent, description: text }
                })
              }
            />
            <Text>Attendee Limit</Text>
            <ModalDropdown
              options={Array.from(Array(101).keys()).slice(1)}
              onSelect={selection =>
                this.setState({
                  newEvent: { ...this.state.newEvent, limit: selection }
                })
              }
            />
            <Button
              title="Select Start"
              onPress={() => this.setState({ showStartDate: true })}
            />
            <DateTimePicker
              isVisible={this.state.showStartDate}
              mode="datetime"
              minimumDate={new Date()}
              onConfirm={date =>
                this.setState({
                  newEvent: { ...this.state.newEvent, start: date }
                })
              }
              onCancel={() => this.setState({ showStartDate: false })}
            />
            <Button
              title="Select End"
              onPress={() => this.setState({ showEndDate: true })}
            />
            <DateTimePicker
              isVisible={this.state.showEndDate}
              mode="datetime"
              minimumDate={new Date()}
              onConfirm={date =>
                this.setState({
                  newEvent: { ...this.state.newEvent, end: date }
                })
              }
              onCancel={() => this.setState({ showEndDate: false })}
            />
            <Text>Cover Photo</Text>
            <Button title="Upload Photo" onPress={this.getPermission} />
            <Text>Tags: {this.state.tagsString}</Text>
            <ModalDropdown
              options={[
                'music',
                'sports',
                'art',
                'food',
                'social',
                'pet-friendly',
                'kid-friendly',
                'alcohol',
                'language',
                'education',
                'tech',
                'dance',
                'books'
              ]}
              onSelect={(index, value) => {
                this.state.newEvent.tags.length === 0
                  ? this.setState({
                      tagsString: this.state.tagsString.concat(value)
                    })
                  : this.setState({
                      tagsString: this.state.tagsString.concat(', ' + value)
                    })
                this.setState({
                  newEvent: {
                    ...this.state.newEvent,
                    tags: [...this.state.newEvent.tags, value]
                  }
                })
              }}
            />
            <Button
              title="Submit"
              onPress={() => this.props.createEvent(this.state)}
            />
          </View>
        </ScrollView>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  picker: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  text__formgroup: {
    width: '90%'
  },
  newEvent: {
    marginTop: 60,
    alignItems: 'center'
  },
  event__input: {
    height: 50,
    borderColor: 'gray',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 30,
    marginBottom: 30,
    textAlign: 'center'
  },
  input__text: {
    alignSelf: 'center',
    fontWeight: '700'
  }
})

const mapStateToProps = state => {
  return {
    visible: state.showNewEventForm,
    currentUserLimited: {
      first_name: state.user.first_name,
      email: state.user.email,
      profile_photo: state.user.profile_photo
    }
  }
}
const mapDispatchToProps = dispatch => {
  return {
    createEvent: newEvent => dispatch(createEvent(newEvent))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewEvent)
