import React, { Component } from 'react';

export const Context = React.createContext()

export class Provider extends Component {
    constructor() {
        super()
        this.state = {
            books: []
        }
    }

    render() {

        return (
            <Context.Provider value={ { books: this.state.books, user: 'bob' }}>
                {this.props.children}
            </Context.Provider>
        )
    }
}