import React, { useReducer } from 'react';

export const Context = React.createContext()

export const ADD_ROOM = 'ADD_ROOM'
export const REMOVE_ROOM = 'REMOVE_ROOM'
export const UPDATE_ROOM = 'UPDATE_ROOM'
export const SET_CURRENT = 'SET_CURRENT'

export const UPDATE_BOOKCASE = 'UPDATE_BOOKCASE'

let initialState = {
    books: [],
    rooms: [],
    user: 'bob',
    current: { rm: 0, bc: 0 }
}

function reducer(state, action) {
    switch(action.type) {
        case ADD_ROOM: {
            let newState = { ...state }
            newState.rooms = [...state.rooms, action.payload.room]
            //action.payload.switchRoom(0, newState.rooms)
            return newState
        }
        case REMOVE_ROOM: {
            let newState = { ...state }
            newState.rooms = state.rooms.filter(r => r.id !== action.payload.room.id)
            //action.payload.switchRoom(0, newState.rooms)
            return newState
        }
        case UPDATE_ROOM:
            return {
                ...state,
                rooms: state.rooms.map(r => r.id === action.payload.id ? action.payload : r)
            }
        case SET_CURRENT: 
            return {
                ...state,
                current: action.payload
            }
        case UPDATE_BOOKCASE: {
            let { bcId, rmId, bc } = action.payload
            let rooms = [ ...state.rooms ]
            let roomIndex = rooms.findIndex((r) => r.id === rmId)
            let room = rooms[roomIndex]
            let bkcaseIndex = room.bookcases.findIndex((b) => b.id === bcId)
            let bkcase = room.bookcases[bkcaseIndex]
            rooms[roomIndex].bookcases[bkcaseIndex] = { ...bkcase, ...bc }
            return { ...state, rooms }
        }
        default:
            return state
    }
}

export function Provider(props) {

    let [state, dispatch] = useReducer(reducer, initialState)

    let { books, rooms, user, current } = state

    return (
        <Context.Provider value={{ books, rooms, user, current, dispatch }}>
            {props.children}
        </Context.Provider>
    )
}