import React, { useReducer } from 'react';

export const Context = React.createContext()

export const ADD_ROOM = 'ADD_ROOM'
export const REMOVE_ROOM = 'REMOVE_ROOM'
export const UPDATE_ROOM = 'UPDATE_ROOM'

let initialState = {
    books: [],
    rooms: [],
    user: 'bob'
}

function reducer(state, action) {
    switch(action.type) {
        case ADD_ROOM: {
            let newState = { ...state }
            newState.rooms = [...state.rooms, action.payload.room]
            action.payload.switchRoom(0, newState.rooms)
            return newState
        }
        case REMOVE_ROOM: {
            let newState = { ...state }
            newState.rooms = state.rooms.filter(r => r.id !== action.payload.room.id)
            action.payload.switchRoom(0, newState.rooms)
            return newState
        }
        case UPDATE_ROOM:
            return {
                ...state,
                rooms: state.rooms.map(r => r.id === action.payload.id ? action.payload : r)
            }
    }
    return state
}

export function Provider(props) {

    let [state, dispatch] = useReducer(reducer, initialState)

    let { books, rooms, user } = state

    return (
        <Context.Provider value={{ books, rooms, user, dispatch }}>
            {props.children}
        </Context.Provider>
    )
}