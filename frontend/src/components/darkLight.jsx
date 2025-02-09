import React, { useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { gsap } from "gsap";

// const initialState = { darkMode: false };
export default function DarkLightToggle() {
    const theme ='dark'
//   const [state, dispatch] = useReducer(reducer, initialState);

//   useEffect(() => {
//     gsap.to("body", {
//       backgroundColor: state.darkMode ? "#1a202c" : "#f7fafc",
//       color: state.darkMode ? "#f7fafc" : "#1a202c",
//       duration: 0.5,
//     });
//   }, [state.darkMode]);

  return (
    <div style={{position:"fixed" ,right:50 ,top:"85vh" ,zIndex:200

    }} className="flex items-center justify-center  
-7 bg-transparent">
       <button
        //   onClick={handleToggle}
        className="p-2 rounded-full shadow-md transition-transform transform hover:scale-110"
      >
    
        {theme === "dark" ? (
            <FaMoon className="text-gray-800 w-6 h-6" />
        ) : (
            <FaSun className="text-yellow-400 w-6 h-6" />
        )}
      </button>
    </div>
  );
}
