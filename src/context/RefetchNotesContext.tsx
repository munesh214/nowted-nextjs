import {createContext, useState} from "react";
interface RefetchNotesInterface{
    trigger?:boolean;
    setTrigger?: React.Dispatch<React.SetStateAction<boolean>>;
}

const RefetchNotesContext = createContext<RefetchNotesInterface | undefined>(undefined);

const RefetchNotesProvider = ({ children }: { children: React.ReactNode }) => {
    const [trigger, setTrigger] = useState<boolean>(true);
    
    return (
        <RefetchNotesContext.Provider value={{ trigger, setTrigger }}>
            {children}
        </RefetchNotesContext.Provider>
    );
};

export {RefetchNotesContext, RefetchNotesProvider}