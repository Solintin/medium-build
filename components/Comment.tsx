import React from 'react'

export const Comment = ({comments}) => {
  return (
    <div>
        <h3>Comments</h3>
        <hr />

        {comments.map(comment) => ( <div>
            <p> {comment.name} : {comment.comment} </p>
        </div> )}
    </div>
  )
}
