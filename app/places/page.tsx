"use client"
import Header from "@/components/Header"
import Search from "@/components/Search"
import ViewPost from "@/components/ViewPost"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Swiper, SwiperSlide } from "swiper/react"

const recommendedPlaces = [
	{
		id: "place1",
		name: "Place 1",
		category: "coffeeshop",
		imageUrl:
			"https://storage.ronin.co/spa_m8okrzy9ivjnlsr8/dc57049b-41f6-47ce-8254-436a971291e7",
	},
	{
		id: "place2",
		name: "Place 2",
		category: "coffeeshop",
		imageUrl:
			"https://storage.ronin.co/spa_m8okrzy9ivjnlsr8/dc57049b-41f6-47ce-8254-436a971291e7",
	},
	{
		id: "place3",
		name: "Place 3",
		category: "coffeeshop",
		imageUrl:
			"https://storage.ronin.co/spa_m8okrzy9ivjnlsr8/dc57049b-41f6-47ce-8254-436a971291e7",
	},
	{
		id: "place4",
		name: "Place 4",
		category: "coffeeshop",
		imageUrl:
			"https://storage.ronin.co/spa_m8okrzy9ivjnlsr8/dc57049b-41f6-47ce-8254-436a971291e7",
	},
	{
		id: "place5",
		name: "Place 5",
		category: "coffeeshop",
		imageUrl:
			"https://storage.ronin.co/spa_m8okrzy9ivjnlsr8/dc57049b-41f6-47ce-8254-436a971291e7",
	},
	{
		id: "place6",
		name: "Place 6",
		category: "coffeeshop",
		imageUrl:
			"https://storage.ronin.co/spa_m8okrzy9ivjnlsr8/dc57049b-41f6-47ce-8254-436a971291e7",
	},
]

export default function Places() {
	const [inputFocused, setInputFocused] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState<number | null>(null)

	const [hovered, setHovered] = useState("")

	return (
		<>
			{isModalOpen !== null ? (
				<ViewPost
					post={recommendedPlaces[isModalOpen]}
					setIsModalOpen={setIsModalOpen}
				/>
			) : null}
			<Header />

			<div className=" justify-center px-5 pt-5 mt-5 relative">
				<div className="w-full flex-center">
					<Search />
				</div>
				<div className="pb-20 space-y-10">
					<div className="pt-10">
						<div className="relative z-10 w-full flex">
							<div className="absolute z-20 top-[50%] left-0 translate-y-[50%] border-b h-0 border-white/30 w-full"></div>
							<h2 className="text-[28px] z-30 bg-primary pr-5 w-fit font-bold ">
								Places we recommend for you in{" "}
								<span className="">[City, Country]</span>
							</h2>
						</div>
						<Swiper
							className="mt-5 w-full"
							spaceBetween={4}
							slidesPerView={5}
							onSlideChange={() => {}}
							onSwiper={(swiper) => {}}
						>
							{recommendedPlaces.map((place, index) => (
								<SwiperSlide key={place.id}>
									<div
										onMouseEnter={() => setHovered(place.id)}
										onMouseLeave={() => setHovered(place.id)}
										className=" w-full min-h-[500px] relative"
										onClick={() => setIsModalOpen(index)}
									>
										<AnimatePresence>
											{hovered === place.id ? (
												<motion.div
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													exit={{ opacity: 0 }}
													className="absolute bottom-0 left-0 p-2 text-white z-20"
												>
													<div className="font-bold">{place.name}</div>
													<div className="opacity-50 text-[14px]">
														{place.category}
													</div>
												</motion.div>
											) : null}
										</AnimatePresence>
										<Image
											className="rounded-lg"
											src={place.imageUrl}
											alt={place.name}
											layout="fill"
											objectFit="cover"
											sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
											priority
										/>
									</div>
								</SwiperSlide>
							))}
						</Swiper>
					</div>

					<div>
						<div className="relative z-10 w-full flex justify-end">
							<div className="absolute z-20 top-[50%] left-0 translate-y-[50%] border-b h-0 border-white/30 w-full"></div>
							<h2 className="text-[28px] z-30 bg-primary pl-5 w-fit font-bold ">
								Just Opened! Check it Out
							</h2>
						</div>
						<Swiper
							className="mt-5 w-full"
							spaceBetween={4}
							slidesPerView={5}
							onSlideChange={() => {}}
							onSwiper={(swiper) => {}}
						>
							{recommendedPlaces.map((place) => (
								<SwiperSlide key={place.id}>
									<div
										onMouseEnter={() => setHovered(place.id)}
										onMouseLeave={() => setHovered(place.id)}
										className=" w-full min-h-[500px] relative"
									>
										<AnimatePresence>
											{hovered === place.id ? (
												<motion.div
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													exit={{ opacity: 0 }}
													className="absolute bottom-0 left-0 p-2 text-white z-20"
												>
													<div className="font-bold">{place.name}</div>
													<div className="opacity-50 text-[14px]">
														{place.category}
													</div>
												</motion.div>
											) : null}
										</AnimatePresence>

										<Image
											className="rounded-lg"
											src={place.imageUrl}
											alt={place.name}
											layout="fill"
											objectFit="cover"
											sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
											priority
										/>
									</div>
								</SwiperSlide>
							))}
						</Swiper>
					</div>

					<div>
						<div className="relative z-10 w-full flex">
							<div className="absolute z-20 top-[50%] left-0 translate-y-[50%] border-b h-0 border-white/30 w-full"></div>
							<h2 className="text-[28px] z-30 bg-primary pr-5 w-fit font-bold ">
								Just Opened! Check it Out
							</h2>
						</div>
						<Swiper
							className="mt-5 w-full"
							spaceBetween={4}
							slidesPerView={5}
							onSlideChange={() => {}}
							onSwiper={(swiper) => {}}
						>
							{recommendedPlaces.map((place) => (
								<SwiperSlide key={place.id}>
									<div
										onMouseEnter={() => setHovered(place.id)}
										onMouseLeave={() => setHovered(place.id)}
										className=" w-full min-h-[500px] relative"
									>
										<AnimatePresence>
											{hovered === place.id ? (
												<motion.div
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													exit={{ opacity: 0 }}
													className="absolute bottom-0 left-0 p-2 text-white z-20"
												>
													<div className="font-bold">{place.name}</div>
													<div className="opacity-50 text-[14px]">
														{place.category}
													</div>
												</motion.div>
											) : null}
										</AnimatePresence>
										<Image
											className="rounded-lg"
											src={place.imageUrl}
											alt={place.name}
											layout="fill"
											objectFit="cover"
											sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
											priority
										/>
									</div>
								</SwiperSlide>
							))}
						</Swiper>
					</div>
				</div>
			</div>
		</>
	)
}
