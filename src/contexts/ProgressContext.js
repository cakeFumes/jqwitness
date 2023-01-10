import React from 'react';
import puzzleList from '../puzzleList.json'
import { createContext, useState, useReducer} from 'react';

export const ProgressContext = createContext();

//State is a dictionary (of chapters) of dictionaries (of puzzles). Eg:
/*
{
    0: {
        completed: false,
        "Welcome!":{
            completed: false,
            query: ''
        },
        "sometitle":{
            completed: false,
            query: ''
        }
    }
}
*/
const initialState = {};

const ProgressContextProvider = (props) => {
    const [progress, setProgressState] = useState(() => {
        const localData = localStorage.getItem('progress');
        return localData ? JSON.parse(localData) : initialState;
    });
    
    const setProgress = (val) => {
        localStorage.setItem('progress', JSON.stringify(val));
        setProgressState(val);
    }

    //FOR INDIVIDUAL PUZZLES ONLY. For whole progress, import { progress }
    const getProgress = (currentPuzzle) => {
        if(progress[currentPuzzle.chapter]){
            if(progress[currentPuzzle.chapter][currentPuzzle.puzzle]){
                return progress[currentPuzzle.chapter][currentPuzzle.puzzle];
            }
        }
        return {"completed": false, "query": ""};
    }

    /*const setProgressComplete = (currentPuzzle) => {
        var newProgress = JSON.parse(JSON.stringify(progress));
        if(!newProgress[currentPuzzle.chapter]) newProgress[currentPuzzle.chapter] = {"completed": false};
        if(!newProgress[currentPuzzle.chapter][currentPuzzle.puzzle]) newProgress[currentPuzzle.chapter][currentPuzzle.puzzle] = {"completed": false, "query": ""};
        newProgress[currentPuzzle.chapter][currentPuzzle.puzzle].completed = true;
        var completeCheck = true;
        puzzleList[currentPuzzle.chapter].puzzles.map((puzzle) => {
            if(newProgress[currentPuzzle.chapter][currentPuzzle.puzzle]){//If we don't have this if statement, an undone puzzle will cause undef deref
                completeCheck &= newProgress[currentPuzzle.chapter][currentPuzzle.puzzle].completed;
            } else completeCheck = false;
        });
        newProgress[currentPuzzle.chapter].completed = completeCheck;
        setProgress(newProgress);//try chapter completion
    }

    const setProgressQuery = (currentPuzzle, query) => {
        var newProgress = JSON.parse(JSON.stringify(progress));
        if(!newProgress[currentPuzzle.chapter]) newProgress[currentPuzzle.chapter] = {};
        if(!newProgress[currentPuzzle.chapter][currentPuzzle.puzzle]) newProgress[currentPuzzle.chapter][currentPuzzle.puzzle] = {"completed": false, "query": ""};
        newProgress[currentPuzzle.chapter][currentPuzzle.puzzle].query = query;
        setProgress(newProgress);
    }*/

    const setProgressWrapper = (currentPuzzle, query, completed) => {
        var newProgress = JSON.parse(JSON.stringify(progress));
        if(!newProgress[currentPuzzle.chapter]) newProgress[currentPuzzle.chapter] = {"completed": false};
        if(!newProgress[currentPuzzle.chapter][currentPuzzle.puzzle]) newProgress[currentPuzzle.chapter][currentPuzzle.puzzle] = {"completed": false, "query": ""};
        newProgress[currentPuzzle.chapter][currentPuzzle.puzzle].query = query;
        newProgress[currentPuzzle.chapter][currentPuzzle.puzzle].completed |= completed;
        var completeCheck = true;
        puzzleList[currentPuzzle.chapter].puzzles.map((puzzle, puzzleIndex) => {
            if(newProgress[currentPuzzle.chapter][puzzleIndex]){//If we don't have this if statement, an undone puzzle will cause undef deref
                completeCheck &= newProgress[currentPuzzle.chapter][puzzleIndex].completed;
            } else completeCheck = false;
        });
        newProgress[currentPuzzle.chapter].completed = completeCheck;
        setProgress(newProgress);//try chapter completion
    }

    const resetProgress = () => {
        setProgress(initialState);
    }
    
    return(
        <ProgressContext.Provider value={{progress, setProgressWrapper, resetProgress, getProgress}}>
            {props.children}
        </ProgressContext.Provider>
    );
}

export default ProgressContextProvider;