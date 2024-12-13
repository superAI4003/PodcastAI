import React, { useState }  from 'react';

interface GeneratedTextPanelProps {
    currentIndex:number;
    generatedText:Array<{id: number, script: any[], category:string}>;
    setGeneratedText: (text: Array<{id: number, script: any[], category:string}>) => void;
    isEditGeneratedText:boolean;
}

export const GeneratedTextPanel: React.FC<GeneratedTextPanelProps> = ({
 currentIndex, 
 generatedText,
 setGeneratedText,
 isEditGeneratedText
}) => {

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>, messageIndex: number) => {
        const newGeneratedText = [...generatedText]; // create a copy of the generatedText array
        newGeneratedText[currentIndex - 1].script[messageIndex].text = e.currentTarget.textContent || ''; // update the text at the current index
        setGeneratedText(newGeneratedText); // save the updated generatedText array
      };
    
      return (
        <>
        {generatedText.length > 0 &&
            generatedText[currentIndex - 1] &&
            generatedText[currentIndex - 1].script.map((message, index) => (
      
              <div
                key={index}
                contentEditable={isEditGeneratedText}
                onBlur={(e) => handleBlur(e, index)}
                className={` max-w-[60%] mb-4 p-3 rounded-lg hover:outline-none focus:outline-none  ${
                  index % 2 === 1
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-300 text-black self-start"
                }
                    ${isEditGeneratedText?"border-b border-black": "border-b border-black"}
                `
            }
              >
                {message.text} 
              </div>
            ))}
            </>
      );
    };