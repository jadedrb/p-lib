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

    addRoom = (room, cb) => {
        console.log(this.state.rooms.concat([room]), "<---")
        this.setState({ rooms: this.state.rooms.concat([room]) }, () => {
            console.log('in...')
            cb(0, this.state.rooms)
        })
    }

    updateRoom = (room) => {
        console.log(room.id, ' : room to be updated')
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