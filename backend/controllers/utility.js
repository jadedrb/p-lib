function constructUpdateQuery(oldRow, updatesForRow, paramId) {

    // Compare old books columns with new book columns
    // and reduce it to an array -> [ ['author','new-name'], ['genre', 'new-genre'] ]
    const updatedColumns = Object.keys(oldRow).reduce((acc, curr) => typeof updatesForRow[curr] !== 'undefined' && oldRow[curr] !== updatesForRow[curr] ? [...acc, [curr, updatesForRow[curr]]] : acc, [])

    // Construct a SET clause with only the updated fields and the id at the end -> 'author = $1, genre = $2 WHERE id = $3'
    const AFTERSET = updatedColumns.reduce((acc, c, i, arr) => arr.length > (i + 1) ? acc + `${c[0]} = $${i + 1}, ` : acc + `${c[0]} = $${i + 1}${oldRow.recorded_on ? ', recorded_on = NOW()' : ''} WHERE id = $${i + 2}`, '')

    // Construct an ARGS array with the updates and the id at the end -> ['Charles Dickens', 'Novel', '3810']
    const ARGS = updatedColumns.reduce((acc, c, i, arr) => arr.length > i + 1 ? [...acc, c[1]] : [...acc, c[1], paramId], [])

    return [AFTERSET, ARGS]
}

function constructColumnsValuesAndArgs(resource) {
    const COLUMNS = Object.keys(resource).join(', ')
    const VALUES = Object.values(resource).map((_, i) => `$${i + 1}`).join(', ')
    const ARGS = Object.values(resource)
    return { COLUMNS, VALUES, ARGS }
}

module.exports = {
    constructUpdateQuery,
    constructColumnsValuesAndArgs
}