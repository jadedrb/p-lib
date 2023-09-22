import React, { useReducer, useContext } from 'react';
import { utilitySelector } from './services/utility';

export const Context = React.createContext()

export const SET_ROOMS = 'SET_ROOMS'
export const ADD_ROOM = 'ADD_ROOM'
export const REMOVE_ROOM = 'REMOVE_ROOM'
export const UPDATE_ROOM = 'UPDATE_ROOM'

export const UPDATE_BOOKCASE = 'UPDATE_BOOKCASE'
export const REMOVE_BOOKCASE = 'REMOVE_BOOKCASE'

export const REMOVE_SHELF = 'REMOVE_SHELF'
export const UPDATE_SHELF = 'UPDATE_SHELF'

export const ADD_BOOK = "ADD_BOOK"
export const ADD_BULK = "ADD_BULK"
export const UPDATE_BOOK = "UPDATE_BOOK"
export const REMOVE_BOOK = "REMOVE_BOOK"
export const CURRENT_BOOK = "CURRENT_BOOK"

export const QUEUE_UPDATE = "QUEUE_UPDATE"
export const FINISH_UPDATE = "FINISH_UPDATE"
export const SETUP_COMPLETE = "SETUP_COMPLETE"

export const SET_USER = "SET_USER"
export const UPDATE_SETTINGS = "UPDATE_SETTINGS"

export const TOGGLE_SELECT = "TOGGLE_SELECT"
export const TOGGLE_BKCASE_SELECT = "TOGGLE_BKCASE_SELECT"

export const SET_INITIAL_STATE = "SET_INITIAL_STATE"


let initialState = {
    books: [],
    rooms: [],
    user: false,
    settings: {},
    updates: 0,
    setup: false,
    selected: { toggle: false, highlight: [] },
    currentBook: {},
    reposition: { toggle: false }
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
            
            if (bc.shelves) {
                bkcase.shelves = [...bkcase.shelves, ...bc.shelves]
                delete bc.shelves
                console.log({ ...bkcase, ...bc })
            }
            
            rooms[roomIndex].bookcases[bkcaseIndex] = { ...bkcase, ...bc }
            return { ...state, rooms }
        }
        case REMOVE_BOOKCASE: {
            let { bcid, rid } = action.payload
            let { roomIndex, rooms } = utilitySelector(rid, bcid, null, state.rooms)
            let newBookcases = rooms[roomIndex].bookcases.filter(bk => bk.id !== bcid)
            rooms[roomIndex].bookcases = newBookcases
            return { ...state, rooms }
        }


        case REMOVE_SHELF: {
            let { bcid, rid, shid } = action.payload
            let { roomIndex, rooms, bkcaseIndex } = utilitySelector(rid, bcid, shid, state.rooms)
            let newShelves = rooms[roomIndex].bookcases[bkcaseIndex].shelves.filter(sh => sh.id !== shid)
            rooms[roomIndex].bookcases[bkcaseIndex].shelves = newShelves
            return { ...state, rooms }
        }
        case UPDATE_SHELF: {
            let { bcid, rid, shid, sh } = action.payload
            let { roomIndex, rooms, bkcaseIndex, shelfIndex } = utilitySelector(rid, bcid, shid, state.rooms)
            rooms[roomIndex].bookcases[bkcaseIndex].shelves[shelfIndex].organize = sh.organize
            return { ...state, rooms }
        }


        case ADD_BOOK: {
            let { bcid, rid, shid, book } = action.payload
            let { roomIndex, rooms, bkcaseIndex, shelfIndex } = utilitySelector(rid, bcid, shid, state.rooms)
            let shelf = rooms[roomIndex].bookcases[bkcaseIndex].shelves[shelfIndex]
            
            // for those strange edge cases where state somehow ends up with duplicate book objects
            let checkDuplicate = shelf.books.some(b => b.id === book.id)

            if (checkDuplicate)
                return state

            shelf.books = [ ...shelf.books, book]
            // setCurrShelf({ ...shelf })
            return { ...state, rooms }
        }
        case ADD_BULK: {
            let { bcid, rid, shid, books } = action.payload
            let { roomIndex, rooms, bkcaseIndex, shelfIndex } = utilitySelector(rid, bcid, shid, state.rooms)
            let shelf = rooms[roomIndex].bookcases[bkcaseIndex].shelves[shelfIndex]
            shelf.books = [ ...shelf.books, ...books]
            return { ...state, rooms }
        }
        case UPDATE_BOOK: {
            let { bcid, rid, shid, book, bid } = action.payload
            let { roomIndex, rooms, bkcaseIndex, shelfIndex } = utilitySelector(rid, bcid, shid, state.rooms, bid)
            let shelf = rooms[roomIndex].bookcases[bkcaseIndex].shelves[shelfIndex]
            shelf.books = shelf.books.map(b => b.id === bid ? book : b)
            return { ...state, rooms }
        }
        case REMOVE_BOOK: {
            let { bcid, rid, shid, bid } = action.payload
            let { roomIndex, rooms, bkcaseIndex, shelfIndex } = utilitySelector(rid, bcid, shid, state.rooms, bid)
            let newBooks = rooms[roomIndex].bookcases[bkcaseIndex].shelves[shelfIndex].books.filter(b => b.id !== bid)
            rooms[roomIndex].bookcases[bkcaseIndex].shelves[shelfIndex].books = newBooks
            return { ...state, rooms }
        }
        case CURRENT_BOOK: {
            return { ...state, currentBook: action.payload }
        }

        case TOGGLE_SELECT: {
            if (typeof action.payload === "object")
                return { ...state, selected: { toggle: false, highlight: [] } }
            else if (state.selected.highlight.includes(action.payload))
                return { ...state, selected: { toggle: true, highlight: state.selected.highlight.filter(b => action.payload !== b) } }
            else 
                return { ...state, selected: { toggle: true, highlight: [...state.selected.highlight, action.payload] } }             
        }
        case TOGGLE_BKCASE_SELECT: {
            if (typeof action.payload === "boolean")
                return { ...state, reposition: { toggle: action.payload } }
            else 
                return { ...state, reposition: action.payload }
        }


        case QUEUE_UPDATE: {
            return { ...state, updates: state.updates + 1 }
        }
        case FINISH_UPDATE: {
            return { ...state, updates: state.updates - 1 }
        }
        case SETUP_COMPLETE: {
            return { ...state, setup: true }
        }

        case SET_USER: {
            return { ...state, user: action.payload }
        }

        case UPDATE_SETTINGS:
            return {
                ...state,
                settings: {...state.settings, ...action.payload}
            }
        
        case SET_INITIAL_STATE:
            return initialState
        default:
            return state
    }
}

export function Provider(props) {

    let [state, dispatch] = useReducer(reducer, initialState)

    let { books, rooms, user, selected, reposition, setup, settings, currentBook } = state

    return (
        <Context.Provider value={{ 
            books, 
            rooms, 
            user, 
            selected, 
            reposition, 
            setup, 
            settings, 
            currentBook,
            dispatch 
        }}>
            {props.children}
        </Context.Provider>
    )
}

export const useLibContext = () => useContext(Context)