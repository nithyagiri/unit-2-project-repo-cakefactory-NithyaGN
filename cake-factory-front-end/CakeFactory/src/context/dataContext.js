import { createContext, useState, useContext, useEffect} from 'react';
import Cakes from '../classes/Cakes';

export const DataContext = createContext();

export const DataContextProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);

    // Cake states
    const [allCakes, setAllCakes] = useState(null);
    const [currentCakes, setCurrentCakes] = useState(null);

    
    // FETCH ALL CAKES

    const fetchCakes = async () => {
        const cakes = [];

        const response = await fetch("http://localhost:8080/api/cakes");
    
        const data = await response.json();
        
        data.forEach(cake => {
                    let newCake = new Cakes(
                        cake.id,
                        cake.name,
                        cake.description,
                        cake.price,
                        cake.customization,
                        cake.category,
                        cake.image_id,
                        cake.sizes,
                        cake.flavors,
                        cake.fillings,
                        cake.canWriteMessage
                    );
                    cakes.push(newCake);
                });
         
            setAllCakes(cakes);
            setCurrentCakes(cakes);
        }
    
 
    // INITIAL FETCH on mount
    
    useEffect(() => {
        fetchCakes();
    }, []);

    // SET LOADING FALSE when cakes are loaded

    useEffect(() => {
        if (allCakes !== null) {
            setIsLoading(false);
        }
    }, [allCakes]);

    return (
        <DataContext.Provider
            value={{isLoading, allCakes, currentCakes, setCurrentCakes, fetchCakes}}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        console.error("useData must be used within a DataProvider");
    }
    return context;
};
