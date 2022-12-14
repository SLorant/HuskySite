import { useState, useRef, React } from "react";
import ProgressBar from '../watchpagecomp/ProgressBar';
import {  ref, getDownloadURL } from "firebase/storage";
import {  projectStorage } from "../../../firebase/config";
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom';
import ImageEditor from './ImageEditor';
import LargeButton from "../homepagecomp/LargeButton";


const AvatarChooser = ({type}) => {
    const { currentUser } = useAuth()
    const [file, setFile] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);
    const [selected, setSelected] = useState("src/assets/avatars/normalavatar.png" )

    const avatars = [
      {normal : "src/assets/avatars/normalavatar.png"},
      {silly : "src/assets/avatars/sillyavatar.png"},
      {puppy : "src/assets/avatars/puppyavatar.png"},
      {sung : "src/assets/avatars/sunglassesavatar.png"}
    ]
    const [{normal : normalPath}] = avatars;
    const [{silly : sillyPath}] = avatars;
    const [{puppy : puppyPath}] = avatars;
    const [{sung : sungPath}] = avatars;

    const navigate =  useNavigate()
    const [ loading, setLoading] = useState(false)
    
    const uploadType = "profile";
    var editor = "";
    const [picture, setPicture] = useState({
      cropperOpen: false,
      img: null,
      zoom: 2,
      croppedImg: "src/assets/avatars/normalavatar.png"     
    });
//https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png

if( useAuth().currentUser){
  async function SetProfile() {
    try {
      const url = await getDownloadURL(ref(projectStorage, `${currentUser.uid}/profilepics/image`))
      const img = document.getElementById('bigimg')
      img.setAttribute('src', url)
    } catch(error) {
      console.log("user has no profile pic ", error)
    }
  }
  type === "update" ? SetProfile() : ""
}

  const handleFileChange = (e) => {
    console.log("first url:" + picture.img)
    
     let url = URL.createObjectURL(e.target.files[0]);
     
    setPicture({
      ...picture,
      img: url,
      cropperOpen: true
    });
};

const handleOnClick = async (avatar) => {
  setSelected(avatar)
  setPicture({
    ...picture,
    croppedImg: avatar
  })
  const response = await fetch(avatar)
  const file = await response.arrayBuffer()
  var newFile = new File([file], "my_image.png",{type:"image/png", lastModified:new Date().getTime()})
  setFile(newFile)

}

const handleUploadButtonClick = async () => {
    navigate("/")
}
console.log(currentFile)


  return (
      <div className=" flex w-full mt-6 justify-center items-center   flex-col  z-0">
        <div className="flex md:flex-row flex-col md:w-[95%] xl:w-[90%]  h-full ">
         

          <div className={`${ type ==="update" ? "mt-8" : ""}
           flex flex-col  items-center justify-center gap-2   w-full `}>
             <p className=" font-header  text-lg text-center text-blue mb-2">Choose from these avatars</p>
            <div className="grid  grid-cols-2 gap-4 mb-4">
           
                {avatars.map((avatar, index) => {
        const avatarPath = Object.values(avatar)[0]
        return (
            <img key={index} 
                className={`${selected === avatarPath ? "opacity-100" : "opacity-50"} w-28 md:w-24 lg:w-28 xl:w-[145px] 2xl:w-32 cursor-pointer rounded-full`}
                onClick={() => handleOnClick(avatarPath)}
                src={avatarPath}
                alt="avatar"
            />
        )
    })}
            </div>

        <div className="flex flex-col justify-center items-center mt-2 gap-0">
          <p className=" font-header text-lg text-center text-blue mb-2">Or upload your own image</p>
        {/*   <motion.button  className="text-lg flex justify-center  items-center bg-sand w-32 xl:w-40  h-10 text-blue
                hover:bg-blue hover:text-peach font-headersc  rounded-md  "
         whileHover={{ scale: 1.1, transition: { duration: 0.2 }}}>
          <label htmlFor="files" className=" w-40 flex justify-center items-center cursor-pointer w-40 ">Upload</label>
          <input className="hidden" id="files" type="file" accept="image/*" onChange={handleFileChange} />
         </motion.button> */}

         <motion.button  className="uploadbutton flex justify-center items-center bg-cream  w-32  h-12 md:h-12  text-blue
    hover:bg-blue hover:text-peach font-headersc  rounded-md "
         whileHover={{ scale: 1.1, transition: { duration: 0.2 },  }}>
          <label htmlFor="files" className=" w-32 gap-1 flex text-lg text-center justify-center items-center cursor-pointer">Upload
          <svg xmlns="http://www.w3.org/2000/svg" className=" z-50  lg:w-auto icon  icon-tabler icon-tabler-file-upload" width="48" height="48" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2D4550" fill="none" strokeLinecap="round" strokeLinejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
  <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
  <line x1="12" y1="11" x2="12" y2="17" />
  <polyline points="9 14 12 11 15 14" />
</svg></label>
        <input className="hidden" id="files" type="file" accept="image/*" onChange={handleFileChange} />
        
         </motion.button>

       

        
          </div>
         
          </div>

          <div className="w-full flex flex-col items-center  justify-start ">
          <img id="bigimg" src={picture.croppedImg}
          className="w-60  md:w-60 lg:w-72 mt-10 lg:mt-6 xl:mt-0 xl:w-80 2xl:w-[425px] rounded-full  "/>
          <p className="mt-2 font-header lg:text-lg text-center text-blue">Your chosen profile</p>
          <motion.button onClick={handleUploadButtonClick} className="text-lg flex justify-center items-center bg-sand 
         w-24 md:w-28 lg:w-32 xl:w-32 h-12 md:mt-2 md:mb-0 my-4 text-blue hover:bg-blue hover:text-peach font-header rounded-md "
    whileHover={{ scale: 1.1, transition: { duration: 0.2 }}}>I'm done</motion.button>
          </div>

          
      
    

        </div>
        {picture.cropperOpen && <ImageEditor setFile={setFile} picture={picture} setPicture={setPicture} editor={editor}   />}

     {/*    <Link  className={`${ type ==="update" ? "hidden" : "block"}`} to="/profile"> */}

     <div className="w-full flex  items-around justify-between">
     <div className="w-1/2 ml-8  h-4 ">
     {file && 
      <ProgressBar setLoading={setLoading} file={file} setFile={setFile} uploadType={uploadType} />
       }</div>

    
        
    
     
     
    </div>
      </div>
  );
};

export default AvatarChooser;