import { type Editor } from '@tiptap/react'
import { useState, type FC } from 'react'

type Props = {
  editor: Editor
  onClick: ()=> void
}

export const MenuAI: FC<Props> = ({ editor, onClick }) => {
  const [input, setInput] = useState('')

  function getApiResult() {
    // TODO: Send the input data to the api call
    editor.chain().insertContent(input).run()
    onClick()
  }

  return (
    <section className="bg-zinc-700 py-2 px-6 rounded-xl flex max-w-[700px] items-center">
      {/* TODO: add Star Logo */}
      <input
        className="flex-1 bg-zinc-700 text-zinc-50 outline-none"
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.currentTarget.value)
        }}
        placeholder="Ask anything to AI"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            getApiResult()
          }
        }}
      />
      <button
        className="p-1 mx-1 w-fit rounded-full bg-indigo-500 hover:bg-indigo-900 outline-none focus:outline-none"
        onClick={getApiResult}
      >
        {/* TODO: Add a submit logo */}
      </button>
    </section>
  )
}
