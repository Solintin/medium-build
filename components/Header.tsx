import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Header() {
  return (
    <header className='flex justify-between p-5 max-w-7xl mx-auto'>
      <div className='flex items-center space-x-5'>
        <div>
          <Link href="/">
            <img
              src="http://logok.org/wp-content/uploads/2020/10/Medium-logo-2020-symbol.png"
              className="w-44 object-contain cursor-pointer"
            />
          </Link>
        </div>

        <div className='hidden md:inline-flex items-center space-x-5'>
          <h3>About</h3>
          <h3>Contact</h3>
          <h3 className='text-white bg-green-600 px-4 py-1 rounded-full'>Follow</h3>
        </div>
      </div>


      <div className='flex items-center space-x-5 text-green-600'>
          <h3>Sign In</h3>
          <h3 className='border px-4 py-1 rounded-full border-green-600'> Get Started</h3>
      </div>
    </header>
  )
}

export default Header
