import React, { useReducer } from 'react';
import { utilitySelector } from './services/utility';

export const Context = React.createContext()

export const SET_ROOMS = 'SET_ROOMS'
export const ADD_ROOM = 'ADD_ROOM'
export const REMOVE_ROOM = 'REMOVE_ROOM'
export const UPDATE_ROOM = 'UPDATE_ROOM'

export const UPDATE_BOOKCASE = 'UPDATE_BOOKCASE'

export const ADD_BOOK = "ADD_BOOK"
export const UPDATE_BOOK = "UPDATE_BOOK"

export const QUEUE_UPDATE = "QUEUE_UPDATE"
export const FINISH_UPDATE = "FINISH_UPDATE"
export const SET_USER = "SET_USER"

let initialState = {
    books: [],
    rooms: [],
    user: "bob",
    updates: 0
}

function reducer(state, action) {
    switch(action.type) {
        case SET_ROOMS: {
            return { ...state, rooms: action.payload }
        }
        case ADD_ROOM: {
            let newState = { ...state }
            newState.rooms = [...state.rooms, action.payload]
            return newState
        }
        case REMOVE_ROOM: {
            return { ...state, rooms: state.rooms.filter(r => r?.id !== action.payload) }
        }
        case UPDATE_ROOM:
            return {
                ...state,
                rooms: state.rooms.map(r => r.id === action.payload.id ? action.payload : r)
            }
        case UPDATE_BOOKCASE: {
            let { bcId, rmId, bc } = action.payload
            let { roomIndex, rooms, bkcaseIndex, bkcase } = utilitySelector(rmId, bcId, null, state.rooms)
            rooms[roomIndex].bookcases[bkcaseIndex] = { ...bkcase, ...bc }
            console.log(rooms[roomIndex].bookcases[bkcaseIndex])
            console.log(rooms)
            return { ...state, rooms }
        }
        case ADD_BOOK: {
            let { bcid, rid, shid, book, setCurrShelf } = action.payload
            let { roomIndex, rooms, bkcaseIndex, shelfIndex } = utilitySelector(rid, bcid, shid, state.rooms)
            let shelf = rooms[roomIndex].bookcases[bkcaseIndex].shelves[shelfIndex]
            shelf.books = [ ...shelf.books, book ]
            setCurrShelf({ ...shelf })
            return { ...state, rooms }
        }
        case UPDATE_BOOK: {
            console.log('updating...')
            let { bcid, rid, shid, book, bid } = action.payload
            console.log(book)
            let { roomIndex, rooms, bkcaseIndex, shelfIndex } = utilitySelector(rid, bcid, shid, state.rooms, bid)
            let shelf = rooms[roomIndex].bookcases[bkcaseIndex].shelves[shelfIndex]
            shelf.books = shelf.books.map(b => b.id === Number(bid) ? book : b)
            console.log(shelf.books)
            console.log(shelf.books.map(b => b.id === bid ? book : b))
            return { ...state, rooms }
        }
        case QUEUE_UPDATE: {
            return { ...state, updates: state.updates + 1 }
        }
        case FINISH_UPDATE: {
            return { ...state, updates: state.updates - 1 }
        }
        case SET_USER: {
            return { ...state, user: action.payload }
        }
        default:
            return state
    }
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