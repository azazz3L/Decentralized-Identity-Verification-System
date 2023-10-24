import React from 'react'
import { Link } from 'react-router-dom'

export default function SelectModal(props) {


    const handleUserClick = () => {
        props.setUser(true)
    }

    const handleRequesterClick = () => {
        props.setRequester(true)
    }
  return (
    <div>
      <Link className="user" onClick={handleUserClick} to='/user'>User</Link>
      <Link className="requester mx-3"onClick={handleRequesterClick} to='/requester'>Requester</Link>
    </div>
  )
}
