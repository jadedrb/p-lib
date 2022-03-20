import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const modal = document.getElementById('modal-root')

const GeneralModal = (props) => {

    const el = document.createElement('div')

    useEffect(() => {
        modal.appendChild(el)
        return () => modal.removeChild(el)
    }, [el])

    let portalStuff = (
      <div className='g-modal'>
        {props.children}
        <div className='modal-cloud' onClick={props.toggle}></div>
      </div>
    )

    return ReactDOM.createPortal(portalStuff, el)
}

export default GeneralModal;