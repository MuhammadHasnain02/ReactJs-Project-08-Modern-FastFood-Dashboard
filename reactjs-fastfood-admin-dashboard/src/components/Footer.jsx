import { useContext } from "react"
import { ThemeContext } from "./ThemeContext"

function Footer() {
    const { darkMode, setDarkMode } = useContext(ThemeContext)
    
    return (

    <footer
        className={`transition-all duration-300 fixed bottom-0 flex flex-row items-center justify-between w-full px-10 py-2.5 text-[15px] backdrop-blur-lg border-t
            ${darkMode 
            ? "bg-gray-900 text-gray-300 border-gray-700" 
            : "bg-gray-50 text-gray-500 border-gray-300"
            }
        `}>

        <p className="font-medium">© 2025 Profile Dash | All rights reserved</p>

        <div className="flex gap-4 mt-2">
            <a
            target="_blank"
            href="https://www.facebook.com"
            className={`${darkMode ? "hover:text-gray-400" : "hover:text-gray-400"} text-[21px]`}
            >
            <i className="fa-brands fa-facebook"></i>
            </a>

            <a
            target="_blank"
            href="https://www.instagram.com"
            className={`${darkMode ? "hover:text-gray-400" : "hover:text-gray-400"} text-[21px]`}
            >
            <i className="fa-brands fa-instagram"></i>
            </a>

            <a
            target="_blank"
            href="https://x.com"
            className={`${darkMode ? "hover:text-gray-400" : "hover:text-gray-400"} text-[21px]`}
            >
            <i className="fa-brands fa-x-twitter"></i>
            </a>

            <a
            target="_blank"
            href="https://www.youtube.com"
            className={`${darkMode ? "hover:text-gray-400" : "hover:text-gray-400"} text-[21px]`}
            >
            <i className="fa-brands fa-youtube"></i>
            </a>
        </div>

    </footer>


    )

}


export default Footer