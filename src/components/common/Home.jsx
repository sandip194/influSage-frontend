import React from 'react'
import Sidebar from '../users/deshboardLayout/Sidebar';
import DeshboardHeader from "../users/deshboardLayout/DeshboardHeader"
import {VendorProfileStepper} from "../../pages/vendor/venderProfileCreation/VendorProfileStepper"

export const Home = () => {
  return (
    <div >
      <VendorProfileStepper/>
    </div>
  )
}

export default Home;
