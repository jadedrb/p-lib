import { useState } from "react"
import NewBookcase from "./NewBookcase"

const Bookcases = () => {
    let [showBookcases, setShowBookcases] = useState(false)
    return (
        <div className="bookcases">
            <button onClick={() => setShowBookcases(!showBookcases)}>Bookcases</button>
            {showBookcases &&
                <div>
                    <NewBookcase />
                </div> 
            }
        </div>
    )
}

export default Bookcases