import Link from 'next/link'
import React from 'react'

function Header() {
  return (
    <header className='flex justify-between p-5 max-w-7xl mx-auto '>
      <div className='flex items-center space-x-5'>
        
        <Link href='/'>
            <img className='object-fit w-44 cursor-pointer' src='http://links.papareact.com/yvf/'/>
        </Link>
    
        <div className='hidden sm:inline-flex items-center space-x-5 '>
           
            <h3>About</h3>
            <h3>Contact</h3>
            <h3 className='text-white bg-green-600 px-4 py-1 rounded-full'>Follow</h3>

        </div>
      </div>
        
        <div className='flex space-x-5 items-center text-green-600  '>
            <h3>signin</h3>
            <h3 className='border px-4 py-1 border-green-600 rounded-full'>Get started</h3>
            

        </div>
    
    </header>
  )
}

export default Header
