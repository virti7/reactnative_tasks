
import React,{createContext,useState} from 'react';

export const FavoritesContext=createContext();

export const FavoritesProvider = ({children}) => {
  const [favorites,setFavorites] = useState([]);

  const addFavorite = (event) => {
    setFavorites((prev) => [...prev,event]);
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((item) => item.id!==id));
  };

  const isFavorite = (id) => {
    return favorites.some((item) => item.id===id);
  };

  return (
    <FavoritesContext.Provider
      value={{favorites,addFavorite,removeFavorite,isFavorite}}
    >
      {children}
    </FavoritesContext.Provider>
  );
};