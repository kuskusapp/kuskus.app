"use client"
import { observer } from "@legendapp/state/react"
import { DivisionByZeroError } from "edgedb"
import { useEffect, useState } from "react"

interface Props {
	data: any
}

export default observer(function ChatAuth(props: Props) {
	const [question, setQuestion] = useState("")
	const [answers, setAnswers] = useState<string>("")
	const [inputValue, setInputValue] = useState("")

	const handleKeyPress = (event: React.KeyboardEvent) => {
		if (event.key === "Enter") {
			setQuestion(inputValue)
		}
	}
	useEffect(() => {
		console.log(answers)
		if (question) {
			setTimeout(() => {
				setAnswers("The answer is i dont know stop asking")
			}, 500)
		}
	}, [question])

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value)
	}

	return (
		<div className="h-screen w-screen flex">
			<Sidebar />
			<div className=" h-full bg-gray-200 w-full flex flex-col px-[100px] p-2 pt-[50px]">
				<div className="h-[90%]  w-full">
					{question ? (
						<div className="flex flex-col gap-[20px]">
							<div className=" text-black/50 px-3 p-2 w-fit rounded-md bg-gray-300">
								{question}
							</div>
							{answers !== "" ? (
								<div className="text-white/90 rounded-md px-3 p-2 bg-green-500 self-end">
									{answers}
								</div>
							) : null}
						</div>
					) : null}
				</div>
				<div className="h-[10%] p-2  flex items-center justify-center">
					<input
						onChange={handleChange}
						onKeyPress={handleKeyPress}
						className="w-full p-4 py-3 border border-slate-400/80 focus:border-transparent rounded-lg"
						type="text"
					/>
				</div>
			</div>
		</div>
	)
})

function Sidebar() {
	return (
		<div className="w-1/4 min-w-[300px] h-full">
			<div className="flex justify-between items-center w-full p-3">
				<div className="text-[22px] font-bold">KusKus</div>
				<div className="bg-blue-400 text-[14px] text-white rounded-lg px-3 p-2">
					New Chat
				</div>
			</div>
			<div></div>
		</div>
	)
}
