import React, { useState }  from 'react';

interface TitleProps {
    parameters:string[];
    currentIndex:number;   
    isEditGeneratedText:boolean; 
    setParameters: (parameters: string[]) => void;
    generatedText:Array<{id: number, script: any[], category:string}>;
    setGeneratedText: (text: Array<{id: number, script: any[], category:string}>) => void;
    genStatus:string[];
}

export const Title: React.FC<TitleProps> = ({
 parameters,
 currentIndex,
 isEditGeneratedText,
 generatedText,
 setGeneratedText,
 setParameters,
 genStatus,
}) => {
    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        const newParameters = [...parameters]; // create a copy of the parameters array
        newParameters[currentIndex-1] = e.currentTarget.textContent || ''; // update the value at the currentIndex
        setParameters(newParameters); // save the updated parameters array
      };
      const handleBlurcate = (e: React.FocusEvent<HTMLDivElement>) => {
        const newParameters = [...generatedText]; // create a copy of the parameters array
        newParameters[currentIndex-1].category = e.currentTarget.textContent || ''; // update the value at the currentIndex
       setGeneratedText(generatedText)
      }; 
  return (
    <div className='flex gap-3'>
      {isEditGeneratedText ? (
       <>
       <div contentEditable="true" onBlur={handleBlur}  className="border-b pl-10 border-gray-300 rounded p-1 hover:outline-none focus:outline-none ">
       {parameters[currentIndex-1]}
      </div>
      <div contentEditable="true" onBlur={handleBlurcate}  className="text-gray-800 border-b  border-gray-300 rounded p-1 hover:outline-none focus:outline-none ">
      {generatedText[currentIndex-1].category ? generatedText[currentIndex-1].category : 'Not selected'}
      </div>
      </>
      ) : (
        <>
        <div className='pl-10'>
          {parameters[currentIndex-1].length > 45 ? `${parameters[currentIndex-1].slice(0, 45)} ...` : parameters[currentIndex-1]}
        </div>
        <div className=' text-gray-800 relative  '>
        { 
        generatedText[currentIndex-1] && generatedText[currentIndex-1].category ? generatedText[currentIndex-1].category : 'Not selected'}
        <p className='absolute text-[12px] text px-1 bg-yellow-300 rounded-md top-0 -right-16'>Category</p>
        </div>
        <span className='pl-20'>{genStatus[currentIndex-1]}</span>
        </>
      )} 
    </div>
  );
};

