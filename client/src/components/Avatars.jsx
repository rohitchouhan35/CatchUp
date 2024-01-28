import React from 'react'
import Avatar, { genConfig } from 'react-nice-avatar'

const Avatars = () => {
    // const config = genConfig("hi@dapi.to");
    const config = genConfig({ sex: "man", hairStyle: "mohawk" });
    // const config = genConfig();
  return (
    <div className='random-avatar'>
      <Avatar style={{ width: '8rem', height: '8rem' }} {...config} />
    </div>
  )
}

export default Avatars
