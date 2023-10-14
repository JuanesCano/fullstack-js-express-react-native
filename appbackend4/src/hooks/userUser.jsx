import { useContext } from "react"
import { userContext } from "../context/UserContext"

export const useUser = () => {
    const context = useContext(userContext)
    if(!context){
        throw new Error("UseUser debe estar dentro de el provedor")
    };

    return context
}