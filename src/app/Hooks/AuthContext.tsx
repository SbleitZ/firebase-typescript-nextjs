import { auth } from "../../../firebase/firebase";
import { createContext, useContext, useEffect, useState } from "react";
import { 
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged, 
  User,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail
} from "firebase/auth";
type AuthContextType = {
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  googleSignIn: () => Promise<UserCredential>;
  resetPassword: (email:string) => Promise<void>;
  updateName: (name:string) => Promise<void>;
  updateEmailP: (email:string) => Promise<void>;
  updateImg: (image:string) => Promise<void>;
};
const updateEmailP = async(email:string) =>{
  if(email == "") return;
  if(auth.currentUser !== null){
    try{
      await updateEmail(auth.currentUser,email)
    }catch(error:any){
      console.error(error);
    }
  }
}
const updateName = async(name:string) => {
 if(name == "") return;
 if(auth.currentUser !== null){
  try {
    await updateProfile(auth.currentUser, {
      displayName: name, 
    })
  } catch (error:any) {
    console.error(error)
  }
 }
}
const updateImg = async(urlImg: string) => {
  if(urlImg == "") return;
  if(auth.currentUser !== null){
   try {
     await updateProfile(auth.currentUser, {
       photoURL: urlImg, 
     })
     console.log(urlImg)
   } catch (error:any) {
     console.error(error)
   }
  }
 }
const login= async(email:string,password:string) => {

  const userCredentials = await signInWithEmailAndPassword(auth,email,password)
  return userCredentials
}
const signup = (email:string,password:string) => createUserWithEmailAndPassword(auth,email,password)
const logout = () => signOut(auth);
const googleSignIn = () => {
  const googleProvider = new GoogleAuthProvider();
  return signInWithPopup(auth,googleProvider)
}
const resetPassword = (email:string) => sendPasswordResetEmail(auth,email);
export const authContext = createContext<AuthContextType | null>({
  login,
  signup,
  logout,
  googleSignIn,
  resetPassword,
  updateName,
  updateEmailP,
  updateImg
});
export function useAuth(){
  const context = useContext(authContext);
  if(!context) throw new Error("There is no auth provider")
  return context;
}
export function useAuthState(){
  const [ user, setUser ] = useState<User | null>({} as User)
  
  useEffect(() =>{
    onAuthStateChanged(auth, currentUser => {
      setUser(currentUser)
    })
  },[])
  return {user, setUser}
}
export default function AuthProvider({children}:{children: React.ReactNode}){
  return (
    <authContext.Provider value={{signup,login,logout,googleSignIn,resetPassword,updateName,updateEmailP,updateImg}}>
      {children}
    </authContext.Provider>
  );
}