import puzzleList from '../puzzleList.json'
import React, { createContext, useState } from 'react';

export const PuzzleContext = createContext();

/*
{
    chapter:0,
    puzzle: 0
}
*/

const initialState = {
    chapter: 0,
    puzzle: 0
}

const PuzzleContextProvider = (props) => {
    const [currentPuzzle, setPuzzleState] = useState(() => {
        const localData = localStorage.getItem('currentPuzzle');
        return localData ? JSON.parse(localData) : initialState;
    });

    const setCurrentPuzzle = (val) => {
        localStorage.setItem('currentPuzzle', JSON.stringify(val));
        setPuzzleState(val);
    }

    const getPuzzleLink = () => {
        var pageLink = 'puzzles/' + puzzleList[currentPuzzle.chapter].foldername + '/' + puzzleList[currentPuzzle.chapter].puzzles[currentPuzzle.puzzle].file;
        return pageLink;
    }

    return(
        <PuzzleContext.Provider value={{currentPuzzle, setCurrentPuzzle, getPuzzleLink}}>
            {props.children}
        </PuzzleContext.Provider>
    );
}

export default PuzzleContextProvider;