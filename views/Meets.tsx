import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TextInput } from "react-native"
import { connect } from "react-redux"

export class Meets extends Component {

    render() {
        const dummyUsers = this.props.activeUsers.map((user, index) => {
            return (
                <Text style={{ color: "white" }} key={index} >{user}</Text>
            )
        })

        return (
            <View style={styles.meets}>
                <Text style={{ color: "white" }}>This is the meets component</Text>
                <>{dummyUsers}</>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    meets: {
        flex: 1,
        backgroundColor: "red",
    }
})

const mapStateToProps = state => {
    return {
        activeUsers: state.activeUsers,
    }
}

// const mapDispatchToProps = dispatch => {

// }

export default connect(mapStateToProps)(Meets)