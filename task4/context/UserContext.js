import React,{createContext,useState} from "react";

export const UserContext=createContext();

export const UserProvider=({children}) => {
    const [user,setUser] = useState({
        name:"",
        email:"",
        password:"",  
        profilePic:null,
        contactNo:""
    });

    const signup=(data)=>{
        setUser(data);
    };

    const login = (email,password) => {
        return user.email === email && user.password === password;
    };

    const updateProfile = (updatedData) => {
        setUser({...user,...updatedData});
    };

    return (
        <UserContext.Provider value={{user,signup,login,updateProfile}}>
            {children}
        </UserContext.Provider>
    );
};
