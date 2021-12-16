import React, { Component } from 'react';

export const Context = React.createContext()

export class Provider extends Component {
    constructor() {
        super()
        this.state = {
            books: [],
            rooms: [],
            user: 'bob'
        }
    }

    addRoom = (room) => {
        console.log(this.state.rooms.concat([room]), "<---")
        this.setState({ rooms: this.state.rooms.concat([room]) })
    }

    updateRoom = (room) => {
        this.setState({ rooms: this.state.rooms.map(r => r.id === room.id ? room : r) })
    }

    render() {

        let { books, rooms, user } = this.state
        let { addRoom, updateRoom } = this

        return (
            <Context.Provider value={{ books, rooms, user, addRoom, updateRoom }}>
                {this.props.children}
            </Context.Provider>
        )
    }
}