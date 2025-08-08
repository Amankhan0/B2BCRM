import React from 'react'
import AccordionSideItem from './AccordionSideItem'

export default function AccordionSide({question,ans,onClick}) {
  return (
    <div className="flex flex-col py-1 px-4  rounded-xl">
      <AccordionSideItem
        title={question}
        content={ans}
        onClick={onClick}
      />
    </div>
  )
}
