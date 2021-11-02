import axios from 'axios'

export const getAllBooks = () => {
    return new Promise((res, rej) => {
        axios
            .get(process.env.API)
            .then(data => res(data))
            .catch(err => rej(err))
    })
}