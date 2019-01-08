import React from 'react'

const FaceRecognition = ({ imageUrl }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img
          id="imageInput"
          src={imageUrl}
          alt="face-detection"
          width="500px"
          height="auto"
        />
      </div>
    </div>
  )
}

export default FaceRecognition
