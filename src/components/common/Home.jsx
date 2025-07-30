import React from 'react'
import Sidebar from '../users/deshboardLayout/Sidebar';
import DeshboardHeader from "../users/deshboardLayout/DeshboardHeader"
import {AgProfileStepper} from "../users/agencyProfile/AgProfileStepper"

export const Home = () => {
  return (
    <div >
      <AgProfileStepper/>
    </div>
  )
}

export default Home;
